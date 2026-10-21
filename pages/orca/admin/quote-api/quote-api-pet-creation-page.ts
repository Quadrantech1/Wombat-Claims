import { Button } from '@controls/button';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { getDefaultPetInfo, QuoteApiPetInfo } from '@data/orca/quote-api-pet-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class QuoteApiPetCreationPage extends BasePage {
    petNameTextBox = new TextBox(this.page, "//input[@formcontrolname='name']");
    genderSelect = new Select(this.page, "//select[@formcontrolname='gender']");
    weightTextBox = new TextBox(this.page, "//input[@formcontrolname='weight']");
    petBreedSelect = new Select(this.page, "//select[@formcontrolname='breedId']");
    petAgeSelect = new Select(this.page, "//select[@formcontrolname='ageId']");
    nextButton = new Button(this.page, "//button[text()='Next']");
    hasYourPetEverNoOption = new RadioButton(this.page, "#question0response1");
    isCrossbreedNoOption = new RadioButton(this.page, "#isCrossbreed-no");
    createButton = new Button(this.page, this.page.getByRole('button', { name: 'Create' }));

    /**
     * Selects pet type radio button
     */
    async selectPetType(petType: string): Promise<void> {
        logger.info(`[QuoteApiPetCreationPage.selectPetType] - Selecting pet type: ${petType}`);
        const speciesRadioButton = new RadioButton(this.page, `//label[text()='Pet Type']//following-sibling::div/div/label[contains(text(),'${petType}')]/input`);
        await speciesRadioButton.click();
    }

    /**
     * Fills out pet information
     */
    async fillOutPetInformation(petInfo?: Partial<QuoteApiPetInfo>): Promise<void> {
        const defaultData = getDefaultPetInfo();
        const data = { ...defaultData, ...petInfo };
        logger.info(`[QuoteApiPetCreationPage.fillOutPetInformation] - Filling pet information`);
        await this.petNameTextBox.setText(data.petName);
        await this.selectPetType(data.petType);
        await this.genderSelect.selectOption(data.gender);
        await this.weightTextBox.setText(data.weight);
        await this.petBreedSelect.selectOption(data.petBreed);
        await this.petAgeSelect.selectOption(data.petAge);
        if (await this.hasYourPetEverNoOption.isDisplayed()) {
            await this.hasYourPetEverNoOption.click();
        } else if (await this.isCrossbreedNoOption.isDisplayed()) {
            await this.isCrossbreedNoOption.click();
        } else {
            throw new Error('[QuoteApiPetCreationPage.fillOutPetInformation] - Expected either "Has your pet ever" or "Is crossbreed" radio option to be visible');
        }
    }
}
