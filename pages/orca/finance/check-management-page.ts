import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class CheckManagementPage extends BasePage {
    beginCheckReconciliationButton = new Button(this.page, "//button[text()='Begin Check Reconciliation']");
    underwriterDropdown = new Select(this.page, "//select[@formcontrolname='underwriterCode']");
    policyIdTextBox = new TextBox(this.page, "//input[@formcontrolname='policyId' and @type='number']");
    certificateIdTextBox = new TextBox(this.page, "//input[@formcontrolname='certificateId']");
    claimIdTextBox = new TextBox(this.page, "//input[@formcontrolname='claimId']");
    checkNoTextBox = new TextBox(this.page, "//input[@formcontrolname='checkNo']");
    checkDateTextBox = new TextBox(this.page, "//input[@formcontrolname='checkDate']");
    checkAmountTextBox = new TextBox(this.page, "//input[@formcontrolname='checkAmount']");
    paymentMethodDropdown = new Select(this.page, "//select[@formcontrolname='paymentMethodCode']");
    viewOutstandingChecksCheckBox = new Checkbox(this.page, "//input[@formcontrolname='outstandingChecks']");
    searchButton = new Button(this.page, "//button[text()='Search']");
    clearButton = new Button(this.page, "//button[text()='Clear']");
    searchResultTable = new Table(this.page, "//table[@class='table table-bordered table-sm']");
}
