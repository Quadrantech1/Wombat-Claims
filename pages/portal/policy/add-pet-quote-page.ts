import { Button } from '@controls/button';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { AddPetQuoteData, getDefaultAddPetQuoteData } from '@data/portal/add-pet-quote-data';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { BasePage } from '../../base-page';

export class AddPetQuotePage extends BasePage {
    // TextBoxes
    petNameTextBox = new TextBox(this.page, "//input[@formcontrolname='petName']");
    zipCodeTextBox = new TextBox(this.page, "//div[@class='zip-container']//input");

    // RadioButtons
    dogPetTypeOption = new RadioButton(this.page, "//input[@formcontrolname='speciesId' and @value='1']");
    catPetTypeOption = new RadioButton(this.page, "//input[@formcontrolname='speciesId' and @value='2']");

    // Select Controls
    petBreedSelect = new Select(this.page, "//select[@formcontrolname='breedId']");
    petAgeSelect = new Select(this.page, "//select[@formcontrolname='petAge']");

    // Buttons
    chooseCoverageButton = new Button(this.page, "//button[@class='button__quote button--lg']");

    /**
     * Fill the add pet quote form
     * @param addPetData - Partial data containing only the fields to update
     * @returns Promise that resolves when the form is filled
     */
    async fillGetQuote(addPetData?: Partial<AddPetQuoteData>): Promise<void> {
        const formData = { ...getDefaultAddPetQuoteData(), ...addPetData };

        logger.info(`[AddPetQuotePage.fillGetQuote] Starting fill quote details with data: ${JSON.stringify(formData)}`);

        // Fill pet name
        await this.petNameTextBox.isEnabled();
        await this.petNameTextBox.setText(formData.petName!);

        // Select pet type
        if (formData.petType?.toLowerCase() === 'dog') {
            await this.dogPetTypeOption.click();
        } else if (formData.petType?.toLowerCase() === 'cat') {
            await this.catPetTypeOption.click();
        }

        // Select breed and age
        await this.petBreedSelect.waitForVisible(timeouts.short);
        await this.petBreedSelect.selectValue(formData.petBreed!);
        await this.petAgeSelect.selectValue(formData.petAge!);

        if (await this.petNameTextBox.isEmpty()) {
            await this.petNameTextBox.setText(formData.petName!);
        }

        logger.info('[AddPetQuotePage.fillGetQuote] Finished fill quote details successfully');
    }
}
