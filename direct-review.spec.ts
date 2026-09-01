import { test, expect, type Frame, type Locator } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';

const reviewUrl =
  'https://cfpet.ephesoft.cloud/dcma/ReviewValidate.html?batch_id=BI400460&source_id=BatchList';

const batchId = new URL(reviewUrl).searchParams.get('batch_id') ?? 'batch';

type DocumentEntry = { frame: Frame; locator: Locator; label: string; documentType: string | null };
type FieldInputMap = Map<string, Locator>;

function artifactName(documentEntry: DocumentEntry, index: number, suffix: string): string {
  const type = documentEntry.documentType ?? 'document';
  const safeType = type.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  return `${batchId}_${documentEntry.label}_${safeType}_${suffix}`;
}

async function collectDocuments(page: import('@playwright/test').Page): Promise<DocumentEntry[]> {
  let firstSeenAttempt = -1;
  for (let attempt = 0; attempt < 40; attempt++) {
    for (const frame of page.frames()) {
      const labels = frame.locator('text=/^DOC\\d+$/');
      const count = await labels.count().catch(() => 0);
      if (count === 0) continue;

      if (firstSeenAttempt === -1) firstSeenAttempt = attempt;
      // keep polling for a few seconds after the first row appears so later rows aren't missed
      if (attempt - firstSeenAttempt >= 5) {
        const finalCount = await labels.count().catch(() => count);
        const results: DocumentEntry[] = [];
        for (let index = 0; index < finalCount; index++) {
          const label = labels.nth(index);
          const row = label.locator('xpath=ancestor::*[@role="treeitem"][1]');
          const clickable = (await row.count().catch(() => 0)) > 0 ? row.first() : label;
          const rowText = (((await clickable.textContent().catch(() => '')) ?? '') || ((await label.textContent().catch(() => '')) ?? ''))
            .replace(/\s+/g, ' ')
            .trim();
          const labelText = ((await label.textContent().catch(() => '')) ?? '').trim();
          const documentType = rowText.replace(new RegExp(`^${labelText}\\s*`), '').trim() || null;
          results.push({ frame, locator: clickable, label: labelText, documentType });
        }
        return results;
      }
      break;
    }
    await page.waitForTimeout(1000);
  }
  return [];
}

async function waitForDocumentImage(page: import('@playwright/test').Page): Promise<Locator | null> {
  for (let attempt = 0; attempt < 30; attempt++) {
    for (const frame of page.frames()) {
      const images = frame.locator('#overlay-image, img').filter({ visible: true });
      const count = await images.count().catch(() => 0);
      for (let index = 0; index < count; index++) {
        const image = images.nth(index);
        const box = await image.boundingBox().catch(() => null);
        const loaded = await image.evaluate((element) => {
          const candidate = element as HTMLImageElement;
          return candidate.complete && candidate.naturalWidth > 200;
        }).catch(() => false);
        if (!box || box.width < 300 || box.height < 200 || !loaded) continue;

        const initialBox = `${box.x}:${box.y}:${box.width}:${box.height}`;
        await page.waitForTimeout(500);
        const finalBox = await image.boundingBox().catch(() => null);
        if (finalBox && `${finalBox.x}:${finalBox.y}:${finalBox.width}:${finalBox.height}` === initialBox) {
          return image;
        }
      }
    }
    await page.waitForTimeout(500);
  }
  return null;
}

function sourceFieldLabelsFor(documentType: string | null): string[] {
  if (documentType === 'Invoice') {
    return ['PetName', 'Invoice Date', 'Invoice Number', 'Invoice Tax', 'NetTotal', 'Invoice Total'];
  }
  if (documentType === 'Claim Form') {
    return ['Claim Amount'];
  }
  return ['PetName', 'Invoice Date', 'Invoice Number', 'Invoice Tax', 'NetTotal', 'Invoice Total', 'Claim Amount'];
}

async function hasLabeledField(page: import('@playwright/test').Page, documentType: string | null = null): Promise<boolean> {
  const sourceFieldLabels = sourceFieldLabelsFor(documentType);
  const ignoredLabels = new Set(['id', 'name', 'document type', 'fuzzy search']);
  const toolbarPattern = /validate|next batch|merge|split|table|more/i;
  for (const frame of page.frames()) {
    for (const fieldLabel of sourceFieldLabels) {
      const visibleFieldLabel = frame.getByText(fieldLabel, { exact: true }).first();
      if (await visibleFieldLabel.isVisible({ timeout: 250 }).catch(() => false)) return true;
    }

    const candidates = frame.locator('td, th, div, span, label');
    const count = Math.min(await candidates.count().catch(() => 0), 500);
    for (let index = 0; index < count; index++) {
      const label = candidates.nth(index);
      const text = ((await label.textContent().catch(() => '')) ?? '').trim();
      if (!text || text.length > 40 || ignoredLabels.has(text.toLowerCase())) continue;
      if (toolbarPattern.test(text)) continue;
      if (!(await label.isVisible().catch(() => false))) continue;

      const row = label.locator('xpath=ancestor::tr[1]');
      const rowCellCount = await row.locator('td').count().catch(() => 0);
      if (rowCellCount > 3) continue;

      const hasRowControl = rowCellCount > 0 && (await row.locator('input, select, textarea').count().catch(() => 0)) > 0;
      const hasSiblingControl = (await label.locator('xpath=..').locator('input, select, textarea').count().catch(() => 0)) > 0;
      if (hasRowControl || hasSiblingControl) return true;
    }
  }
  return false;
}

async function currentDocumentType(page: import('@playwright/test').Page): Promise<string | null> {
  for (const frame of page.frames()) {
    const documentTypeInput = frame.locator('#rv-documentType-comboBox-input').first();
    if (await documentTypeInput.isVisible({ timeout: 250 }).catch(() => false)) {
      const value = await documentTypeInput.inputValue().catch(() => '');
      if (value.trim()) return value.trim();
    }
  }
  return null;
}

async function isMiddlePanelLoaded(page: import('@playwright/test').Page, expectedDocumentType: string | null): Promise<boolean> {
  if (expectedDocumentType) {
    const actualDocumentType = await currentDocumentType(page);
    if (actualDocumentType !== expectedDocumentType) return false;
  }

  return hasLabeledField(page, expectedDocumentType);
}

async function waitForMiddlePanel(
  page: import('@playwright/test').Page,
  documentLocator: Locator,
  expectedDocumentType: string | null,
  maxAttempts = 40,
): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (await isMiddlePanelLoaded(page, expectedDocumentType)) return true;
    // middle panel didn't load yet, re-click the document in the left panel
    await documentLocator.click().catch(() => {});
    await page.waitForTimeout(1000);
  }
  return isMiddlePanelLoaded(page, expectedDocumentType);
}

async function resetPageScroll(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.querySelectorAll('*').forEach((element) => {
      if (element instanceof HTMLElement) {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      }
    });
  }).catch(() => {});
  for (const frame of page.frames()) {
    await frame.evaluate(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.querySelectorAll('*').forEach((element) => {
        if (element instanceof HTMLElement) {
          element.scrollTop = 0;
          element.scrollLeft = 0;
        }
      });
    }).catch(() => {});
  }
}

function money(raw: string): number | null {
  const value = Number(raw.replace(/[$,\s]/g, ''));
  return Number.isFinite(value) ? value : null;
}

function firstAmount(raw: string): number | null {
  const match = raw.match(/-?\d[\d,]*(?:\.\d{1,2})?/);
  return match?.[0] ? money(match[0]) : null;
}

function valuesMatch(label: string, actual: string, expected: string): boolean {
  if (actual.trim() === expected.trim()) return true;

  if (/amount|tax|total/i.test(label)) {
    const actualAmount = firstAmount(actual);
    const expectedAmount = firstAmount(expected);
    return actualAmount !== null && expectedAmount !== null && Math.abs(actualAmount - expectedAmount) < 0.01;
  }

  return false;
}

function formatInvoiceDate(raw: string): string {
  const dayMonthYear = raw.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!dayMonthYear) return raw.trim();

  const monthNumbers: Record<string, string> = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
  };
  const [, day, monthName, year] = dayMonthYear;
  const month = monthNumbers[monthName.toLowerCase()];
  return month ? `${month}/${day.padStart(2, '0')}/${year}` : raw.trim();
}

function addLineLayoutFields(lines: string[], fields: Record<string, string>): void {
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const nextLine = lines[index + 1] ?? '';

    if (/invoice\s+date/i.test(line) && /invoice\s+number/i.test(line)) {
      const invoiceLine = nextLine.match(/(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}).*?#\s*([A-Z0-9-]{4,})/i);
      if (invoiceLine) {
        fields['Invoice Date'] = formatInvoiceDate(invoiceLine[1]);
        fields['Invoice Number'] = invoiceLine[2].trim();
      }
    }

    if (/customer\s+name/i.test(line) && /animal\s+name/i.test(line)) {
      const names = nextLine.trim().match(/^(.+?)\s+([A-Za-z][A-Za-z'-]*)$/);
      if (names) {
        fields['Client Name'] = fields['Client Name'] ?? names[1].replace(/,/g, '').trim();
        fields.PetName = fields.PetName ?? names[2].trim();
      }
    }
  }
}

function parseFields(text: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const patterns: Array<[RegExp, string]> = [
    [/(?:Pet\s*Name|Patient)\s*[:\-]?\s*([A-Za-z][A-Za-z ]{1,40})/i, 'PetName'],
    [/Phone[:\s]*\(?([\d\-\(\)\s]{10,}?)\)?(?:\s+\w+:|$)/i, 'Phone'],
    [/Species[:\s]+(Canine|Feline|Equine|Cat|Dog|Bird|Reptile|Horse)(?:\s|$)/i, 'Species'],
    [/Breed[:\s]+([A-Z][A-Za-z\s\-]{2,20}?)(?:\s{2,}|$)/i, 'Breed'],
    [/Sex[:\s]+(Male|Female|Spayed|Neutered|M|F)(?:\s|$)/i, 'Sex'],
    [/Address[:\s]+([^\n]+)/i, 'Address'],
    [/Total\s+amount\s+claimed[:\s]+[^\d]*(\d[\d,]*(?:\.\d{1,2})?)/i, 'Claim Amount'],
    [/(?:Invoice\s+Number|Invoice\s*#|Order\s*#)[:\s]*([A-Z0-9\-]{5,})/i, 'Invoice Number'],
    [/Invoice\s+Date[:\s]+([\d\/\-]+|[A-Za-z]+\s+\d+,?\s+\d{4})/i, 'Invoice Date'],
    [/Client[:\s]*([A-Z][A-Za-z\s]{2,}?)\s*\(/i, 'Client Name'],
    [/Age[:\s]+(\d+\s*(?:years?|months?)|[A-Za-z]+)/i, 'Age'],
  ];
  for (const [pattern, label] of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) fields[label] = match[1].trim();
  }

  addLineLayoutFields(lines, fields);

  const subtotalMatch = text.match(/\b(?:item\s*\(?s\)?\s*)?sub[\s-]*total\s*[:\-]?\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i);
  const subtotal = subtotalMatch?.[1] ? money(subtotalMatch[1]) : null;
  if (subtotal !== null) {
    const taxes = text.split(/\r?\n/)
      .filter((line) => /\b(?:sales\s+tax|tax|taxes)\b/i.test(line) && !/(?:before|including)\s+tax/i.test(line))
      .map((line) => [...line.matchAll(/\$?\s*([\d,]+(?:\.\d{1,2})?)/g)])
      .map((matches) => matches.length ? money(matches[matches.length - 1][1]) : null)
      .filter((value): value is number => value !== null)
      .reduce((total, value) => total + value, 0);
    const beforeTaxMatch = text.match(/\btotal\s+before\s+tax\s*[:\-]?\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i);
    const beforeTax = beforeTaxMatch?.[1] ? money(beforeTaxMatch[1]) : null;
    fields['Invoice tax'] = taxes.toFixed(2);
    fields['Net total'] = subtotal.toFixed(2);
    fields['Invoice Total'] = (subtotal - taxes).toFixed(2);
    if (beforeTax !== null) fields['Net total'] = beforeTax.toFixed(2);
  }
  return fields;
}

function normalizedFieldName(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function labelAliases(label: string): string[] {
  const aliases: Record<string, string[]> = {
    PetName: ['PetName', 'Pet Name', 'Animal Name', 'Animal name', 'Patient'],
    Phone: ['Phone', 'Phone Number'],
    Species: ['Species'],
    Breed: ['Breed'],
    Sex: ['Sex'],
    Address: ['Address'],
    'Invoice Number': ['Invoice Number', 'Invoice #', 'Order #'],
    'Invoice Date': ['Invoice Date', 'Date'],
    'Client Name': ['Client Name', 'Customer Name', 'Client'],
    Age: ['Age'],
    'Claim Amount': ['Claim Amount', 'claimed', 'Total amount claimed'],
    'Invoice tax': ['Invoice tax', 'Invoice Tax', 'Tax'],
    'Net total': ['Net total', 'Net Total', 'Total before tax', 'Subtotal', 'Amount paid'],
    'Invoice Total': ['Invoice Total', 'Total', 'Amount paid'],
  };
  return aliases[label] ?? [label];
}

function descriptorMatchesLabel(descriptor: string, normalizedLabels: Set<string>): boolean {
  const normalizedDescriptor = normalizedFieldName(descriptor);
  if (normalizedLabels.has(normalizedDescriptor)) return true;

  for (const normalizedLabel of normalizedLabels) {
    if (normalizedLabel.length > 3 && normalizedDescriptor.includes(normalizedLabel)) return true;
  }
  return false;
}

async function firstVisibleControl(locator: Locator): Promise<Locator | null> {
  const count = await locator.count().catch(() => 0);
  for (let index = 0; index < count; index++) {
    const control = locator.nth(index);
    if (await control.isVisible().catch(() => false)) return control;
  }
  return null;
}

async function findOrderedIndexPanelInput(frame: Frame, label: string): Promise<Locator | null> {
  const indexFieldLabels = ['PetName', 'Invoice Date', 'Invoice Number', 'Invoice tax', 'Net total', 'Invoice Total'];
  const labelIndex = indexFieldLabels.findIndex((candidate) => normalizedFieldName(candidate) === normalizedFieldName(label));
  if (labelIndex === -1) return null;

  const controls = frame.locator('input[type="text"], textarea').filter({ visible: true });
  const editableControls: Locator[] = [];
  const count = await controls.count().catch(() => 0);
  for (let index = 0; index < count; index++) {
    const control = controls.nth(index);
    const controlId = await control.getAttribute('id').catch(() => null);
    const rowText = ((await control.locator('xpath=ancestor::tr[1]').textContent().catch(() => '')) ?? '').trim();
    if (controlId === 'rv-documentType-comboBox-input' || controlId === 'rv-fuzzySearch-textBox-input') continue;
    if (/Validate|Next Batch|Merge|Split|Table|More/.test(rowText)) continue;
    editableControls.push(control);
  }

  return editableControls[labelIndex] ?? null;
}

async function buildFieldInputMap(page: import('@playwright/test').Page): Promise<FieldInputMap> {
  const fieldMap: FieldInputMap = new Map();
  const fieldsById: Record<string, string> = {
    PetName: 'PetName',
    InvoiceDate: 'Invoice Date',
    InvoiceNumber: 'Invoice Number',
    InvoiceTax: 'Invoice tax',
    NetTotal: 'Net total',
    InvoiceTotal: 'Invoice Total',
    ClaimAmount: 'Claim Amount',
  };

  for (const frame of page.frames()) {
    for (const [id, label] of Object.entries(fieldsById)) {
      const input = frame.locator(`#${id} input, #${id} textarea, #${id}, input[id*="${id}"], textarea[id*="${id}"]`).filter({ visible: true }).first();
      if (await input.isVisible({ timeout: 50 }).catch(() => false)) {
        fieldMap.set(normalizedFieldName(label), input);
      }
    }

    const orderedLabels = ['PetName', 'Invoice Date', 'Invoice Number', 'Invoice tax', 'Net total', 'Invoice Total'];
    const controls = frame.locator('input[type="text"], textarea').filter({ visible: true });
    const editableControls: Locator[] = [];
    const count = await controls.count().catch(() => 0);
    for (let index = 0; index < count; index++) {
      const control = controls.nth(index);
      const controlId = await control.getAttribute('id').catch(() => null);
      const rowText = ((await control.locator('xpath=ancestor::tr[1]').textContent().catch(() => '')) ?? '').trim();
      if (controlId === 'rv-documentType-comboBox-input' || controlId === 'rv-fuzzySearch-textBox-input') continue;
      if (/Validate|Next Batch|Merge|Split|Table|More/.test(rowText)) continue;
      editableControls.push(control);
    }

    for (let index = 0; index < orderedLabels.length && index < editableControls.length; index++) {
      fieldMap.set(normalizedFieldName(orderedLabels[index]), editableControls[index]);
    }
  }

  return fieldMap;
}

async function findFieldInput(page: import('@playwright/test').Page, label: string): Promise<Locator | null> {
  const normalizedLabels = new Set(labelAliases(label).map(normalizedFieldName));
  for (const frame of page.frames()) {
    const directControls = frame.locator('input, textarea, select').filter({ visible: true });
    const directControlCount = await directControls.count().catch(() => 0);
    for (let index = 0; index < directControlCount; index++) {
      const control = directControls.nth(index);
      const descriptor = await control.evaluate((element) => [
        element.getAttribute('aria-label'),
        element.getAttribute('title'),
        element.getAttribute('name'),
        element.getAttribute('id'),
      ].filter(Boolean).join(' ')).catch(() => '');
      if (descriptorMatchesLabel(descriptor, normalizedLabels)) return control;
    }

    const orderedControl = await findOrderedIndexPanelInput(frame, label);
    if (orderedControl) return orderedControl;

    const labels = frame.locator('td, th, div, span, label');
    const count = Math.min(await labels.count().catch(() => 0), 1000);
    for (let index = 0; index < count; index++) {
      const labelElement = labels.nth(index);
      const elementLabel = ((await labelElement.textContent().catch(() => '')) ?? '')
        .trim();
      const normalizedElementLabel = normalizedFieldName(elementLabel);
      if (!normalizedLabels.has(normalizedElementLabel)) continue;

      const row = labelElement.locator('xpath=ancestor::tr[1]');
      const rowControl = await firstVisibleControl(row.locator('input, textarea, select'));
      if (rowControl) return rowControl;

      const parentControl = await firstVisibleControl(labelElement.locator('xpath=..').locator('input, textarea, select'));
      if (parentControl) return parentControl;

      const fieldContainerControl = await firstVisibleControl(
        labelElement.locator('xpath=ancestor::*[contains(@class, "field") or contains(@class, "Field")][1]').locator('input, textarea, select'),
      );
      if (fieldContainerControl) return fieldContainerControl;

      const followingControl = await firstVisibleControl(
        labelElement.locator('xpath=following::input[not(@type="hidden")][1] | following::textarea[1] | following::select[1]'),
      );
      if (followingControl) return followingControl;
    }
  }
  return null;
}

function findMappedFieldInput(fieldMap: FieldInputMap, label: string): Locator | null {
  for (const alias of labelAliases(label)) {
    const input = fieldMap.get(normalizedFieldName(alias));
    if (input) return input;
  }
  return null;
}

async function fillField(page: import('@playwright/test').Page, fieldMap: FieldInputMap, label: string, value: string): Promise<boolean> {
  const input = findMappedFieldInput(fieldMap, label) ?? await findFieldInput(page, label);
  if (!input || !(await input.isVisible({ timeout: 100 }).catch(() => false))) return false;

  const tagName = await input.evaluate((element) => element.tagName.toLowerCase());
  if (tagName === 'select') {
    const option = input.locator('option').filter({ hasText: value }).first();
    if (await option.count()) await input.selectOption({ label: value });
    else await input.selectOption({ value }).catch(() => {});
  } else {
    await input.click();
    await input.selectText().catch(() => {});
    await input.fill(value);
  }
  await input.press('Tab').catch(() => {});
  await input.evaluate((element) => {
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }).catch(() => {});

  const currentValue = await input.inputValue().catch(() => '');
  return valuesMatch(label, currentValue, value);
}

async function fillBlankFields(page: import('@playwright/test').Page, fields: Record<string, string>): Promise<void> {
  const fieldMap = await buildFieldInputMap(page);
  for (const [label, value] of Object.entries(fields)) {
    const input = findMappedFieldInput(fieldMap, label) ?? await findFieldInput(page, label);
    if (!input || !(await input.isVisible({ timeout: 100 }).catch(() => false))) continue;
    const currentValue = await input.inputValue().catch(() => '');
    if (currentValue.trim()) continue;

    const filled = await fillField(page, fieldMap, label, value);
    console.log(`${filled ? 'Filled blank' : 'Skipped blank'} ${label}=${value}`);
  }
}

async function clickTableButton(page: import('@playwright/test').Page): Promise<boolean> {
  for (const frame of page.frames()) {
    const tableButton = frame
      .locator('button, div, span, td')
      .filter({ hasText: /^Table$/ })
      .filter({ visible: true })
      .first();
    if (await tableButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await tableButton.click();
      return true;
    }
  }
  return false;
}

type TransactionRow = {
  transactionDate: string;
  description: string;
  quantity: string;
  price: string;
};

function parseTransactionRows(ocrText: string, invoiceDate: string | undefined): TransactionRow[] {
  const transactionDate = invoiceDate ? formatInvoiceDate(invoiceDate) : '';
  const lines = ocrText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const headerIndex = lines.findIndex((line) => /\bdescription\b.*\b(?:qty|quantity)\b.*\b(?:total|price)\b/i.test(line));
  if (headerIndex === -1) return [];

  const rows: TransactionRow[] = [];
  for (const line of lines.slice(headerIndex + 1)) {
    if (/^(?:sub\s*total|including\s+tax|total|payment|amount\s+paid|balance)\b/i.test(line)) break;
    const row = line.match(/^(.*?)\s+(\d+(?:\.\d+)?)\s+\$?(-?[\d,]+(?:\.\d{1,2})?)$/);
    if (!row) continue;

    const price = money(row[3]);
    if (price === null || price <= 0) continue;
    const description = row[1].replace(/\s+[A-Z][A-Za-z'-]*\s+[A-Z][A-Za-z'-]*,?\s+(?:DVM|VMD|Dr\.?|Vet(?:erinarian)?)$/i, '').trim();
    if (!description) continue;
    rows.push({ transactionDate, description, quantity: row[2], price: price.toFixed(2) });
  }
  return rows;
}

async function clickInsertButton(page: import('@playwright/test').Page): Promise<boolean> {
  for (const frame of page.frames()) {
    const insertButton = frame.locator('button, div, span, td').filter({ hasText: /^Insert$/ }).filter({ visible: true }).first();
    if (await insertButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await insertButton.click();
      return true;
    }
  }
  return false;
}

async function clickDeleteAllButton(page: import('@playwright/test').Page): Promise<boolean> {
  for (const frame of page.frames()) {
    const deleteAllButton = frame.locator('button, div, span, td').filter({ hasText: /^Delete All$/ }).filter({ visible: true }).first();
    if (await deleteAllButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await deleteAllButton.click();
      return true;
    }
  }
  return false;
}

async function clickValidateButton(page: import('@playwright/test').Page): Promise<boolean> {
  for (const frame of page.frames()) {
    const validateButton = frame.locator('#rv-Review-Validate-Batch').first();
    if (await validateButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await validateButton.evaluate((element) => (element as HTMLElement).click());
      return true;
    }
  }
  return false;
}

async function validationSucceeded(page: import('@playwright/test').Page): Promise<boolean> {
  for (const frame of page.frames()) {
    const validateButton = frame.locator('#rv-Review-Validate-Batch').first();
    if (!(await validateButton.isVisible({ timeout: 100 }).catch(() => false))) continue;
    const className = await validateButton.getAttribute('class').catch(() => '');
    return !/RVButtonDirtyCss/.test(className ?? '');
  }
  return false;
}

async function clickFieldViewButton(page: import('@playwright/test').Page): Promise<boolean> {
  for (const frame of page.frames()) {
    const fieldViewButton = frame.locator('button, div, span, td').filter({ hasText: /^Field View$/ }).filter({ visible: true }).first();
    if (await fieldViewButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await fieldViewButton.evaluate((element) => (element as HTMLElement).click());
      return true;
    }
  }
  return false;
}

async function waitForTransactionTable(page: import('@playwright/test').Page): Promise<Frame | null> {
  for (let attempt = 0; attempt < 30; attempt++) {
    for (const frame of page.frames()) {
      const hasInsert = await frame.locator('button, div, span, td').filter({ hasText: /^Insert$/ }).filter({ visible: true }).count().catch(() => 0);
      const hasDeleteAll = await frame.locator('button, div, span, td').filter({ hasText: /^Delete All$/ }).filter({ visible: true }).count().catch(() => 0);
      const hasTransactionDate = await frame.getByText('TransactionDate', { exact: true }).isVisible({ timeout: 100 }).catch(() => false);
      if (hasInsert > 0 && hasDeleteAll > 0 && hasTransactionDate) return frame;
    }
    await page.waitForTimeout(500);
  }
  return null;
}

async function fillTransactionTable(page: import('@playwright/test').Page, rows: TransactionRow[]): Promise<number> {
  if (rows.length === 0) return 0;

  const transactionFrame = await waitForTransactionTable(page);
  expect(transactionFrame, 'Expected transaction table to finish loading').not.toBeNull();
  expect(await clickDeleteAllButton(page), 'Expected Delete All to clear the transaction table').toBeTruthy();
  await page.waitForTimeout(500);

  for (let index = 0; index < rows.length; index++) {
    expect(await clickInsertButton(page), `Expected Insert to add transaction row ${index + 1}`).toBeTruthy();
    await page.waitForTimeout(3000);
  }

  for (const frame of [transactionFrame!]) {
    const header = frame.getByText('TransactionDate', { exact: true }).first();
    if (!(await header.isVisible({ timeout: 1000 }).catch(() => false))) continue;
    const dataTable = header.locator('xpath=ancestor::table[1]/following::table[1]');
    const dataRows = dataTable.locator('tr').filter({ has: frame.getByRole('checkbox') });
    const rowCount = await dataRows.count().catch(() => 0);
    if (rowCount < rows.length) continue;

    for (let index = 0; index < rows.length; index++) {
      const cells = dataRows.nth(rowCount - rows.length + index).locator('td');
      await expect(cells).toHaveCount(6);
      const values = Object.values(rows[index]);
      for (let column = 0; column < values.length; column++) {
        const suggestionInput = frame.locator('.dlfSuggestionBox:visible input').first();
        if (await suggestionInput.isVisible({ timeout: 100 }).catch(() => false)) {
          await suggestionInput.press('Escape').catch(() => {});
          await suggestionInput.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
        }
        const cell = cells.nth(column + 1);
        await cell.dblclick();
        const control = frame.locator('input:focus, textarea:focus').first();
        await expect(control, `Expected an editor for transaction row ${index + 1}, column ${column + 1}`).toBeVisible();
        await control.fill(values[column]);
        await control.press('Tab').catch(() => {});
      }
    }
    return rows.length;
  }
  throw new Error('Could not find a visible transaction table with TransactionDate, Description, Quantity, and Price columns');
}

test('extracts all documents and maps OCR fields', async ({ page }, testInfo) => {
  test.setTimeout(15 * 60 * 1000);
  await page.goto('https://cfpet.ephesoft.cloud/dcma/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('img', { name: 'Logo' })).toBeVisible({ timeout: 30000 });

  await page.goto(reviewUrl, { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveURL(/ReviewValidate\.html\?batch_id=BI400460&source_id=BatchList/);
  const documents = await collectDocuments(page);
  expect(documents.length, 'Expected at least one document').toBeGreaterThan(0);

  const artifactsDir = path.join('playwright', 'artifacts');
  fs.mkdirSync(artifactsDir, { recursive: true });
  for (let index = 0; index < documents.length; index++) {
    const documentEntry = documents[index];
    await resetPageScroll(page);
    await documentEntry.locator.click();
    const middlePanelLoaded = await waitForMiddlePanel(page, documentEntry.locator, documentEntry.documentType);
    expect(
      middlePanelLoaded,
      `Expected the middle panel for ${documentEntry.label}${documentEntry.documentType ? ` ${documentEntry.documentType}` : ''} to load`,
    ).toBeTruthy();
    await resetPageScroll(page);
    const middlePanelPath = path.join(artifactsDir, artifactName(documentEntry, index, 'middle-panel.png'));
    await page.screenshot({ path: middlePanelPath });
    await testInfo.attach(`middle-panel-${documentEntry.label}`, {
      path: middlePanelPath,
      contentType: 'image/png',
    });

    const documentImage = await waitForDocumentImage(page);
    expect(documentImage, `Expected the right-panel document ${index + 1} to load`).not.toBeNull();
    const screenshot = path.join(artifactsDir, artifactName(documentEntry, index, 'right-panel-document.png'));

    const imageSrc = await documentImage!.evaluate((element) => (element as HTMLImageElement).src);
    const response = await page.request.get(imageSrc);
    fs.writeFileSync(screenshot, await response.body());
    await testInfo.attach(`right-panel-document-${documentEntry.label}`, {
      path: screenshot,
      contentType: response.headers()['content-type'] ?? 'image/png',
    });

    const result = await Tesseract.recognize(screenshot, 'eng');
    const ocrText = result.data.text.trim();
    const ocrTextPath = path.join(artifactsDir, artifactName(documentEntry, index, 'ocr.txt'));
    fs.writeFileSync(ocrTextPath, ocrText);
    await testInfo.attach(`ocr-text-${documentEntry.label}`, {
      path: ocrTextPath,
      contentType: 'text/plain',
    });
    console.log(`Document ${index + 1} OCR text:\n${ocrText}`);
    const fields = parseFields(ocrText);
    console.log(`Document ${index + 1} fields:`, fields);
    const fieldMap = await buildFieldInputMap(page);
    for (const [label, value] of Object.entries(fields)) {
      const filled = await fillField(page, fieldMap, label, value);
      console.log(`${filled ? 'Filled' : 'Skipped'} ${label}=${value}`);
    }

    const tableOpened = await clickTableButton(page);
    console.log(`${tableOpened ? 'Clicked' : 'Skipped'} Table button`);
    expect(tableOpened, 'Expected Table button').toBeTruthy();
    const transactionRows = parseTransactionRows(ocrText, fields['Invoice Date']);
    const insertedTransactionRows = await fillTransactionTable(page, transactionRows);
    console.log(`Inserted ${insertedTransactionRows} transaction row(s):`, transactionRows);
    await page.waitForTimeout(3000);
    expect(await clickValidateButton(page), 'Expected Validate button').toBeTruthy();
    await expect.poll(() => validationSucceeded(page), { message: 'Expected Validate to change from red to green', timeout: 30000 }).toBeTruthy();
    await page.waitForTimeout(3000);
    expect(await clickFieldViewButton(page), 'Expected Field View button').toBeTruthy();
    const fieldViewLoaded = await waitForMiddlePanel(page, documentEntry.locator, documentEntry.documentType);
    expect(fieldViewLoaded, 'Expected Field View fields to finish loading').toBeTruthy();
    await fillBlankFields(page, fields);

    const filledPanelPath = path.join(artifactsDir, artifactName(documentEntry, index, 'after-fill.png'));
    await resetPageScroll(page);
    await page.screenshot({ path: filledPanelPath });
    await testInfo.attach(`after-fill-${documentEntry.label}`, {
      path: filledPanelPath,
      contentType: 'image/png',
    });
  }
});
