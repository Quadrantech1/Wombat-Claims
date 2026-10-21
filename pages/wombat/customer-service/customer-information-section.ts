import { Button } from '@controls/button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { LoadingCoverBarSection } from '../common/loading-cover-bar-section';

export class CustomerInformationSection extends BasePage {
    customerSearchTextBox = new TextBox(this.page, '#mat-input-3');
    customerSaveButton = new Button(this.page, "#save-customer");
    customerCancelButton = new Button(this.page, "#cancel-edit-customer-information");

    ownerNameEditButton = new Button(this.page, "//span[contains(text(),'Owner Name')]//mat-icon[contains(.,'edit')]");
    ownerFirstNameTextBox = new TextBox(this.page, '#owner-first-name');
    ownerLastNameTextBox = new TextBox(this.page, '#owner-last-name');
    ownerPreferredNameTextBox = new TextBox(this.page, '#owner-preferred-name');
    ownerCancelButton = new Button(this.page, "#cancel-owner");

    phoneEditButton = new Button(this.page, "//span[contains(text(),'Phone')]//mat-icon[contains(.,'edit')]");
    phoneNumberTextBox = new TextBox(this.page, '#primary-phone-number');
    extensionTextBox = new TextBox(this.page, '#primary-extension');
    phoneUserComboBox = new Select(this.page, '#primary-phone-use');
    phoneCancelButton = new Button(this.page, "#cancel-primary-phone");

    alternativePhoneAddButton = new Button(this.page, "//span[contains(text(),'Alternative Phone')]//mat-icon[contains(.,'add')]");
    alternativePhoneEditButton = new Button(this.page, "#add-edit-alternative-phone");
    alternativePhoneNumberTextBox = new TextBox(this.page, '#alternative-phone-number');
    alternativeExtensionTextBox = new TextBox(this.page, '#alternative-extension')
    alternativePhoneUserComboBox = new Select(this.page, '#alternative-phone-use');
    alternativePhoneCancelButton = new Button(this.page, "#cancel-alternative-phone");

    loadingCoverBarSection = new LoadingCoverBarSection(this.page);


    async addAlternativePhone(alternativePhone: { number: string, extension: string, use: string }): Promise<void> {
        await this.alternativePhoneAddButton.clickAndWait();
        await this.alternativePhoneNumberTextBox.setText(alternativePhone.number);
        await this.alternativeExtensionTextBox.setText(alternativePhone.extension);
        await this.alternativePhoneUserComboBox.selectOptionSpan(alternativePhone.use);
        await this.customerSaveButton.clickAndWait();
        await this.customerSaveButton.waitWhileControlDisappears();
    }

    async editAlternativePhone(alternativePhone: { number: string, extension: string, use: string }): Promise<void> {
        await this.alternativePhoneEditButton.clickAndWait();
        await this.alternativePhoneNumberTextBox.setText(alternativePhone.number);
        await this.alternativeExtensionTextBox.setText(alternativePhone.extension);
        await this.alternativePhoneUserComboBox.selectOptionSpan(alternativePhone.use);
        await this.customerSaveButton.clickAndWait();
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear();
        await this.customerSaveButton.waitWhileControlDisappears();
    }


}
