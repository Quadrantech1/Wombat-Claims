import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';

export class DocumentLibrarySearchPage extends BasePage {
    // Primary action buttons
    searchButton = new Button(this.page, "//button[text() = 'Search']");
    clearButton = new Button(this.page, "//button[text() = 'Clear']");
    uploadDocumentButton = new Button(this.page, "//button[text()=' Upload Document ']");
    nextButton = new Button(this.page, "//button[normalize-space()='Next']");

    // Tables
    summaryTable = new Table(this.page, "//div[@class='col-8']//div[@class='card-body']");

    // Text inputs
    termDays = new TextBox(this.page, "//input[@formcontrolname='termDays']");

    // Search options selects
    marketChannelSelect = new Select(this.page, "//select[@formcontrolname='marketChannelId']");
    documentVersionSelect = new Select(this.page, "//select[@formcontrolname='documentVersionId']");
    selectStateSelect = new Select(this.page, "//select[@formcontrolname='stateProvId']");
    documentTypeSelect = new Select(this.page, "//select[@formcontrolname='documentTypeId']");
    parentProductIdSelect = new Select(this.page, "//select[@formcontrolname='parentProductId']");
    productSelect = new Select(this.page, "//select[@formcontrolname='productId']");

    // Common buttons
    previousButton = new Button(this.page, "//button[normalize-space()='Previous']");
    exitButton = new Button(this.page, "//button[normalize-space()='Exit']");
    yesIWantToExitButton = new Button(this.page, "//button[normalize-space()='Yes, I want to Exit']");

    // icon
    loadingIcon = new Label(this.page, "//div[@class='loading-spinner']");

    /**
     * Check if a value is displayed in the search results
     * @param value Text to search for in the results
     */
    async verifyValueInSearchResult(index: string, position: number = 1): Promise<void> {
        let searchResultLabel = new Label(this.page, this.page.getByText(index).nth(position));
        await expect.soft(searchResultLabel.getLocator()).toBeVisible();
    }
}
