import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { RadioButton } from '@controls/radio-button';
import { ReactCombobox } from '@controls/react-combobox';
import { TextBox } from '@controls/textbox';
import { AspcaPetInfoData } from '@data/aspca/aspca-pet-info-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
export class AspcaPetInfoPage extends BasePage {

    // Header
    aspcaLogoLink = new Link(this.page, this.page.getByRole('link', { name: 'ASPCA Pet Health Insurance' }));
    callSupportLink = new Link(this.page, this.page.getByRole('link', { name: 'Call support at 1-888-716-' }));
    openNavMenuButton = new Button(this.page, this.page.getByRole('button', { name: 'Open navigation menu' }));
    fetchPreviousQuoteLink = new Link(this.page, this.page.getByRole('link', { name: 'Fetch a Previous Quote' }));
    faqsNavButton = new Button(this.page, this.page.getByRole('button', { name: 'FAQs' }));
    underwritingNavButton = new Button(this.page, this.page.getByRole('button', { name: 'Underwriting' }));

    // Form fields — all visible at once on /start
    petNameTextBox = new TextBox(this.page, this.page.getByLabel("Pet's Name*"));
    zipCodeTextBox = new TextBox(this.page, this.page.getByLabel('Zip Code*'));
    emailTextBox = new TextBox(this.page, this.page.getByLabel('Email Address*'));

    // Species & gender — custom label-click pattern (native radio is sr-only)
    private dogLabel = new Label(this.page, 'label[for$="-dog"]');
    private catLabel = new Label(this.page, 'label[for$="-cat"]');
    private maleLabel = this.page.locator('label[for$="-male"]');
    private femaleLabel = this.page.locator('label[for$="-female"]');

    // CTA
    seeMyRatesButton = new Button(this.page, this.page.getByRole('button', { name: 'See My Rates' }));
    // Stepper view (view=stepper) per-page advance CTA — same accessible name recurs on pages 2-7
    continueButton = new Button(this.page, this.page.getByRole('button', { name: 'Continue' }));

    // Breed combobox — ARIA combobox with an embedded typeahead search input
    breedComboboxLabel = new ReactCombobox(this.page, this.page.getByRole('combobox', { name: "Pet's Breed*" }));

    // Species/gender radio inputs — used for toBeChecked() assertions
    catRadioInput = new RadioButton(this.page, this.page.locator('input[value="cat"]'));
    femaleRadioInput = new RadioButton(this.page, this.page.locator('input[value="female"]'));
    dogRadioInput = new RadioButton(this.page, this.page.locator('input[value="dog"]'));
    maleRadioInput = new RadioButton(this.page, this.page.locator('input[value="male"]'));

    // Age combobox — ARIA combobox, static option list (no embedded search input)
    ageComboboxLabel = new ReactCombobox(this.page, this.page.getByRole('combobox', { name: "Pet's Age*" }));
    enrollmentGateMessage = new Label(this.page, this.page.getByText('Enrollment begins at 8 weeks'));

    // Progress stepper (sr-only status)
    stepperProgressLabel = new Label(this.page, this.page.locator('[role="status"].sr-only'));

    // Informational labels
    // Note: heading uses a curly apostrophe (U+2019) on the live site — use regex to avoid character mismatch
    quoteHeadingLabel = new Label(this.page, this.page.getByText(/Let.s get started/));
    amazonGiftCardPromoLabel = new Label(this.page, this.page.getByText('$25 Amazon gift card!'));

    /**
     * Selects the Dog species option via its wrapping label.
     */
    async selectDog(): Promise<void> {
        logger.info('[AspcaPetInfoPage.selectDog] - Selecting Dog species');
        await this.dogLabel.waitForVisible();
        await this.dogLabel.click();
    }

    /**
     * Selects the Cat species option via its wrapping label.
     */
    async selectCat(): Promise<void> {
        logger.info('[AspcaPetInfoPage.selectCat] - Selecting Cat species');
        await this.catLabel.waitForVisible();
        await this.catLabel.click();
    }

    /**
     * Selects the Male gender option via its wrapping label.
     */
    async selectMale(): Promise<void> {
        logger.info('[AspcaPetInfoPage.selectMale] - Selecting Male gender');
        await this.maleLabel.click();
    }

    /**
     * Selects the Female gender option via its wrapping label.
     */
    async selectFemale(): Promise<void> {
        logger.info('[AspcaPetInfoPage.selectFemale] - Selecting Female gender');
        await this.femaleLabel.click();
    }

    /**
     * Opens the Pet's Age combobox and selects the given option by exact text.
     * @param option - Age option text (e.g. '2 years', 'Under 8 weeks', '20 years')
     */
    async selectAge(option: string): Promise<void> {
        logger.info(`[AspcaPetInfoPage.selectAge] - Selecting age: ${option}`);
        await this.ageComboboxLabel.select(option);
    }

    /**
     * Opens the Pet's Breed combobox and selects the given breed by exact option name.
     * @param breedName - Exact breed name to select (e.g. 'Labrador Retriever')
     */
    async selectBreed(breedName: string): Promise<void> {
        logger.info(`[AspcaPetInfoPage.selectBreed] - Selecting breed: ${breedName}`);
        await this.breedComboboxLabel.waitForVisible();
        await this.breedComboboxLabel.selectByTyping(breedName);
        await expect(this.breedComboboxLabel.getLocator()).toContainText(breedName);
        logger.info(`[AspcaPetInfoPage.selectBreed] - Breed selected: ${breedName}`);
    }

    /**
     * Fills the entire Pet Info form with the provided data and clicks "See My Rates".
     * @param data - Pet info form data
     */
    async completePetInfoScroller(data: AspcaPetInfoData): Promise<void> {
        logger.info(`[AspcaPetInfoPage.completePetInfoScroller] - Filling pet info form for: ${JSON.stringify(data)}`);
        await this.petNameTextBox.setText(data.petName);
        data.petType === 'dog' ? await this.selectDog() : await this.selectCat();
        data.gender === 'male' ? await this.selectMale() : await this.selectFemale();
        await this.selectAge(data.age);
        await this.zipCodeTextBox.setTextAndTab(data.zipCode);
        await this.selectBreed(data.breed);
        await this.emailTextBox.setTextAndTab(data.email);
        // Wait for form async validation to complete — button must be enabled before proceeding
        // Note: the button can use native disabled OR aria-disabled depending on form state
        await expect(this.seeMyRatesButton.getLocator()).toBeEnabled();
        await expect(this.seeMyRatesButton.getLocator()).not.toHaveAttribute('aria-disabled', 'true');
        logger.info('[AspcaPetInfoPage.completePetInfoScroller] - Pet info form filled');
    }

    /**
     * Completes the stepper Pet Info flow and lands on the Coverage page.
     * Additional pets reuse the quote ZIP and skip the ZIP step.
     * @param data - Pet info form data
     * @param isAdditionalPet - Whether this is an added pet whose quote ZIP is already set
     */
    async completePetInfoStepper(data: AspcaPetInfoData, isAdditionalPet = false): Promise<void> {
        logger.info(`[AspcaPetInfoPage.completePetInfoStepper] - Completing stepper flow for: ${JSON.stringify(data)}`);
        await this.petNameTextBox.getLocator().waitFor({ state: 'visible', timeout: timeouts.veryLong });
        await this.petNameTextBox.setText(data.petName);
        await this.clickSeeMyRates();
        data.petType === 'dog' ? await this.selectDog() : await this.selectCat();
        await this.continueButton.click();
        data.gender === 'male' ? await this.selectMale() : await this.selectFemale();
        await this.continueButton.click();
        await this.selectAge(data.age);
        await this.continueButton.click();
        if (!isAdditionalPet) {
            await this.zipCodeTextBox.setTextAndTab(data.zipCode);
            await this.continueButton.clickAndWait();
        }
        await this.selectBreed(data.breed);
        await this.continueButton.click();
        await this.emailTextBox.setTextAndTab(data.email);
        await this.continueButton.click();
        logger.info('[AspcaPetInfoPage.completePetInfoStepper] - Stepper flow completed, landed on Coverage page');
    }

    /**
     * Clicks "See My Rates" and waits for the species-selection screen.
     */
    async clickSeeMyRates(): Promise<void> {
        logger.info('[AspcaPetInfoPage.clickSeeMyRates] - Clicking See My Rates');
        await expect(this.seeMyRatesButton.getLocator()).not.toHaveAttribute('aria-disabled', 'true');
        await this.seeMyRatesButton.click();
        await expect(this.dogLabel.getLocator()).toBeVisible();
    }

}
