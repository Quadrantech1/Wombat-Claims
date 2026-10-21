import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';

export enum RowsPerPage {
    Ten = 10,
    Twenty = 20,
    Thirty = 30,
    Forty = 40,
    Fifty = 50,
    OneHundred = 100,
    All = 0,
}

export class PageTableSection extends BasePage {
    // Dropdown control for selecting number of rows per page (Angular & legacy both use a select)
    numberOfRowsDropdown = new Select(this.page, this.page.locator('#pager').getByRole('combobox'));

    // Angular-specific dropdown (XPath locator matching select with class 'form-select')
    angularNumberOfRowsDropdown = new Select(this.page, this.page.locator('.input-group > .form-select'));

    // Angular pagination controls (usually rendered as links)
    angularFirstPage = new Link(this.page, this.page.locator('.page-link').first());
    angularPreviousPage = new Link(this.page, this.page.locator('li:nth-child(2) > .page-link'));
    angularNextPage = new Link(this.page, this.page.locator('li:nth-child(4) > .page-link'));
    angularLastPage = new Link(this.page, this.page.locator('li:nth-child(5) > .page-link'));

    // Legacy pagination controls (rendered as images with accessible names)
    legacyFirstPage = new Link(this.page, this.page.getByRole('img', { name: 'First' }));
    legacyPreviousPage = new Link(this.page, this.page.getByRole('img', { name: 'Previous' }));
    legacyNextPage = new Link(this.page, this.page.getByRole('img', { name: 'Next' }));
    legacyLastPage = new Link(this.page, this.page.getByRole('img', { name: 'Last' }));

    /**
     * Selects the number of rows per page using the visible dropdown (Angular if present, otherwise legacy)
     * @param rows one of RowsPerPage enum values
     */
    async selectRowsPerPage(rows: RowsPerPage): Promise<void> {

        const dropdown = this.angularNumberOfRowsDropdown.getLocator().or(this.numberOfRowsDropdown.getLocator());
        await expect(dropdown).toBeVisible();

        if (await this.angularNumberOfRowsDropdown.isDisplayed()) {
            await this.angularNumberOfRowsDropdown.selectOption(String(rows));
            return;
        }

        if (await this.numberOfRowsDropdown.isDisplayed()) {
            const legacyValue = rows === RowsPerPage.All ? 'all' : String(rows);
            await this.numberOfRowsDropdown.selectOption(legacyValue);
            return;
        }

        throw new Error('[PageTableSection.selectRowsPerPage] - No rows-per-page dropdown was visible');
    }
}
