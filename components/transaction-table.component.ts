import { expect, type Frame, type Locator, type Page } from '@playwright/test';

export type TransactionRow = {
  transactionDate: string;
  description: string;
  quantity: string;
  price: string;
};

export class TransactionTableComponent {
  constructor(private readonly page: Page) {}

  async clickTableButton(): Promise<boolean> {
    for (const frame of this.page.frames()) {
      const tableButton = frame.locator('[role="menuitem"], button, div, span, td')
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

  async close(): Promise<boolean> {
    for (const frame of this.page.frames()) {
      const dialog = frame.locator('#dialogWindow.tableViewContainer');
      if (!(await dialog.isVisible({ timeout: 100 }).catch(() => false))) continue;

      const tableButton = frame.locator('[role="menuitem"], button, div, span, td')
        .filter({ hasText: /^Table$/ })
        .filter({ visible: true })
        .first();
      if (await tableButton.isVisible({ timeout: 500 }).catch(() => false)) {
        await tableButton.click();
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

  async fill(rows: TransactionRow[]): Promise<number> {
    if (rows.length === 0) return 0;

    const transactionFrame = await this.waitForTable();
    expect(transactionFrame, 'Expected transaction table to finish loading').not.toBeNull();
    expect(await this.clickAction('Delete All'), 'Expected Delete All to clear the transaction table').toBeTruthy();
    await this.page.waitForTimeout(500);

    for (let index = 0; index < rows.length; index++) {
      expect(await this.clickAction('Insert'), `Expected Insert to add transaction row ${index + 1}`).toBeTruthy();
      await this.page.waitForTimeout(3000);
    }

    const frame = transactionFrame!;
    const header = frame.getByText('Description', { exact: true }).first();
    if (await header.isVisible({ timeout: 1000 }).catch(() => false)) {
      const dataTable = header.locator('xpath=ancestor::table[1]/following::table[1]');
      const dataRows = dataTable.locator('tr').filter({ has: frame.getByRole('checkbox') });
      const rowCount = await dataRows.count().catch(() => 0);
      if (rowCount >= rows.length) {
        for (let index = 0; index < rows.length; index++) {
          const cells = dataRows.nth(rowCount - rows.length + index).locator('td');
          const cellCount = await cells.count();
          const values = cellCount === 3
            ? [rows[index].description, rows[index].price]
            : [rows[index].transactionDate, rows[index].description, rows[index].quantity, rows[index].price];
          expect([3, 5, 6].includes(cellCount), `Expected a supported transaction-table row shape (got ${cellCount} cells)`).toBeTruthy();

          for (let column = 0; column < values.length; column++) {
            const suggestionBox = frame.locator('.x-combo-list, [role="listbox"]').filter({ visible: true }).first();
            for (let dismissAttempt = 0; dismissAttempt < 5; dismissAttempt++) {
              if (!(await suggestionBox.isVisible({ timeout: 100 }).catch(() => false))) break;
              await this.page.keyboard.press('Escape').catch(() => {});
              await header.click({ force: true }).catch(() => {});
              await suggestionBox.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
            }

            let control = frame.locator('input:focus, textarea:focus').first();
            const alreadyEditing = column > 0 && await control.isVisible({ timeout: 200 }).catch(() => false);
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
    }

    throw new Error('Could not find a visible transaction table with TransactionDate, Description, Quantity, and Price columns');
  }

  private async clickAction(name: 'Insert' | 'Delete All'): Promise<boolean> {
    for (const frame of this.page.frames()) {
      const action = frame.locator('button, div, span, td')
        .filter({ hasText: new RegExp(`^${name}$`) })
        .filter({ visible: true })
        .first();
      if (await action.isVisible({ timeout: 500 }).catch(() => false)) {
        await action.click();
        return true;
      }
    }
    return false;
  }

  private async waitForTable(): Promise<Frame | null> {
    for (let attempt = 0; attempt < 30; attempt++) {
      for (const frame of this.page.frames()) {
        const hasInsert = await frame.locator('button, div, span, td')
          .filter({ hasText: /^Insert$/ }).filter({ visible: true }).count().catch(() => 0);
        const hasDeleteAll = await frame.locator('button, div, span, td')
          .filter({ hasText: /^Delete All$/ }).filter({ visible: true }).count().catch(() => 0);
        const hasDescription = await frame.getByText('Description', { exact: true }).isVisible({ timeout: 100 }).catch(() => false);
        const hasPrice = await frame.getByText('Price', { exact: true }).isVisible({ timeout: 100 }).catch(() => false);
        if (hasInsert > 0 && hasDeleteAll > 0 && hasDescription && hasPrice) return frame;
      }
      await this.page.waitForTimeout(500);
    }
    return null;
  }
}
