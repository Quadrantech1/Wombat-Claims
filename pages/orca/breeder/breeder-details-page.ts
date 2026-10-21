import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BreederDetailsData, getDefaultBreederDetailsData } from '@data/orca/breeder-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { AlertSection } from '../common-section/alert-section';
import { expect } from '@playwright/test';

export class BreederDetailsPage extends BasePage {
    // Labels - for verification
    firstNameLabel = new Label(this.page, "//div[text()='First Name']");
    lastNameLabel = new Label(this.page, "//div[text()='Last Name']");
    emailLabel = new Label(this.page, "//label[text()='Email']");
    phoneNoLabel = new Label(this.page, "//label[text()='Phone No']");
    address1Label = new Label(this.page, "//label[text()='Address 1']");
    address2Label = new Label(this.page, "//label[text()='Address 2']");
    cityLabel = new Label(this.page, "//label[text()='City']");
    stateProvinceLabel = new Label(this.page, "//label[text()='State/Province']");
    postalCodeLabel = new Label(this.page, "//label[text()='Postal Code']");
    sendEmailLabel = new Label(this.page, "//div[text()='Send Email']");
    breederIncentiveLabel = new Label(this.page, "//div[text()='Breeder Incentive']");

    // Text Inputs
    firstNameTextBox = new TextBox(this.page, "//input[@id='BreederDTO_FirstName']");
    lastNameTextBox = new TextBox(this.page, "//input[@id='BreederDTO_LastName']");
    emailTextBox = new TextBox(this.page, "//input[@id='BreederDTO_Email']");
    phoneNoTextBox = new TextBox(this.page, "//input[@id='BreederDTO_PhoneNo']");
    address1TextBox = new TextBox(this.page, "//input[@id='BreederDTO_Address1']");
    address2TextBox = new TextBox(this.page, "//input[@id='BreederDTO_Address2']");
    cityTextBox = new TextBox(this.page, "//input[@id='BreederDTO_City']");
    postalCodeTextBox = new TextBox(this.page, "//input[@id='BreederDTO_PostalCode']");

    // Select Dropdowns
    stateSelect = new Select(this.page, "//select[@id='BreederDTO_StateCode']");

    // Buttons
    saveButton = new Button(this.page, "//button[@class='btn btn-success']");
    impersonateButton = new Button(this.page, "//a[@class='btn btn-info']");

    // Tables
    littersTable = new Table(this.page, "//table[contains(.,'Litter Reg No')]");

    alertSection = new AlertSection(this.page);

    /**
     * Fills the breeder details form with provided data
     * @param breederData - Optional partial breeder data. Merges with defaults if not provided.
     * @returns Promise that resolves when form is filled
     */
    async fillBreederDetails(breederData?: Partial<BreederDetailsData>): Promise<void> {
        const formData = { ...getDefaultBreederDetailsData(), ...breederData };
        logger.info(`[BreederDetailsPage.fillBreederDetails] - Filling breeder details with data: ${JSON.stringify(formData)}`);

        await this.firstNameTextBox.clear();
        await this.firstNameTextBox.setText(formData.firstName);

        await this.lastNameTextBox.clear();
        await this.lastNameTextBox.setText(formData.lastName);

        await this.emailTextBox.clear();
        await this.emailTextBox.setText(formData.email);

        await this.phoneNoTextBox.clear();
        await this.phoneNoTextBox.setText(formData.phoneNo);

        await this.address1TextBox.clear();
        await this.address1TextBox.setText(formData.address1);

        await this.address2TextBox.clear();
        await this.address2TextBox.setText(formData.address2);

        await this.cityTextBox.clear();
        await this.cityTextBox.setText(formData.city);

        await this.stateSelect.selectValue(formData.stateProvince);

        await this.postalCodeTextBox.clear();
        await this.postalCodeTextBox.setText(formData.postalCode);

        logger.info('[BreederDetailsPage.fillBreederDetails] - Breeder details filled successfully');
    }

    /**
     * Gets the email text box element for a specific email value
     * @param email - The email value to locate
     * @returns TextBox control for the specific email
     */
    getEmailTextBoxByValue(email: string): TextBox {
        return new TextBox(this.page, `//input[@value='${email}']`);
    }

    /**
     * Gets the first litter certificate number from the litters table
     * @returns Promise resolving to the litter certificate number as string
     */
    async getFirstLitterCertificateNo(): Promise<string> {
        logger.info('[BreederDetailsPage.getFirstLitterCertificateNo] - Getting first litter certificate number');
        const value = await this.littersTable.getValueCell(1, 1);
        logger.info(`[BreederDetailsPage.getFirstLitterCertificateNo] - Found certificate number: ${value}`);
        return value;
    }

    /**
     * Asserts that the breeder detail labels are visible using Playwright expect.
     * Uses inline locators so no additional getters are required.
     */
    async expectBreederDetailsLabelsVisible(): Promise<void> {
        logger.info('[BreederDetailsPage.expectBreederDetailsLabelsVisible] - Verifying breeder detail labels are visible');
        await expect(this.firstNameLabel.getLocator()).toBeVisible();
        await expect(this.lastNameLabel.getLocator()).toBeVisible();
        await expect(this.emailLabel.getLocator()).toBeVisible();
        await expect(this.phoneNoLabel.getLocator()).toBeVisible();
        await expect(this.address1Label.getLocator()).toBeVisible();
        await expect(this.address2Label.getLocator()).toBeVisible();
        await expect(this.cityLabel.getLocator()).toBeVisible();
        await expect(this.stateProvinceLabel.getLocator()).toBeVisible();
        await expect(this.postalCodeLabel.getLocator()).toBeVisible();
        await expect(this.sendEmailLabel.getLocator()).toBeVisible();
        logger.info('[BreederDetailsPage.expectBreederDetailsLabelsVisible] - Breeder detail labels verified visible');
    }
}
