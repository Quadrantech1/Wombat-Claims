import { type Locator, type Page } from '@playwright/test';
import { TransactionTableComponent, type TransactionRow } from '../components/transaction-table.component';

export type ReviewDocument = {
  label: string;
  documentType: string | null;
  locator: Locator;
};

export type { TransactionRow };

export class OnlineProviderReviewPage {
  private readonly transactionTable: TransactionTableComponent;

  constructor(private readonly page: Page) {
    this.transactionTable = new TransactionTableComponent(page);
  }

  async open(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async collectDocuments(): Promise<ReviewDocument[]> {
    const selectors = [
      '#rv-documentList > *',
      '#rv-document-list > *',
      '.rv-document-list > *',
      '.rv-documentList > *',
      '[id*="documentList"] > *',
      '[class*="document"][class*="item"]',
      '[class*="document"][class*="thumbnail"]',
    ];
    const documents: ReviewDocument[] = [];
    const seenLabels = new Set<string>();

    for (const frame of this.page.frames()) {
      for (const selector of selectors) {
        const candidates = frame.locator(selector);
        const count = Math.min(await candidates.count().catch(() => 0), 500);
        for (let index = 0; index < count; index++) {
          const locator = candidates.nth(index);
          if (!(await locator.isVisible().catch(() => false))) continue;

          const metadata = await locator.evaluate((element) => ({
            text: element.textContent?.replace(/\s+/g, ' ').trim() ?? '',
            label: element.getAttribute('aria-label') ?? element.getAttribute('title') ?? '',
            id: element.id,
          })).catch(() => ({ text: '', label: '', id: '' }));
          const label = metadata.label || metadata.text || metadata.id;
          if (!label || label.length > 160 || /^(?:more|table|validate|next batch)$/i.test(label)) continue;

          const normalizedLabel = label.toLowerCase();
          if (seenLabels.has(normalizedLabel)) continue;
          seenLabels.add(normalizedLabel);
          documents.push({
            label,
            documentType: this.documentTypeFrom(`${label} ${metadata.text}`),
            locator,
          });
        }
      }
    }

    return documents;
  }

  async selectDocument(documentEntry: ReviewDocument): Promise<void> {
    await documentEntry.locator.click();
  }

  async waitForDocumentImage(documentLocator: Locator): Promise<Locator | null> {
    const preferredSelectors = [
      '#rv-documentImage',
      '#rv-rightPanel img',
      '[id*="documentImage"]',
      '[class*="document-viewer"] img',
      '[class*="documentViewer"] img',
    ];

    for (let attempt = 0; attempt < 60; attempt++) {
      const nestedImage = documentLocator.locator('img').first();
      if (await this.hasLoadedImage(nestedImage)) return nestedImage;

      for (const frame of this.page.frames()) {
        for (const selector of preferredSelectors) {
          const image = frame.locator(selector).first();
          if (await this.hasLoadedImage(image)) return image;
        }
        const images = frame.locator('img');
        const count = Math.min(await images.count().catch(() => 0), 100);
        for (let index = 0; index < count; index++) {
          const image = images.nth(index);
          if (await this.hasLoadedImage(image)) {
            const size = await image.evaluate((element) => ({
              width: (element as HTMLImageElement).naturalWidth,
              height: (element as HTMLImageElement).naturalHeight,
            })).catch(() => ({ width: 0, height: 0 }));
            if (size.width >= 100 && size.height >= 100) return image;
          }
        }
      }
      await this.page.waitForTimeout(500);
    }
    return null;
  }

  async resetScroll(): Promise<void> {
    for (const frame of this.page.frames()) {
      await frame.evaluate(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        for (const element of Array.from(document.querySelectorAll<HTMLElement>('*'))) {
          if (element.scrollTop > 0) element.scrollTop = 0;
        }
      }).catch(() => {});
    }
  }

  async fillField(input: Locator, label: string, value: string): Promise<void> {
    const tagName = await input.evaluate((element) => element.tagName.toLowerCase());
    if (tagName === 'select') {
      await input.selectOption({ label: value });
    } else {
      await input.fill(value);
    }
    await input.press('Tab').catch(() => {});
  }

  async clickTableButton(): Promise<boolean> {
    return this.transactionTable.clickTableButton();
  }

  async fillTransactionTable(rows: TransactionRow[]): Promise<number> {
    return this.transactionTable.fill(rows);
  }

  async closeTransactionTable(): Promise<boolean> {
    return this.transactionTable.close();
  }

  async validate(): Promise<boolean> {
    for (const frame of this.page.frames()) {
      const button = frame.locator('#rv-Review-Validate-Batch').first();
      if (!(await button.isVisible({ timeout: 500 }).catch(() => false))) continue;
      await button.evaluate((element) => (element as HTMLElement).click());
      return true;
    }
    return false;
  }

  async validationSucceeded(): Promise<boolean> {
    for (const frame of this.page.frames()) {
      const button = frame.locator('#rv-Review-Validate-Batch').first();
      if (!(await button.isVisible({ timeout: 100 }).catch(() => false))) continue;
      const className = await button.getAttribute('class').catch(() => '');
      return !/RVButtonDirtyCss/.test(className ?? '');
    }
    return false;
  }

  async showFieldView(): Promise<boolean> {
    for (let attempt = 0; attempt < 10; attempt++) {
      for (const frame of this.page.frames()) {
        const pageViewButton = frame.getByRole('button', { name: 'Document Page View', exact: true });
        if (await pageViewButton.isVisible({ timeout: 200 }).catch(() => false)) return true;

        const fieldViewButton = frame.locator('[role="menuitem"], button, div, span, td')
          .filter({ hasText: /^Field View$/ })
          .filter({ visible: true })
          .first();
        if (await fieldViewButton.isVisible({ timeout: 200 }).catch(() => false)) {
          await fieldViewButton.click();
          return true;
        }
      }

      let openedMoreMenu = false;
      for (const frame of this.page.frames()) {
        const moreButton = frame.locator('[role="menuitem"], button, div, span, td')
          .filter({ hasText: /^More\s*$/ })
          .filter({ visible: true })
          .first();
        if (await moreButton.isVisible({ timeout: 200 }).catch(() => false)) {
          await moreButton.click();
          openedMoreMenu = true;
          break;
        }
      }
      if (!openedMoreMenu) await this.page.waitForTimeout(500);
    }
    return false;
  }

  private async hasLoadedImage(image: Locator): Promise<boolean> {
    if (!(await image.isVisible({ timeout: 100 }).catch(() => false))) return false;
    return image.evaluate((element) => {
      const candidate = element as HTMLImageElement;
      return candidate.complete && candidate.naturalWidth > 0 && candidate.naturalHeight > 0;
    }).catch(() => false);
  }

  private documentTypeFrom(value: string): string | null {
    const match = value.match(/claim\s*form|online\s*provider|invoice/i);
    if (!match) return null;
    return match[0].replace(/\s+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
}
