import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { VetData } from '@data/orca/vet-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { AlertSection } from '../common-section/alert-section';

export class VetDetailsPage extends BasePage {
    // TextBoxes
    vetNameTextBox = new TextBox(this.page, '#VetDto_Name');
    address1TextBox = new TextBox(this.page, '#VetDto_Address1');
    address2TextBox = new TextBox(this.page, '#VetDto_Address2');
    cityTextBox = new TextBox(this.page, '#VetDto_City');
    postalCodeTextBox = new TextBox(this.page, '#VetDto_PostalCode');
    phoneTextBox = new TextBox(this.page, '#VetDto_PhoneDay');
    faxTextBox = new TextBox(this.page, '#VetDto_Fax');
    emailTextBox = new TextBox(this.page, '#VetDto_Email');
    notesTextBox = new TextBox(this.page, '#VetDto_Notes');

    // Select Dropdowns
    stateProvinceDropDown = new Select(this.page, '#vet-add-state-prov-select');
    prefDeliveryMethodDropDown = new Select(this.page, '#delivery-method');

    // Buttons
    cancelButton = new Button(this.page, "//a[contains(text(),'Cancel')]");
    saveButton = new Button(this.page, "//button[contains(text(),'Save')]");
    editVetButton = new Button(this.page, "//a[@class='ajax-get span6 btn btn-inverse']");
    editButton = new Button(this.page, "//a[text()=' Edit']");

    // Labels
    overviewSection = new Label(this.page, "//*[text()='Overview']");
    alertSection = new AlertSection(this.page);

    async verifyDataInTheForm(expectedVetData: Partial<VetData>): Promise<void> {
        if (expectedVetData.vetName) await expect.soft(await this.vetNameTextBox.getAttribute("value")).toBe(expectedVetData.vetName);
        if (expectedVetData.address1) await expect.soft(await this.address1TextBox.getAttribute("value")).toBe(expectedVetData.address1);
        if (expectedVetData.address2) await expect.soft(await this.address2TextBox.getAttribute("value")).toBe(expectedVetData.address2);
        if (expectedVetData.city) await expect.soft(await this.cityTextBox.getAttribute("value")).toBe(expectedVetData.city);
        if (expectedVetData.postalCode) await expect.soft(await this.postalCodeTextBox.getAttribute("value")).toBe(expectedVetData.postalCode);
        if (expectedVetData.stateProvince) await expect.soft(await this.stateProvinceDropDown.getTextOptionSelected()).toBe(expectedVetData.stateProvince);
        if (expectedVetData.phone) await expect.soft(await this.phoneTextBox.getAttribute("value")).toBe(expectedVetData.phone);
        if (expectedVetData.fax) await expect.soft(await this.faxTextBox.getAttribute("value")).toBe(expectedVetData.fax);
        if (expectedVetData.email) await expect.soft(await this.emailTextBox.getAttribute("value")).toBe(expectedVetData.email);
        if (expectedVetData.notes) await expect.soft(await this.notesTextBox.getAttribute("value")).toBe(expectedVetData.notes);
        if (expectedVetData.prefDeliveryMethod) await expect.soft(await this.prefDeliveryMethodDropDown.getTextOptionSelected()).toBe(expectedVetData.prefDeliveryMethod);
    }

    async verifyAllControlsAreDisplayed(): Promise<void> {
        await expect.soft(this.vetNameTextBox.getLocator()).toBeVisible();
        await expect.soft(this.address1TextBox.getLocator()).toBeVisible();
        await expect.soft(this.address2TextBox.getLocator()).toBeVisible();
        await expect.soft(this.cityTextBox.getLocator()).toBeVisible();
        await expect.soft(this.postalCodeTextBox.getLocator()).toBeVisible();
        await expect.soft(this.stateProvinceDropDown.getLocator()).toBeVisible();
        await expect.soft(this.phoneTextBox.getLocator()).toBeVisible();
        await expect.soft(this.faxTextBox.getLocator()).toBeVisible();
        await expect.soft(this.emailTextBox.getLocator()).toBeVisible();
        await expect.soft(this.notesTextBox.getLocator()).toBeVisible();
        await expect.soft(this.prefDeliveryMethodDropDown.getLocator()).toBeVisible();
        await expect.soft(this.cancelButton.getLocator()).toBeVisible();
        await expect.soft(this.saveButton.getLocator()).toBeVisible();
    }

}
