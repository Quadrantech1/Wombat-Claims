import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class FilingDetailPage extends BasePage {
    marketingTextBox = new TextBox(this.page, "#decPageDisplay");
    saveButton = new Button(this.page, "#saveButton");
    overviewLabel = new Label(this.page, "//h5[text()='Overview']");
    editIcon = new Button(this.page, "//div[@class='card-header']//button");
    activeCheckbox = new Checkbox(this.page, "//input[@id='active']");
    activateFilingConfirmationLabel = new Label(this.page, "//h5[text()='Activate Filing Confirmation']");
    activateFilingConfirmationTable = new Table(this.page, "//table[@class='table']");
    warningLabel = new Label(this.page, "//div[@class='alert alert-warning']/span");
    proceedNDeactivateButton = new Button(this.page, "//button[text()='Proceed and Deactivate ']");
    stateFilingMessagesLink = new Link(this.page, "//a[text()='State Filing Messages']");
    fraudWarningLabel = new Label(this.page, "//label[contains(text(),'Fraud Warning')]");
    mvcStateFilingView = new Link(this.page, "//a[text()='MVC State Filing View']");
    stateFilingAllowancesTab = new Link(this.page, "//a[text()='State Filing Allowances']");
    stateFilingAllowancesTable = new Table(this.page, "//table[@class='table table-bordered']");

    // Product Details buttons
    productDetailsEditButton = new Button(this.page, "(//h5[text()='Product Details']/../..//button[@class='btn btn-info ms-auto'])[1]");
    productDetailsCancelButton = new Button(this.page, "#cancelButton");
}
