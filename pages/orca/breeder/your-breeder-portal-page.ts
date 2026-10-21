import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class YourBreederPortalPage extends BasePage {
    // Tables
    coverageGetFormsTable = new Table(this.page, ".rounded_table.full_table.striped_table.datalist");

    // Links
    downloadLink = new Link(this.page, "//a[text()='Download ']");

    // Buttons
    printFormButton = new Button(this.page, "//a[text()='Print Form']");
    emailFormButton = new Button(this.page, "//button[@id='send_email_btn']");
    getFormsButton = new Button(this.page, this.page.getByRole('link', { name: 'Get Forms' }));

    // Text Inputs
    emailInputTextBox = new TextBox(this.page, "//input[@id='email']");
}
