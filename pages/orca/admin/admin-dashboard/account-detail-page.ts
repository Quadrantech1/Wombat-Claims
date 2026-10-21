import { Button } from "@controls/button";
import { Checkbox } from "@controls/checkbox";
import { TextBox } from "@controls/textbox";
import { BasePage } from "@pages/base-page";
import { Table } from "@controls/table";


export class AccountDetailPage extends BasePage {
    cancelButton = new Button(this.page, "//a[@title='Cancel']");
    saveButton = new Button(this.page, "//button[contains(text(),'Save')]");
    activeCheckBox = new Checkbox(this.page, '#SysUser_Active');
    firstNameTextBox = new TextBox(this.page, '#SysUser_FirstName');
    lastNameTextBox = new TextBox(this.page, '#SysUser_LastName');
    domainTextBox = new TextBox(this.page, '#SysUser_Domain');
    userNameTextBox = new TextBox(this.page, '#SysUser_Username');
    emailAddressTextBox = new TextBox(this.page, '#SysUser_Email');

    // Role checkboxes
    administratorCheckBox = new Checkbox(this.page, "//label[text()='Administrator']/preceding::input[1]");
    customerServiceCheckBox = new Checkbox(this.page, "//label[text()='Customer Service']/preceding::input[1]");
    claimsSpecialistCheckBox = new Checkbox(this.page, "//label[text()='Claims Specialist']/preceding::input[1]");
    superAdminCheckBox = new Checkbox(this.page, "//label[text()='Super Admin']/preceding::input[1]");
    testCheckBox = new Checkbox(this.page, "//label[text()='Test']/preceding::input[1]");
    financeCheckBox = new Checkbox(this.page, "//label[text()='Finance']/preceding::input[1]");
    marketingCheckBox = new Checkbox(this.page, "//label[text()='Marketing']/preceding::input[1]");
    salesCheckBox = new Checkbox(this.page, "//label[text()='Sales']/preceding::input[1]");
    claimsAdminCheckBox = new Checkbox(this.page, "//label[text()='Claims Admin']/preceding::input[1]");
    claimsAuditorCheckBox = new Checkbox(this.page, "//label[text()='Claims Auditor']/preceding::input[1]");
    breederSupportSpecialistCheckBox = new Checkbox(this.page, "//label[text()='Breeder Support Specialist']/preceding::input[1]");
    documentSpecialistCheckBox = new Checkbox(this.page, "//label[text()='Document Specialist']/preceding::input[1]");
    customerServiceAdministratorCheckBox = new Checkbox(this.page, "//label[text()='Customer Service Administrator']/preceding::input[1]");
    financeAdminCheckBox = new Checkbox(this.page, "//label[text()='Finance Admin']/preceding::input[1]");

    auditTrialTable = new Table(this.page, '#audit-sysuser-actions-table');
}
