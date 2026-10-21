import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { LitterDetailsData, getDefaultLitterDetailsData } from '@data/orca/breeder-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { AlertSection } from '../common-section/alert-section';

export class LitterDetailsSection extends BasePage {
    // Labels - for verification
    breederLabel = new Label(this.page, "//div[text()='Breeder']");
    marketChannelLabel = new Label(this.page, "//div[text()='Market Channel']");
    welcomeSentLabel = new Label(this.page, "//div[text()='Welcome Sent']");
    registrationNumberLabel = new Label(this.page, "//label[text()='Registration Number']");
    registrationDateLabel = new Label(this.page, "//label[text()='Registration Date']");
    dateOfBirthLabel = new Label(this.page, "//label[text()='Date of Birth']");
    breedLabel = new Label(this.page, "//label[text()='Breed']");
    maleCountLabel = new Label(this.page, "//label[text()='Male Count']");
    femaleCountLabel = new Label(this.page, "//label[text()='Female Count']");
    coOwnerLabel = new Label(this.page, "#coOwners-link");

    // Text Inputs
    registrationNumberTextBox = new TextBox(this.page, "//input[@id='Litter_LitterRegNo']");
    registrationDateTextBox = new TextBox(this.page, "//input[@id='Litter_LitterRegDate']");
    dateOfBirthTextBox = new TextBox(this.page, "//input[@id='Litter_Dob']");
    maleCountTextBox = new TextBox(this.page, "//input[@id='Litter_MaleCount']");
    femaleCountTextBox = new TextBox(this.page, "//input[@id='Litter_FemaleCount']");

    // Select Dropdowns
    marketChannelSelect = new Select(this.page, "//select[@name='Litter.MarketChannelId']");
    breedSelect = new Select(this.page, "//select[@id='breed-select']");

    // Buttons
    saveButton = new Button(this.page, "//button[@class='btn btn-success']");

    alertSection = new AlertSection(this.page);

    /**
     * Fills the litter details form with provided data
     * @param litterData - Optional partial litter data. Merges with defaults if not provided.
     * @returns Promise that resolves when form is filled
     */
    async fillLitterDetails(litterData?: Partial<LitterDetailsData>): Promise<void> {
        const formData = { ...getDefaultLitterDetailsData(), ...litterData };
        logger.info(`[LitterDetailsSection.fillLitterDetails] - Filling litter details with data: ${JSON.stringify(formData)}`);

        await this.marketChannelSelect.selectValue(formData.marketChannel);
        await this.registrationNumberTextBox.setText(formData.registrationNumber);

        await this.registrationDateTextBox.click();
        await this.registrationDateTextBox.setText(formData.registrationDate);
        await this.page.keyboard.press('Tab');

        await this.dateOfBirthTextBox.setText(formData.dateOfBirth);
        await this.page.keyboard.press('Tab');

        await this.breedSelect.selectValue(formData.breed);
        await this.maleCountTextBox.setText(formData.maleCount);
        await this.femaleCountTextBox.setText(formData.femaleCount);

        logger.info('[LitterDetailsSection.fillLitterDetails] - Litter details filled successfully');
    }
}
