import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { FelixQuoteData, getDefaultFelixQuoteData } from '@data/felix/felix-quote-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { isMobile } from '@utils/browser-utils';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class CustomQuotePage extends BasePage {
    // Form elements
    addYour30DayOfferButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Your 30-Day CFA Offer' }));
    petNameTextBox = new TextBox(this.page, '#petName');
    zipCodeTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Zip Code*' }));
    femaleGenderButton = new Button(this.page, this.page.getByText('Female'));
    maleGenderButton = new Button(this.page, this.page.getByText('Male', { exact: true }));
    petAgeSelect = new Select(this.page, '#age');
    dogButton = new Button(this.page, this.page.getByText('Dog', { exact: true }));
    catButton = new Button(this.page, this.page.getByText('Cat', { exact: true }));
    petBreedTextBox = new TextBox(this.page, '#breedId');
    emailTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Your Email*' }));
    termsCheckbox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'By checking this box, I' }));
    getYourQuoteButton = new Button(this.page, this.page.getByRole('button', { name: 'Get Your Quote' }));
    hamburgerMenuButton = new Button(this.page, '#hmbrgr_menu_btn');
    portalLoginLink = new Button(this.page, '#portal_login_link');

    /**
     * Fills out the Felix quote form with provided data or defaults
     * @param quoteData - Optional data object with form fields
     * @param randomValue - Optional random value for generating unique data
     */
    async fillQuoteForm(quoteData?: Partial<FelixQuoteData>): Promise<void> {
        const defaultData = getDefaultFelixQuoteData();
        const formData = { ...defaultData, ...quoteData };
        logger.info(`[CustomQuotePage.fillQuoteForm] Filling Felix quote form with data: ${JSON.stringify(formData)}`);

        await this.petNameTextBox.setText(formData.petName);
        await this.zipCodeTextBox.setText(formData.zipCode);
        await this.selectGender(formData.gender);
        await this.petAgeSelect.selectValue(formData.petAge);
        await this.selectBreed(formData.breed);
        await this.emailTextBox.setText(formData.email);
        await this.termsCheckbox.check();
        logger.info('[CustomQuotePage.fillQuoteForm] Felix quote form filled successfully');
    }

    /**
     * Selects gender option
     * @param gender - The gender to select ('male' or 'female')
     */
    async selectGender(gender: 'male' | 'female'): Promise<void> {
        logger.info(`[CustomQuotePage.selectGender] Selecting gender: ${gender}`);
        if (gender === 'male') {
            await this.maleGenderButton.click();
        } else {
            await this.femaleGenderButton.click();
        }
    }

    /**
     * Updates specific cat information fields without affecting other fields
     * Only updates fields that are provided in the data object
     * @param editData - Object containing only the fields to update
     */
    async updateCatInformation(editData: Partial<FelixQuoteData>): Promise<void> {
        logger.info('[CustomQuotePage.updateCatInformation] Updating cat information');
        if (editData.petName !== undefined) {
            await this.editPetName(editData.petName);
        }

        if (editData.gender !== undefined) {
            await this.selectGender(editData.gender);
        }

        if (editData.petAge !== undefined) {
            await this.petAgeSelect.selectValue(editData.petAge);
        }

        if (editData.breed !== undefined) {
            await this.selectBreed(editData.breed);
        }
        await this.termsCheckbox.check();
        logger.info('[CustomQuotePage.updateCatInformation] Cat information updated successfully');
    }

    /**
     * Selects a cat breed by typing the breed name and then selecting the option from the dropdown.
     * @param breedName - The exact name of the breed to select (e.g., 'American Curl')
     */
    async selectBreed(breedName: string): Promise<void> {
        logger.info(`[CustomQuotePage.selectBreed] Selecting breed: ${breedName}`);

        await this.petBreedTextBox.clear();
        await this.petBreedTextBox.setText(breedName);

        const listbox = this.page.getByRole('listbox');
        await listbox.waitFor({ state: 'visible', timeout: timeouts.veryShort });
        const option = listbox.getByRole('option', { name: breedName, exact: true });

        try {
            await option.waitFor({ state: 'visible', timeout: timeouts.veryShort });
        } catch {
            logger.warning(`[CustomQuotePage.selectBreed] Option not found  ${breedName}, trying again`);
            await this.petBreedTextBox.setText(breedName);
            await listbox.waitFor({ state: 'visible', timeout: timeouts.polling });
            await option.waitFor({ state: 'visible', timeout: timeouts.polling });
        }
        await option.click();
        await expect(this.petBreedTextBox.getLocator()).toHaveValue(breedName);
    }

    /**
     * Edits the pet name field by clearing the existing value and entering a new name
     * @param newName - The new name to enter for the pet
     * @returns Promise that resolves when the pet name has been updated
     */
    async editPetName(newName: string): Promise<void> {
        logger.info(`[CustomQuotePage.editPetName] Editing pet name to: ${newName}`);
        await this.petNameTextBox.click();
        await this.petNameTextBox.clear();
        await this.page.waitForTimeout(timeouts.polling)
        await this.petNameTextBox.clear();
        await this.petNameTextBox.typeText(newName);
        logger.info('[CustomQuotePage.editPetName] Pet name has been updated successfully');
    }

    /**
     * Returns the locator for the gender, age, or breed label
     * @param value - The value to match (e.g., 'Female', 'Abyssinian')
     */
    async getInfoLabel(value: string) {
        logger.info(`[CustomQuotePage.getInfoLabel] Getting info label for value: ${value}`);
        return new Label(this.page, this.page.getByText(value));
    }

    /**
     * Returns the locator for the gender, age, or breed label
     * @param value - The value to match (e.g., 'Female', 'Abyssinian')
     */
    async getLinks(value: string) {
        logger.info(`[CustomQuotePage.getLinks] Getting link for value: ${value}`);
        const mobileView = await isMobile(this.page);
        if (value === 'Login' && mobileView) {
            return new Label(this.page, this.page.getByLabel('mobile navigation').getByRole('link', { name: 'Login' }));
        } else if (value === 'Login' && !mobileView) {
            return new Label(this.page, this.page.locator('#portal_login_link'));
        }
        return new Label(this.page, this.page.getByRole('link', { name: value }));
    }

    /**
     * Handles hamburger menu visibility and click based on browser type
     */
    async verifyHamburgerMenu(): Promise<void> {
        const hamburgerMenuButton = this.hamburgerMenuButton.getLocator();
        const mobileView = await isMobile(this.page);
        if (mobileView) {
            await expect(hamburgerMenuButton).toBeVisible();
            await hamburgerMenuButton.click();
        } else {
            await expect(hamburgerMenuButton).not.toBeVisible();
        }
    }

}
