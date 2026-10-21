import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { AlertSection } from '../common-section/alert-section';


export class CustomerDetailPage extends BasePage {

    firstNameTextBox = new TextBox(this.page, "input#Customer_FirstName");
    lastNameTextBox = new TextBox(this.page, "input#Customer_LastName");
    emailTextBox = new TextBox(this.page, "input#Customer_Email");
    phoneTextBox = new TextBox(this.page, "input#Customer_PhoneDay");
    altPhoneNumberTextBox = new TextBox(this.page, "input#Customer_AlternatePhone");
    customerAddress1TextBox = new TextBox(this.page, "input#Customer_Address1");
    customerAddress2TextBox = new TextBox(this.page, "input#Customer_Address2");
    customerCityTextBox = new TextBox(this.page, "input#Customer_City");
    customerPostalCodeTextBox = new TextBox(this.page, "input#Customer_PostalCode");
    stateDropdown = new Select(this.page, "select#Customer_StateProvId");

    saveButton = new Button(this.page, "button.disable-after-click.btn.btn-success");
    popupSaveButton = new Button(this.page, "form.modal-form + button:has-text(' Save')");
    addNewCustomersButton = new Button(this.page, "a[title='Add Customer']");
    createANewCustomerButton = new Button(this.page, "a:has-text(' Create a New Customer')");
    customerDetailsPagesaveButton = new Button(this.page, "div.modal-footer button.disable-after-click.btn.btn-success");

    notesLink = new Link(this.page, "a[title='Note(s)']");
    notesTab = new Table(this.page, this.page.locator("#note-row").locator("div").last());
    sameAddressAsPrimaryCheckBox = new Checkbox(this.page, "#SameAddressAsPrimary");

    alertSection = new AlertSection(this.page);
}