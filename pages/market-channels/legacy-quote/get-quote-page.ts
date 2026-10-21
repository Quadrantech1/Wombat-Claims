import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { GetQuoteData, getDefaultQuoteData } from '@data/quote-tool/get-quote-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class GetQuotePage extends BasePage {
    // Labels
    yourPetQuoteLabel = new Label(this.page, "h1.margin-top--1");
    testModeLabel = new Label(this.page, "strong:text('TEST MODE')");
    lookUpPetFormText = new Label(this.page, "#look-up-pet-container");
    akcIconLabel = new Label(this.page, "[alt='AKC Pet Insurance']");
    privacyPolicyLabel = new Label(this.page, "a[aria-label='Privacy Policy']");
    petPartnersLabel = new Label(this.page, "a:text('PetPartners, Inc.')");
    policyTermsLabel = new Label(this.page, ":text('policy terms and conditions')");
    ourPoliciesLabel = new Label(this.page, ":text('our policies')");
    accreditedBusinessLabel = new Label(this.page, "[alt='Better Business Bureau - PetPartners, Inc.']");
    naphiaLabel = new Label(this.page, "[alt='North American Pet Health Insurance Association']");
    consumerRatingLabel = new Label(this.page, ".consumer-affairs-link");
    shopperRatingLabel = new Label(this.page, ".shopperlink");

    // Inputs
    petNameTextBox = new TextBox(this.page, "#name");
    zipCodeTextBox = new TextBox(this.page, "#postalCode");
    petBreedSelect = new Select(this.page, this.page.getByRole('textbox', { name: 'Type your breed here' }));
    emailAddressTextBox = new TextBox(this.page, "#email");
    registrationNumberTextBox = new TextBox(this.page, "#reg_no");
    zipCodeRegistrationTextBox = new TextBox(this.page, "#zipcode");

    // Buttons
    breedSearchButton = new Button(this.page, "#breedSearchButton");
    dogPetTypeButton = new Button(this.page, "span[for='dog']");
    catPetTypeButton = new Button(this.page, "span[for='cat']");
    resetBreedButton = new Button(this.page, "#resetBreedButton");
    yesPetOptionButton = new Button(this.page, "span[for='yes']");
    noPetOptionButton = new Button(this.page, "span[for='no']");
    chooseCoverageButton = new Button(this.page, "#submit");
    editZipCodeButton = new Button(this.page, "#change-postal-code");
    yesZipCodeModalButton = new Button(this.page, this.page.getByRole('button', { name: 'Yes' }));
    lookUpPetMainButton = new Button(this.page, "#look-up-pet-btn");
    lookUpPetButton = new Button(this.page, this.page.getByRole('button', { name: 'Look up pet' }));
    cancelButton = new Button(this.page, "#look-up-cancel");

    // Select Controls
    petAgeSelect = new Select(this.page, "#age");
    customerSourceSelect = new Select(this.page, "#customer-source");

    /**
     * Fills or updates the quote form with provided data
     * @param data - Partial quote data. For 'create' mode, merges with defaults. For 'update' mode, only provided fields are processed.
     * @param mode - 'create' uses defaults + overrides, 'update' only processes provided fields
     * @returns Promise that resolves when form is successfully filled/updated
     */
    async fillQuoteForm(
        data?: Partial<GetQuoteData>,
        mode: 'create' | 'update' | 'addAPet' = 'create'
    ): Promise<void> {
        logger.info(`[GetQuotePage.fillQuoteForm] Filling quote form, mode: ${mode}`);

        await this.page.waitForLoadState('domcontentloaded');

        const formData = mode === 'create' || mode === 'addAPet'
            ? { ...getDefaultQuoteData(), ...data }
            : data || {};

        if (formData.petName) {
            await this.petNameTextBox.waitForVisible(timeouts.default);
            await this.petNameTextBox.setText(formData.petName);
        }

        if (formData.zipCode) {
            if (mode === 'update') {
                await this.editZipCodeButton.click();
                await this.yesZipCodeModalButton.click();
                await this.zipCodeTextBox.setText(formData.zipCode);
            } else if (mode === 'create') {
                await this.zipCodeTextBox.setText(formData.zipCode);
            }
        }

        if (formData.petType) {
            await this.selectPetType(formData.petType);
        }

        if (formData.breed) {
            await this.selectBreed(formData.breed);
        }

        if (formData.petAge) {
            await this.petAgeSelect.selectValue(formData.petAge);
        }

        if (formData.email) {
            await this.page.waitForTimeout(timeouts.polling);
            await this.emailAddressTextBox.setText(formData.email);
        }
        logger.info('[GetQuotePage.fillQuoteForm] Quote form filled successfully');
    }

    /**
     * Helper method for selecting pet type (dog or cat)
     * @param petType - The type of pet to select ('dog' or 'cat')
     * @returns Promise that resolves when pet type is selected
     */
    async selectPetType(petType?: string): Promise<void> {
        logger.info(`[GetQuotePage.selectPetType] Selecting pet type: ${petType}`);
        if (!petType) return;

        const type = petType.toLowerCase();
        if (type === 'dog') {
            await this.dogPetTypeButton.click();
        } else if (type === 'cat') {
            await this.catPetTypeButton.click();
        }
    }

    /**
    * Selects a breed from the breed dropdown by clicking the label with the given breed name.
    * @param breed - The breed name to select (e.g., 'Abyssinian')
    */
    async selectBreed(breed: string): Promise<void> {
        logger.info(`[GetQuotePage.selectBreed] Selecting breed: ${breed}`);
        // Wait for the breed dropdown or input to be visible and enabled
        await this.petBreedSelect.waitForVisible();
        await this.petBreedSelect.isEnabled();

        // Type the breed to filter the dropdown options
        await this.petBreedSelect.click();
        await this.petBreedSelect.typeText(breed);
        const breedOption = this.page.getByText(breed, { exact: true });
        await breedOption.click();
    }

    /**
     * Submits the quote form by clicking the choose coverage button
     * @returns Promise that resolves when form is successfully submitted
     */
    async clickChooseCoverage(): Promise<void> {
        logger.info('[GetQuotePage.clickChooseCoverage] Clicking choose coverage button');
        await this.chooseCoverageButton.isEnabled();
        await this.page.waitForTimeout(timeouts.polling);
        await this.chooseCoverageButton.click();
        await this.chooseCoverageButton.waitForDisappear(timeouts.long);
    }

    /**
     * Convenience method to fill a new quote form with default data and optional overrides
     * @param quoteData - Optional partial data to override defaults
     * @returns Promise that resolves when form is successfully filled
     */
    async fillGetQuote(quoteData?: Partial<GetQuoteData>): Promise<void> {
        await this.fillQuoteForm(quoteData, 'create');
    }

    /**
     * Convenience method to update an existing quote form with specific field changes
     * @param quoteData - Partial data containing only the fields to update, edits zipCode field if provided
     * @returns Promise that resolves when form is successfully updated
     */
    async updateGetQuote(quoteData?: Partial<GetQuoteData>): Promise<void> {
        await this.fillQuoteForm(quoteData, 'update');
    }

    /**
     * Adds a pet to the quote by filling the quote form with the provided data.
     * @param quoteData - Optional partial quote data containing pet information to be added, skips zipCode field
     * @returns A promise that resolves when the pet has been successfully added to the quote
     */
    async addAPetGetQuote(quoteData?: Partial<GetQuoteData>): Promise<void> {
        await expect(this.zipCodeTextBox.getLocator()).toBeDisabled();
        await this.fillQuoteForm(quoteData, 'addAPet');
    }
}