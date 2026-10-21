import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class GroupClaimSearch extends BasePage {

    runSearchButton = new Button(this.page, "#btn-run-search");
    clearButton = new Button(this.page, "//a[@class='clear - form btn btn -default']");

    // TextBoxes
    claimsNoTextBox = new TextBox(this.page, "#SearchCriteria_ClaimNo");
    lastNameTextBox = new TextBox(this.page, "#SearchCriteria_LastName");
    emailAdressTextBox = new TextBox(this.page, "#SearchCriteria_Email");
    checkNumberTextBox = new TextBox(this.page, "#SearchCriteria_CheckNo");
    groupEmployeeLastNameTextBox = new TextBox(this.page, "#SearchCriteria_GroupEmployeeLastName");
    groupEmployeeEmailTextBox = new TextBox(this.page, "#SearchCriteria_GroupEmployeeEmail");

    // Tables
    searchResultTable = new Table(this.page, "//*[@id=\"search-results-wrapper\"]/table");
    claimsResultTable = new Table(this.page, "a[class='selector']");

    // Links
    claimNoLink = new Link(this.page, "//a[@class ='selector']");
}
