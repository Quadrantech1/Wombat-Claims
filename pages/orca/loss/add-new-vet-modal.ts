import { Button } from '@controls/button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { VetData } from '@data/orca/vet-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

/**
 */
export class AddNewVetModal extends BasePage {
    // TextBoxes
    vetNameTextBox = new TextBox(this.page, '#VetDto_Name');
    vetAddressOneTextBox = new TextBox(this.page, '#VetDto_Address1');
    cityTextBox = new TextBox(this.page, '#VetDto_City');
    postalCodeTextBox = new TextBox(this.page, '#VetDto_PostalCode');
    phoneTextBox = new TextBox(this.page, '#VetDto_PhoneDay');
    emailTextBox = new TextBox(this.page, '#VetDto_Email');

    // Select Dropdown
    stateProvinceDropdown = new Select(this.page, '//select[@id="vet-add-state-prov-select"]');

    // Button
    saveButton = new Button(this.page, '#btn-save');

    async fillNewVetForm(vetData?: Partial<VetData>): Promise<void> {
        const { vetName, address1, city, postalCode, stateProvince, phone, email } = vetData || {};
        logger.info(`Filling out new vet form with Name: ${vetName}, Address1: ${address1}, City: ${city}, Postal Code: ${postalCode}, State/Province: ${stateProvince}, Phone: ${phone}, Email: ${email}`);
        if (vetName) await this.vetNameTextBox.setText(vetName);
        if (address1) await this.vetAddressOneTextBox.setText(address1);
        if (city) await this.cityTextBox.setText(city);
        if (postalCode) await this.postalCodeTextBox.setText(postalCode);
        if (stateProvince) await this.stateProvinceDropdown.selectOption(stateProvince);
        if (phone) await this.phoneTextBox.setText(phone);
        if (email) await this.emailTextBox.setText(email);

        await this.saveButton.clickAndWait();
        await this.saveButton.waitWhileControlDisappears();
    }

}
