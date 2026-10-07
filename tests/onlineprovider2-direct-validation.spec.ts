import { expect, test } from '../fixtures/test.fixture';
import type { Frame, Locator } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';
import { type OnlineProviderReviewPage, type ReviewDocument, type TransactionRow } from '../pages/online-provider-review.page';
import reviewData from '../test-data/online-provider.json';
import { createArtifactName } from '../utils/artifact-name';

const reviewUrl = reviewData.reviewUrl;

const batchId = new URL(reviewUrl).searchParams.get('batch_id') ?? 'batch';

type DocumentEntry = ReviewDocument;
type FieldInputMap = Map<string, Locator>;

function artifactName(documentEntry: DocumentEntry, index: number, suffix: string): string {
  return createArtifactName(batchId, documentEntry.label, documentEntry.documentType, suffix);
}

function sourceFieldLabelsFor(documentType: string | null): string[] {
  const normalizedDocumentType = normalizedFieldName(documentType ?? '');
  if (normalizedDocumentType === 'invoice' || normalizedDocumentType === 'onlineprovider') {
    return ['PetName', 'Invoice Date', 'Invoice Number', 'Invoice Tax', 'NetTotal', 'Invoice Total'];
  }
  if (normalizedDocumentType === 'claimform') {
    return ['Claim Amount'];
  }
  return ['PetName', 'Invoice Date', 'Invoice Number', 'Invoice Tax', 'NetTotal', 'Invoice Total', 'Claim Amount'];
}

async function hasFieldControlNearby(locator: Locator): Promise<boolean> {
  for (const selector of ['input, textarea, select', 'input[type="text"], textarea, select']) {
    if ((await locator.locator(selector).count().catch(() => 0)) > 0) return true;
  }

  const row = locator.locator('xpath=ancestor::tr[1]');
  if ((await row.locator('input, textarea, select').count().catch(() => 0)) > 0) return true;

  const parent = locator.locator('xpath=..');
  if ((await parent.locator('input, textarea, select').count().catch(() => 0)) > 0) return true;

  const fieldContainer = locator.locator('xpath=ancestor::*[contains(@class, "field") or contains(@class, "Field") or contains(@id, "field") or contains(@id, "Field")][1]');
  if ((await fieldContainer.locator('input, textarea, select').count().catch(() => 0)) > 0) return true;

  return false;
}

async function hasVisibleFormField(frame: Frame, expectedLabels: string[]): Promise<boolean> {
  const controls = frame.locator('input, textarea, select').filter({ visible: true });
  const count = await controls.count().catch(() => 0);
  for (let index = 0; index < count; index++) {
    const control = controls.nth(index);
    const attributes = await control.evaluate((element) => {
      const values = [
        element.getAttribute('id'),
        element.getAttribute('name'),
        element.getAttribute('aria-label'),
        element.getAttribute('title'),
      ].filter(Boolean) as string[];
      return values.join(' ');
    }).catch(() => '');

    const normalized = attributes.replace(/[^a-z0-9]/gi, '').toLowerCase();
    for (const expectedLabel of expectedLabels) {
      const normalizedExpected = expectedLabel.replace(/[^a-z0-9]/gi, '').toLowerCase();
      if (!normalizedExpected || normalized.includes(normalizedExpected)) return true;
    }
  }
  return false;
}

async function hasLabeledField(page: import('@playwright/test').Page, documentType: string | null = null): Promise<boolean> {
  const sourceFieldLabels = sourceFieldLabelsFor(documentType);
  const ignoredLabels = new Set(['id', 'name', 'document type', 'fuzzy search']);
  const toolbarPattern = /validate|next batch|merge|split|table|more/i;
  for (const frame of page.frames()) {
    if (await hasVisibleFormField(frame, sourceFieldLabels)) return true;

    for (const fieldLabel of sourceFieldLabels) {
      const visibleFieldLabel = frame.getByText(fieldLabel, { exact: true }).first();
      if (await visibleFieldLabel.isVisible({ timeout: 250 }).catch(() => false)) {
        const hasControl = await hasFieldControlNearby(visibleFieldLabel);
        if (hasControl) return true;
      }
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
    if (normalizedFieldName(actualDocumentType ?? '') !== normalizedFieldName(expectedDocumentType)) return false;
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
    let stableChecks = 0;
    for (let check = 0; check < 3; check++) {
      if (await isMiddlePanelLoaded(page, expectedDocumentType)) {
        stableChecks += 1;
      } else {
        stableChecks = 0;
      }
      if (stableChecks >= 2) return true;
      await page.waitForTimeout(500);
    }
    // middle panel didn't stay loaded yet, re-click the document in the left panel
    await documentLocator.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  for (let check = 0; check < 3; check++) {
    if (await isMiddlePanelLoaded(page, expectedDocumentType)) {
      if (check === 2) return true;
    } else {
      break;
    }
    await page.waitForTimeout(500);
  }
  return false;
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

const monthNumbers: Record<string, string> = {
  january: '01', jan: '01',
  february: '02', feb: '02',
  march: '03', mar: '03',
  april: '04', apr: '04',
  may: '05',
  june: '06', jun: '06',
  july: '07', jul: '07',
  august: '08', aug: '08',
  september: '09', sep: '09', sept: '09',
  october: '10', oct: '10',
  november: '11', nov: '11',
  december: '12', dec: '12',
};

function formatInvoiceDate(raw: string): string {
  const dayMonthYear = raw.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})$/);
  if (dayMonthYear) {
    const [, day, monthName, year] = dayMonthYear;
    const month = monthNumbers[monthName.toLowerCase()];
    return month ? `${month}/${day.padStart(2, '0')}/${year}` : raw.trim();
  }

  // online-provider order confirmations use "Mon D, YYYY" (e.g. "Sep 8, 2026")
  const monthDayYear = raw.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (monthDayYear) {
    const [, monthName, day, year] = monthDayYear;
    const month = monthNumbers[monthName.toLowerCase()];
    return month ? `${month}/${day.padStart(2, '0')}/${year}` : raw.trim();
  }

  return raw.trim();
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
    // online-provider order confirmations show "Order Placed: Sep 8, 2026" instead of "Invoice Date"
    [/Order\s+Placed[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i, 'Invoice Date'],
    [/Client[:\s]*([A-Z][A-Za-z\s]{2,}?)\s*\(/i, 'Client Name'],
    [/Age[:\s]+(\d+\s*(?:years?|months?)|[A-Za-z]+)/i, 'Age'],
    // online-provider order confirmations list the pet as "Pet    Jane, Dog" in the item table
    [/\bPet\s+([A-Za-z][A-Za-z'-]*),\s*(?:Dog|Cat|Bird|Reptile|Horse)\b/i, 'PetName'],
  ];
  for (const [pattern, label] of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) fields[label] = match[1].trim();
  }
  if (fields['Invoice Date']) fields['Invoice Date'] = formatInvoiceDate(fields['Invoice Date']);

  addLineLayoutFields(lines, fields);

  const paymentHeading = text.search(/\bPayment\s+Information\b/i);
  const financialText = paymentHeading === -1 ? text : text.slice(paymentHeading);
  const orderTotalMatch = financialText.match(/\bOrder\s+Total\s*[:\-]?\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i);
  const orderTotal = orderTotalMatch?.[1] ? money(orderTotalMatch[1]) : null;
  const subtotalMatch = financialText.match(/\b(?:item\s*\(?s\)?\s*)?sub[\s-]*total\s*[:\-]?\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i);
  const subtotal = subtotalMatch?.[1] ? money(subtotalMatch[1]) : null;
  if (subtotal !== null) {
    const taxes = financialText.split(/\r?\n/)
      .filter((line) => /\b(?:sales\s+tax|tax|taxes)\b/i.test(line) && !/(?:before|including)\s+tax/i.test(line))
      .map((line) => [...line.matchAll(/\$?\s*([\d,]+(?:\.\d{1,2})?)/g)])
      .map((matches) => matches.length ? money(matches[matches.length - 1][1]) : null)
      .filter((value): value is number => value !== null)
      .reduce((total, value) => total + value, 0);
    const beforeTaxMatch = financialText.match(/\btotal\s+before\s+tax\s*[:\-]?\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i);
    const beforeTax = beforeTaxMatch?.[1] ? money(beforeTaxMatch[1]) : null;
    const calculatedTax = orderTotal !== null && beforeTax !== null ? orderTotal - beforeTax : taxes;
    fields['Invoice tax'] = calculatedTax.toFixed(2);
    fields['Net total'] = subtotal.toFixed(2);
    fields['Invoice Total'] = (subtotal - taxes).toFixed(2);
    if (beforeTax !== null) fields['Net total'] = beforeTax.toFixed(2);
  }

  // online-provider order confirmations show the final charge as "Order Total" (subtotal - tax doesn't apply)
  if (orderTotal !== null) fields['Invoice Total'] = orderTotal.toFixed(2);

  return fields;
}

function normalizedFieldName(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function isOnlineProviderDocument(documentType: string | null): boolean {
  return normalizedFieldName(documentType ?? '') === 'onlineprovider';
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
  const indexFieldLabels = ['Invoice Date', 'Invoice Number', 'Invoice tax', 'Net total', 'Invoice Total', 'PetName'];
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
    InvoiceDate: 'Invoice Date',
    InvoiceNumber: 'Invoice Number',
    InvoiceTax: 'Invoice tax',
    NetTotal: 'Net total',
    InvoiceTotal: 'Invoice Total',
    ClaimAmount: 'Claim Amount',
  };

  for (const frame of page.frames()) {
    for (const [id, label] of Object.entries(fieldsById)) {
      const input = frame.locator(`#${id} input, #${id} textarea, #${id} select, input#${id}, textarea#${id}, select#${id}, input[id*="${id}"], textarea[id*="${id}"], select[id*="${id}"]`).filter({ visible: true }).first();
      if (await input.isVisible({ timeout: 50 }).catch(() => false)) {
        fieldMap.set(normalizedFieldName(label), input);
      }
    }

  }

  return fieldMap;
}

async function findFieldInput(page: import('@playwright/test').Page, label: string): Promise<Locator | null> {
  const normalizedLabels = new Set(labelAliases(label).map(normalizedFieldName));
  for (const frame of page.frames()) {
    if (normalizedFieldName(label) === 'petname') {
      const orderedPetNameInput = await findOrderedIndexPanelInput(frame, label);
      if (orderedPetNameInput) return orderedPetNameInput;
    }

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

      const followingTableControl = await firstVisibleControl(
        labelElement.locator('xpath=ancestor::table[1]/following::input[not(@type="hidden")][1] | ancestor::table[1]/following::textarea[1] | ancestor::table[1]/following::select[1]'),
      );
      if (followingTableControl) return followingTableControl;

      const parentControl = await firstVisibleControl(labelElement.locator('xpath=..').locator('input, textarea, select'));
      if (parentControl) return parentControl;

      const fieldTableControl = await firstVisibleControl(
        labelElement.locator('xpath=ancestor::table[1]').locator('input, textarea, select'),
      );
      if (fieldTableControl) return fieldTableControl;

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

async function fillField(
  reviewPage: OnlineProviderReviewPage,
  page: import('@playwright/test').Page,
  fieldMap: FieldInputMap,
  label: string,
  value: string,
): Promise<boolean> {
  const input = findMappedFieldInput(fieldMap, label) ?? await findFieldInput(page, label);
  if (!input || !(await input.isVisible({ timeout: 100 }).catch(() => false))) return false;
  await reviewPage.fillField(input, label, value);
  const currentValue = await input.inputValue().catch(() => '');
  return valuesMatch(label, currentValue, value);
}

async function fillBlankFields(
  reviewPage: OnlineProviderReviewPage,
  page: import('@playwright/test').Page,
  fields: Record<string, string>,
): Promise<void> {
  const fieldMap = await buildFieldInputMap(page);
  for (const [label, value] of Object.entries(fields)) {
    const input = findMappedFieldInput(fieldMap, label) ?? await findFieldInput(page, label);
    if (!input || !(await input.isVisible({ timeout: 100 }).catch(() => false))) continue;
    const currentValue = await input.inputValue().catch(() => '');
    if (currentValue.trim()) continue;

    const filled = await fillField(reviewPage, page, fieldMap, label, value);
    console.log(`${filled ? 'Filled blank' : 'Skipped blank'} ${label}=${value}`);
  }
}

function paymentSummaryRows(ocrText: string, transactionDate: string): TransactionRow[] {
  const paymentHeading = ocrText.search(/\bPayment\s+Information\b/i);
  if (paymentHeading === -1) return [];

  const paymentText = ocrText.slice(paymentHeading);
  const amountFor = (pattern: RegExp): number | null => {
    const match = paymentText.match(pattern);
    return match?.[1] ? money(match[1]) : null;
  };
  const subtotal = amountFor(/\bItem\(?s\)?\s+Subtotal\s*:\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i);
  const beforeTax = amountFor(/\bTotal\s+Before\s+Tax\s*:\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i);
  const orderTotal = amountFor(/\bOrder\s+Total\s*:\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (subtotal === null || beforeTax === null || orderTotal === null) return [];

  const rows: TransactionRow[] = [];
  const discountTargetCents = Math.max(0, Math.round((subtotal - beforeTax) * 100));
  let discountTotalCents = 0;
  for (const line of paymentText.split(/\r?\n/)) {
    const match = line.match(/^\s*(.+?)(?:\s*:\s*|\s+)-\$?\s*([\d,]+(?:\.\d{1,2})?)\s*$/);
    if (!match) continue;

    const amount = money(match[2]);
    const amountCents = amount === null ? null : Math.round(amount * 100);
    if (amount === null || amountCents === null || discountTotalCents + amountCents > discountTargetCents) continue;
    const description = match[1].trim().replace(/^Autoship\s*&\s*S\s*(-\s*\d+%\s*off)$/i, 'Autoship & Save $1');
    rows.push({ transactionDate, description, quantity: '1', price: (-amount).toFixed(2) });
    discountTotalCents += amountCents;
    if (discountTotalCents === discountTargetCents) break;
  }

  const taxTargetCents = Math.max(0, Math.round((orderTotal - beforeTax) * 100));
  let taxTotalCents = 0;
  const seenTaxes = new Set<string>();
  for (const match of paymentText.matchAll(/\b(Sales\s+Tax|VAT|GST|HST|PST|Tax)\s*:\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/gi)) {
    const label = match[1].replace(/\s+/g, ' ').trim();
    const amount = money(match[2]);
    const key = `${normalizedFieldName(label)}:${amount}`;
    const amountCents = amount === null ? null : Math.round(amount * 100);
    if (amount === null || amountCents === null || seenTaxes.has(key) || taxTotalCents + amountCents > taxTargetCents) continue;
    seenTaxes.add(key);
    rows.push({ transactionDate, description: label, quantity: '1', price: amount.toFixed(2) });
    taxTotalCents += amountCents;
    if (taxTotalCents === taxTargetCents) break;
  }

  return rows;
}

function parseTransactionRows(ocrText: string, invoiceDate: string | undefined): TransactionRow[] {
  const transactionDate = invoiceDate ? formatInvoiceDate(invoiceDate) : '';
  const lines = ocrText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  const rows: TransactionRow[] = [];
  for (const line of lines) {
    if (/^(?:sub\s*total|including\s+tax|total|payment|amount\s+paid|balance)\b/i.test(line)) continue;
    if (/^Qty\s+Item\b/i.test(line)) continue;

    const row = line.match(/^(?:\d{1,2}\/\d{1,2}\/\d{4}\s*\|?\s*)?(.*?)\s+(\d+(?:\.\d+)?)\s+\$?(-?[\d,]+(?:\.\d{1,2})?)\s+\$?-?[\d,]+(?:\.\d{1,2})?\s+\$?(-?[\d,]+(?:\.\d{1,2})?)$/);
    if (row) {
      const price = money(row[4]);
      if (price !== null) {
        const description = row[1].replace(/^[-|]\s*/, '').trim();
        if (description) rows.push({ transactionDate, description, quantity: row[2], price: price.toFixed(2) });
      }
      continue;
    }

    // order confirmations use a simpler "Qty Item ... Unit Price [Total]" layout (1-2 digit qty to avoid matching street numbers)
    const qtyMatch = line.match(/^(\d{1,2})\s+(.+)$/);
    if (qtyMatch && !/\b(?:tax|subtotal|shipping|total|adjustment|balance)\b/i.test(qtyMatch[2])) {
      const rest = qtyMatch[2];
      const dollarIndex = rest.indexOf('$');
      const amounts = [...rest.matchAll(/\$(-?[\d,]+(?:\.\d{1,2})?)/g)];
      if (dollarIndex > 0 && amounts.length > 0) {
        // when both Unit Price and Total columns are present, the last amount is the line total
        const price = money(amounts[amounts.length - 1][1]);
        const description = rest.slice(0, dollarIndex).trim();
        if (price !== null && description) {
          rows.push({ transactionDate, description, quantity: qtyMatch[1], price: price.toFixed(2) });
        }
      }
      continue;
    }

  }
  return [...rows, ...paymentSummaryRows(ocrText, transactionDate)];
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

async function openMoreMenu(page: import('@playwright/test').Page): Promise<boolean> {
  for (const frame of page.frames()) {
    const moreMenu = frame.locator('[role="menuitem"], button, div, span, td').filter({ hasText: /^More\s*$/ }).filter({ visible: true }).first();
    if (await moreMenu.isVisible({ timeout: 200 }).catch(() => false)) {
      await moreMenu.evaluate((element) => (element as HTMLElement).click());
      await page.waitForTimeout(500);
      return true;
    }
  }
  return false;
}

async function clickFieldViewButton(page: import('@playwright/test').Page): Promise<boolean> {
  for (let attempt = 0; attempt < 10; attempt++) {
    for (const frame of page.frames()) {
      const documentPageViewButton = frame.getByRole('button', { name: 'Document Page View', exact: true });
      if (await documentPageViewButton.isVisible({ timeout: 200 }).catch(() => false)) return true;

      const fieldViewButton = frame.locator('[role="menuitem"], button, div, span, td').filter({ hasText: /^Field View$/ }).filter({ visible: true }).first();
      if (await fieldViewButton.isVisible({ timeout: 200 }).catch(() => false)) {
        await fieldViewButton.evaluate((element) => (element as HTMLElement).click());
        return true;
      }
    }
    // after validating, the toolbar can collapse the view toggle into the "More" menu
    if (!(await openMoreMenu(page))) await page.waitForTimeout(500);
  }
  return false;
}

async function closeTransactionTable(page: import('@playwright/test').Page): Promise<boolean> {
  for (const frame of page.frames()) {
    const dialog = frame.locator('#dialogWindow.tableViewContainer');
    if (!(await dialog.isVisible({ timeout: 100 }).catch(() => false))) continue;

    const tableButton = frame.locator('[role="menuitem"], button, div, span, td').filter({ hasText: /^Table$/ }).filter({ visible: true }).first();
    if (await tableButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await tableButton.evaluate((element) => (element as HTMLElement).click());
    }
    await dialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    if (await dialog.isVisible({ timeout: 100 }).catch(() => false)) {
      await dialog.press('Escape').catch(() => {});
      await dialog.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
    }
    return !(await dialog.isVisible({ timeout: 100 }).catch(() => false));
  }
  return true;
}

async function waitForTransactionTable(page: import('@playwright/test').Page): Promise<Frame | null> {
  for (let attempt = 0; attempt < 30; attempt++) {
    for (const frame of page.frames()) {
      const hasInsert = await frame.locator('button, div, span, td').filter({ hasText: /^Insert$/ }).filter({ visible: true }).count().catch(() => 0);
      const hasDeleteAll = await frame.locator('button, div, span, td').filter({ hasText: /^Delete All$/ }).filter({ visible: true }).count().catch(() => 0);
      const hasDescription = await frame.getByText('Description', { exact: true }).isVisible({ timeout: 100 }).catch(() => false);
      const hasPrice = await frame.getByText('Price', { exact: true }).isVisible({ timeout: 100 }).catch(() => false);
      if (hasInsert > 0 && hasDeleteAll > 0 && hasDescription && hasPrice) return frame;
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

  // a 6-cell row is 4 real data columns plus a zero-width ExtJS filler cell ('x-grid-cell-last'); only the checkbox
  // plus 4 data columns are ever editable, so the filler must never be targeted for a dblclick
  for (const frame of [transactionFrame!]) {
    const header = frame.getByText('Description', { exact: true }).first();
    if (!(await header.isVisible({ timeout: 1000 }).catch(() => false))) continue;
    const dataTable = header.locator('xpath=ancestor::table[1]/following::table[1]');
    const dataRows = dataTable.locator('tr').filter({ has: frame.getByRole('checkbox') });
    const rowCount = await dataRows.count().catch(() => 0);
    if (rowCount < rows.length) continue;

    for (let index = 0; index < rows.length; index++) {
      const cells = dataRows.nth(rowCount - rows.length + index).locator('td');
      const cellCount = await cells.count();
      const values = cellCount === 3
        ? [rows[index].description, rows[index].price]
        : [rows[index].transactionDate, rows[index].description, rows[index].quantity, rows[index].price];
      expect([3, 5, 6].includes(cellCount), `Expected a supported transaction-table row shape (got ${cellCount} cells)`).toBeTruthy();
      for (let column = 0; column < values.length; column++) {
        // the autocomplete suggestion box can linger and intercept clicks on the next cell; keep dismissing it
        for (let dismissAttempt = 0; dismissAttempt < 5; dismissAttempt++) {
          const suggestionBox = frame.locator('.dlfSuggestionBox:visible').first();
          if (!(await suggestionBox.isVisible({ timeout: 100 }).catch(() => false))) break;
          await page.keyboard.press('Escape').catch(() => {});
          await header.click({ force: true }).catch(() => {});
          await suggestionBox.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
        }
        // Tab (pressed at the end of the previous column) already drives the grid's own scroll-into-view for the next
        // cell; a manual dblclick on a column past the rendered width fails since the grid clips it with overflow:hidden
        let control = frame.locator('input:focus, textarea:focus').first();
        const alreadyEditing = column > 0 && (await control.isVisible({ timeout: 200 }).catch(() => false));
        if (!alreadyEditing) {
          const cell = cells.nth(column + 1);
          await cell.evaluate((element) => {
            element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            let node: HTMLElement | null = element.parentElement;
            while (node) {
              if (node.scrollWidth > node.clientWidth + 1) node.scrollLeft = node.scrollWidth;
              node = node.parentElement;
            }
          }).catch(() => {});
          await cell.dblclick({ force: true });
          control = frame.locator('input:focus, textarea:focus').first();
        }
        await expect(control, `Expected an editor for transaction row ${index + 1}, column ${column + 1}`).toBeVisible();
        await control.fill(values[column]);
        await control.press('Tab').catch(() => {});
      }
    }
    return rows.length;
  }
  throw new Error('Could not find a visible transaction table with TransactionDate, Description, Quantity, and Price columns');
}

test('extracts all documents and maps OCR fields', async ({ page, reviewPage }, testInfo) => {
  test.setTimeout(15 * 60 * 1000);
  await reviewPage.open(reviewUrl);

  await expect(page).toHaveURL(new RegExp(`ReviewValidate\\.html\\?batch_id=${batchId}&source_id=BatchList`));
  const documents = await reviewPage.collectDocuments();
  expect(documents.length, 'Expected at least one document').toBeGreaterThan(0);

  const artifactsDir = path.join('playwright', 'artifacts');
  fs.mkdirSync(artifactsDir, { recursive: true });
  // reusing one worker across documents avoids re-initializing the OCR engine for every page
  const ocrWorker = await createWorker('eng');
  let claimFormPetName: string | undefined;
  try {
  for (let index = 0; index < documents.length; index++) {
    const documentEntry = documents[index];
    await reviewPage.selectDocument(documentEntry);
    const middlePanelLoaded = await waitForMiddlePanel(page, documentEntry.locator, documentEntry.documentType);
    expect(
      middlePanelLoaded,
      `Expected the middle panel for ${documentEntry.label}${documentEntry.documentType ? ` ${documentEntry.documentType}` : ''} to load`,
    ).toBeTruthy();
    await reviewPage.resetScroll();
    const middlePanelPath = path.join(artifactsDir, artifactName(documentEntry, index, 'middle-panel.png'));
    await page.screenshot({ path: middlePanelPath });
    await testInfo.attach(`middle-panel-${documentEntry.label}`, {
      path: middlePanelPath,
      contentType: 'image/png',
    });

    const documentImage = await reviewPage.waitForDocumentImage(documentEntry.locator);
    expect(documentImage, `Expected the right-panel document ${index + 1} to load`).not.toBeNull();
    const screenshot = path.join(artifactsDir, artifactName(documentEntry, index, 'right-panel-document.png'));

    // download the full-resolution source image (same as the middle panel) instead of screenshotting the rendered element
    const imageInfo = await documentImage!.evaluate((element) => {
      const image = element as HTMLImageElement;
      return {
        src: image.src,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        renderedWidth: image.clientWidth,
        renderedHeight: image.clientHeight,
      };
    });
    console.log(
      `${documentEntry.label} source image ${imageInfo.naturalWidth}x${imageInfo.naturalHeight}, rendered ${imageInfo.renderedWidth}x${imageInfo.renderedHeight}`,
    );
    const response = await page.request.get(imageInfo.src, { timeout: 60000 }).catch(() => null);
    if (response?.ok()) {
      fs.writeFileSync(screenshot, await response.body());
    } else {
      await documentImage!.screenshot({ path: screenshot });
    }
    await testInfo.attach(`right-panel-document-${documentEntry.label}`, {
      path: screenshot,
      contentType: 'image/png',
    });

    const result = await ocrWorker.recognize(screenshot);
    const ocrText = result.data.text.trim();
    const ocrTextPath = path.join(artifactsDir, artifactName(documentEntry, index, 'ocr.txt'));
    fs.writeFileSync(ocrTextPath, ocrText);
    await testInfo.attach(`ocr-text-${documentEntry.label}`, {
      path: ocrTextPath,
      contentType: 'text/plain',
    });
    console.log(`Document ${index + 1} OCR text:\n${ocrText}`);
    const fields = parseFields(ocrText);
    if (normalizedFieldName(documentEntry.documentType ?? '') === 'claimform' && fields.PetName) {
      claimFormPetName = fields.PetName;
    } else if (isOnlineProviderDocument(documentEntry.documentType) && claimFormPetName) {
      fields.PetName = claimFormPetName;
      console.log(`Mapped claim-form PetName to ${documentEntry.label}: ${claimFormPetName}`);
    }
    console.log(`Document ${index + 1} fields:`, fields);
    const fieldMap = await buildFieldInputMap(page);
    if (process.env.DEBUG_FIELDS === '1') {
      for (const frame of page.frames()) {
        const debugInfo = await frame.evaluate(() => {
          const controls = Array.from(document.querySelectorAll('input, textarea, select')) as HTMLElement[];
          return controls.filter((el) => (el as HTMLInputElement).offsetParent !== null).map((el) => {
            let labelText = '';
            let node: Element | null = el;
            for (let hops = 0; hops < 6 && node; hops++) {
              node = node.previousElementSibling ?? node.parentElement;
              if (node?.textContent?.trim()) { labelText = node.textContent.trim().slice(0, 40); break; }
            }
            return { tag: el.tagName, id: el.id, name: (el as HTMLInputElement).name, className: el.className, nearbyText: labelText };
          });
        }).catch(() => []);
        if (debugInfo.length) console.log(`Frame controls:`, JSON.stringify(debugInfo, null, 2));
      }
    }
    for (const [label, value] of Object.entries(fields)) {
      const filled = await fillField(reviewPage, page, fieldMap, label, value);
      console.log(`${filled ? 'Filled' : 'Skipped'} ${label}=${value}`);
      if (isOnlineProviderDocument(documentEntry.documentType) && label === 'PetName') {
        expect(filled, `Expected claim-form PetName ${value} to populate the Online Provider PetName field`).toBeTruthy();
      }
    }

    const transactionRows = parseTransactionRows(ocrText, fields['Invoice Date']);
    if (transactionRows.length > 0) {
      const tableOpened = await reviewPage.clickTableButton();
      console.log(`${tableOpened ? 'Clicked' : 'Skipped'} Table button`);
      expect(tableOpened, 'Expected Table button').toBeTruthy();
      const insertedTransactionRows = await reviewPage.fillTransactionTable(transactionRows);
      console.log(`Inserted ${insertedTransactionRows} transaction row(s):`, transactionRows);
      expect(await reviewPage.closeTransactionTable(), 'Expected transaction table to close').toBeTruthy();
    } else {
      console.log('Skipped Table button because OCR produced no transaction rows');
    }
    await page.waitForTimeout(1000);
    expect(await reviewPage.validate(), 'Expected Validate button').toBeTruthy();
    await expect.poll(() => reviewPage.validationSucceeded(), { message: 'Expected Validate to change from red to green', timeout: 30000 }).toBeTruthy();
    await page.waitForTimeout(1000);
    expect(await reviewPage.showFieldView(), 'Expected Field View button').toBeTruthy();
    const fieldViewLoaded = await waitForMiddlePanel(page, documentEntry.locator, documentEntry.documentType);
    expect(fieldViewLoaded, 'Expected Field View fields to finish loading').toBeTruthy();
    await fillBlankFields(reviewPage, page, fields);

    const filledPanelPath = path.join(artifactsDir, artifactName(documentEntry, index, 'after-fill.png'));
    await reviewPage.resetScroll();
    await page.screenshot({ path: filledPanelPath });
    await testInfo.attach(`after-fill-${documentEntry.label}`, {
      path: filledPanelPath,
      contentType: 'image/png',
    });
  }
  } finally {
    await ocrWorker.terminate();
  }
});
