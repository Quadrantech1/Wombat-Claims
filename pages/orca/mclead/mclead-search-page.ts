import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class McLeadSearchPage extends BasePage {
    marketChannelSelect = new Select(this.page, "xpath=//select[@id='selected-market-channel']");
    petDetailsTab = new Label(this.page, "id=pet-search-link");
    customerDetailsTab = new Label(this.page, "id=customer-search-link");
    registrationNoTextBox = new TextBox(this.page, "id=SearchCriteria_RegistrationNo");
    runSearchButton = new Button(this.page, "xpath=//button[contains(.,'Run Search')]");
    petDetailsLink = new Link(this.page, "xpath=//table[@id='mclead-search-results']/tbody/tr/td/a[@class='selector']");
    lastNameTextBox = new TextBox(this.page, "id=SearchCriteria_CustomerName");
    emailAddressTextBox = new TextBox(this.page, "id=SearchCriteria_EmailAddress");
    phoneNumberTextbox = new TextBox(this.page, "id=SearchCriteria_PhoneNumber");
    locationTextBox = new TextBox(this.page, "id=SearchCriteria_Location");
    searchResultTable = new Table(this.page, "xpath=//table[@id='mclead-search-results']");
    noteTextBox = new TextBox(this.page, "id=note");
    searchTable = new Label(this.page, "xpath=//div[@class='control-group']//blockquote");

    // McLead detail action buttons
    ownersButton = new Button(this.page, "id=owners-link");
    notesButton = new Button(this.page, "id=notes-link");
    addNoteButton = new Button(this.page, "xpath=//a[@title='Add Note']");
    cancelButton = new Button(this.page, "xpath=//button[normalize-space()='Cancel']");
    saveButton = new Button(this.page, "xpath=//button[@class='btn btn-success']");

    /**
     * Returns a Link control for a McLead search result row matching the registration number
     * @param mcLeadRegNumber - registration number to find in the results
     */
    getMcLeadResultLink(mcLeadRegNumber: string): Link {
        logger.info(`[McLeadSearchPage.getMcLeadResultLink] - Getting result link for: ${mcLeadRegNumber}`);
        return new Link(this.page, `xpath=//table//a[@class='selector' and contains(text(),'${mcLeadRegNumber}')]`);
    }
}
