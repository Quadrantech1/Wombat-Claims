import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { AlertSection } from '@pages/orca/common-section/alert-section';

export class FilingPage extends BasePage {
    addNewButton = new Button(this.page, "xpath=//button[text()='Add New']");
    fieldRequiredLabel = new Label(this.page, "xpath=//div[@class='text-danger']");
    searchButton = new Button(this.page, "xpath=//button[text()='Search']");
    rowsInFilingTable = new Table(this.page, "xpath=//table[@class='table table-bordered']/tbody/tr");
    searchTable = new Table(this.page, "xpath=//table[@class='table table-bordered']");
    filingsLabel = new Label(this.page, "xpath=//h5[text()='Filings']");
    stateFilingIdTextbox = new TextBox(this.page, "xpath=//input[@formcontrolname='stateFilingId']");
    statusLabel = new Label(this.page, "xpath=//*[@class='bi bi-square']/parent::td//following-sibling::td");
    stateFilingIDLink = new Link(this.page, "xpath=//table[@class='table table-bordered']//a");
    activeCheckbox = new Checkbox(this.page, "xpath=//*[@class='bi bi-check-square']");
    stateDropdown = new Select(this.page, "xpath=//select[@formcontrolname='state']");
    coverageDateTextBox = new TextBox(this.page, "xpath=//input[@formcontrolname='coverageDate']");
    marketChannelDropdown = new Select(this.page, "xpath=//select[@formcontrolname='marketChannelCode']");
    applicationAcknowledgement30Day = new TextBox(this.page, "xpath=//label[text()='Application Acknowledgement (30 Day)']");
    actionButton = new Button(this.page, "xpath=//button[@title='Edit']");
    procedureTextBox = new TextBox(this.page, this.page.locator('.input-group').first());
    mvcStateFilingView = new Link(this.page, "xpath=//a[text()='MVC State Filing View']");
    cancelDaysOverride = new TextBox(this.page, "id=CancelDaysOverride");
    cancelOverrideStartTextBox = new TextBox(this.page, "id=CancelStartDate");
    cancelOverrideEndTextBox = new TextBox(this.page, "id=CancelEndDate");
    saveButton = new Button(this.page, "xpath=//button[text()=' Save']");
    stateFillingIdTable = new Table(this.page, "xpath=//div[@class='container']");
    alertSection = new AlertSection (this.page);
    displayFilterTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Display filter' }));
}
