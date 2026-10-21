import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { getDefaultStepOneData, StepOneData } from '@data/quote/step-one-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { AKCRegistrationModal } from './akc-registration-modal';

export class StepOnePage extends BasePage {
    petNameTextBox = new TextBox(this.page, "#petName");
    postalCodeTextBox = new TextBox(this.page, "#postalCode");
    dogRadio = new RadioButton(this.page, this.page.getByText('Dog'));
    catRadio = new RadioButton(this.page, this.page.getByText(/\b(CAT|Cat)\b/i));
    femaleRadio = new RadioButton(this.page, this.page.getByText(/\b(Female|Femelle)\b/i));
    maleRadio = new RadioButton(this.page, this.page.getByText(/\b(Male|Mâle)\b/i));
    petAgeSelect = new Select(this.page, "#age");
    emailTextBox = new TextBox(this.page, "#email");
    partnerCodeTextBox = new TextBox(this.page, "#partnerCode");
    termsCheckbox = new Checkbox(this.page, '#agreement, #MarketingSMSRoboOptIn');
    chooseCoverageButton = new Button(this.page, "#submit_quote");
    petBreedTextBox = new TextBox(this.page, "#breedId");
    isYourPetRegisteredButton = new Button(this.page, this.page.getByRole('button', { name: 'Is your pet registered with' }));
    phoneNumberTextBox = new TextBox(this.page, "#phoneNumber");
    // message in page
    successPartnerCodeLabel = new Label(this.page, "#partnerCode_valid");
    agentFieldLabel = new Label(this.page, this.page.getByText('Agent', { exact: true }));
    agentCodeTextBoxValue = new TextBox(this.page, '#agent');

    akcRegistrationModal = new AKCRegistrationModal(this.page);


    // 
    continueToQuoteButton = new Button(this.page, this.page.getByRole('button', { name: 'Continue to Quote' }));

    /**
     * Gets the default data for the quote form
     * Override this method in child classes to provide brand-specific defaults
     */
    protected getDefaultFormData(): StepOneData {
        return getDefaultStepOneData();
    }

    /**
     * Fills out the quote form with provided data or defaults
     * @param quoteData - Optional data object with form fields
     */
    async fillQuoteForm(quoteData?: Partial<StepOneData>): Promise<void> {
        const defaultData = this.getDefaultFormData();
        const formData = { ...defaultData, ...quoteData };
        logger.info(`[${this.constructor.name}.fillQuoteForm] Filling quote form with data: ${JSON.stringify(formData)}`);

        await this.petNameTextBox.setText(formData.petName);

        // Skip postal code if already filled (e.g., when adding another pet)
        const currentPostalCode = await this.postalCodeTextBox.getLocator().inputValue();
        if (!currentPostalCode) {
            await this.postalCodeTextBox.setText(formData.postalCode);
        }

        formData.petType === 'dog' ? await this.dogRadio.click() : await this.catRadio.click();
        await this.selectGender(formData.gender);
        await this.petAgeSelect.selectValue(formData.petAge);

        // Skip email if already filled (e.g., when adding another pet)
        const currentEmail = await this.emailTextBox.getLocator().inputValue();
        if (!currentEmail) {
            await this.emailTextBox.setText(formData.email);
        }

        await this.selectBreed(formData.breed);
        if (formData.partnerCode) {
            await this.page.waitForTimeout(timeouts.veryShort);
            await this.partnerCodeTextBox.setText(formData.partnerCode);
        }

        if (await this.phoneNumberTextBox.isDisplayed()) {
            await this.phoneNumberTextBox.setText(formData.phoneNumber);
        }
        if (await this.termsCheckbox.isDisplayed()) {
            await this.termsCheckbox.check();
        }
        logger.info(`[${this.constructor.name}.fillQuoteForm] Quote form filled successfully`);
    }

    /**
     * Selects gender option
     * @param gender - The gender to select ('male' or 'female')
     */
    async selectGender(gender: 'male' | 'female'): Promise<void> {
        logger.info(`[StepOnePage.selectGender] Selecting gender: ${gender}`);
        if (gender === 'male') {
            await this.maleRadio.click();
        } else {
            await this.femaleRadio.click();
        }
    }

    /**
     * Selects a pet breed by typing the breed name and then selecting the option from the dropdown.
     * @param breedName - The exact name of the breed to select
     */
    async selectBreed(breedName: string): Promise<void> {
        logger.info(`[StepOnePage.selectBreed] Selecting breed: ${breedName}`);

        await this.petBreedTextBox.clear();
        await this.petBreedTextBox.typeText(breedName);

        const listbox = this.page.getByRole('listbox');
        await listbox.waitFor({ state: 'visible', timeout: timeouts.short });
        const option = listbox.getByRole('option', { name: breedName, exact: true });

        try {
            await option.waitFor({ state: 'visible', timeout: timeouts.veryShort });
        } catch {
            logger.warning(`[StepOnePage.selectBreed] Option not found ${breedName}, trying again`);
            await this.petBreedTextBox.setTextSequentially(breedName);
            await listbox.waitFor({ state: 'visible', timeout: timeouts.polling });
            await option.waitFor({ state: 'visible', timeout: timeouts.polling });
        }
        await option.click();
        await expect(this.petBreedTextBox.getLocator()).toHaveValue(breedName);
    }

    /**
     * Edits the pet name field by clearing and entering a new name
     * @param newName - The new name to enter for the pet
     */
    async editPetName(newName: string): Promise<void> {
        logger.info(`[StepOnePage.editPetName] Editing pet name to: ${newName}`);
        await this.petNameTextBox.click();
        await this.petNameTextBox.clear();
        await this.page.waitForTimeout(timeouts.polling);
        await this.petNameTextBox.clear();
        await this.petNameTextBox.typeText(newName);
        logger.info('[StepOnePage.editPetName] Pet name has been updated successfully');
    }

}