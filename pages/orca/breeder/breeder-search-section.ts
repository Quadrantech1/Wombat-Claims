import { Button } from '@controls/button';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class BreederSearchSection extends BasePage {
    // Text Inputs
    lastNameTextBox = new TextBox(this.page, "//input[@id='BreederSearchCriteria_LastName']");
    emailAddressTextBox = new TextBox(this.page, "//input[@id='BreederSearchCriteria_EmailAddress']");

    // Buttons
    addBreederButton = new Button(this.page, "//a[contains(text(),'Add Breeder')]");
    runSearchButton = new Button(this.page, this.page.getByRole('button', { name: 'Run Search' }));

    // Tables
    searchResultsTable = new Table(this.page, "#mclead-search-results");
}
