import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Iframe } from '@controls/iframe';
import { Label } from '@controls/label';
import { RadioButton } from '@controls/radio-button';
import { ReactCombobox } from '@controls/react-combobox';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { AspcaCheckoutData, getDefaultAspcaCheckoutData } from '@data/aspca/aspca-checkout-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class AspcaCheckoutPage extends BasePage {

    // Progress stepper
    coverageStepButton = new Button(this.page, this.page.getByRole('button', { name: 'Coverage - Completed step' }));

    // Your Info — personal details
    firstNameTextBox = new TextBox(this.page, this.page.getByTestId('checkout-first-name-input'));
    lastNameTextBox = new TextBox(this.page, this.page.getByTestId('checkout-last-name-input'));
    phoneNumberTextBox = new TextBox(this.page, this.page.getByTestId('checkout-phone-number-input'));
    personalInfoContinueButton = new Button(this.page, this.page.getByTestId('checkout-continue-button-personal-info'));

    // Address
    addressTextBox = new TextBox(this.page, this.page.getByTestId('checkout-address-input'));
    aptSuiteTextBox = new TextBox(this.page, this.page.getByTestId('checkout-apt-suite-input'));
    cityTextBox = new TextBox(this.page, this.page.getByTestId('checkout-city-input'));
    addressContinueButton = new Button(this.page, this.page.getByTestId('checkout-continue-button-address'));
    howDidYouHearSelect = new ReactCombobox(this.page, this.page.getByRole('combobox', { name: 'How did you find out about us?' }));
    private checkoutFormRegion = new Label(this.page, this.page.getByRole('region', { name: /Let.s finish up with some/i }));

    // Billing cycle
    monthlyRadio = new RadioButton(this.page, this.page.getByRole('radio', { name: /Monthly/ }));
    annuallyRadio = new RadioButton(this.page, this.page.getByRole('radio', { name: /Annually/ }));
    monthlyBillingLabel = new Label(this.page, this.page.locator('label[for$="-monthly"]'));
    annualBillingLabel = new Label(this.page, this.page.locator('label[for$="-annually"]'));
    installmentFeeNote = new Label(this.page, this.page.getByText('$2 per month installment fee applies to monthly payments'));
    annualSavingsNote = new Label(this.page, this.page.getByText('Save $24/year with annual billing'));

    // Stripe renders a same-title easel iframe alongside the interactive payment frame.
    private stripeIframe = new Iframe(this.page, 'iframe[title="Secure payment input frame"][allow*="publickey-credentials-get"]');
    cardNumberTextBox = new TextBox(this.page, this.stripeIframe.getFrame().getByRole('textbox', { name: 'Card number' }));
    expiryDateTextBox = new TextBox(this.page, this.stripeIframe.getFrame().getByRole('textbox', { name: 'Expiration date' }));
    cvcTextBox = new TextBox(this.page, this.stripeIframe.getFrame().getByRole('textbox', { name: 'Security code' }));
    billingZipTextBox = new TextBox(this.page, this.stripeIframe.getFrame().getByRole('textbox', { name: 'ZIP code' }));
    countrySelect = new Select(this.page, this.stripeIframe.getFrame().getByRole('combobox', { name: 'Country' }));

    // Policy summary
    policySummarySection = new Label(this.page, this.page.getByRole('region', { name: 'Your Info' }));
    policySummaryHeading = new Label(this.page, this.page.getByRole('heading', { name: 'Policy Summary' }));
    todaysTotalLabel = new Label(this.page, this.page.getByText(/Total.*Pet.*\$/));
    totalDueSummaryRegion = new Label(this.page, this.page.getByRole('region', { name: 'Total due summary' }));
    paymentScheduleLabel = new Label(this.page, this.page.getByText(/^Today you will be charged/));

    // Terms & Conditions checkboxes
    policyTermsCheckbox = new Checkbox(this.page, this.page.locator('#policy-terms-acceptance'));
    private policyTermsLabel = new Label(this.page, this.page.locator("//label[@for='policy-terms-acceptance']//img[contains(@class,'checkbox-unchecked-icon')]"));
    paperlessConsentCheckbox = new Checkbox(this.page, this.page.locator('#authorizationText-consent'));

    // Purchase CTA
    purchaseButton = new Button(this.page, this.page.getByTestId('purchase-button-billing-info'));
    oneMoreStepButton = new Button(this.page, this.page.getByRole('button', { name: /One More Step/i }));

    // Page headings
    letsFinishUpHeading = new Label(this.page, this.page.getByRole('heading', { name: /Let.s finish up/i }));

    // Stepper progress (sr-only label)
    stepperProgressLabel = new Label(this.page, this.page.locator('[role="status"].sr-only'));

    // Zip Code (read-only, pre-populated from Pet Info)
    zipCodeLabel = new Label(this.page, this.page.getByLabel('Zip Code*'));

    // Policy summary plan details
    annualLimitLabel = new Label(this.page, this.page.getByText('$5,000'));
    deductibleLabel = new Label(this.page, this.page.getByText('$500'));
    valuePlanAnnualLimitLabel = new Label(this.page, this.page.getByText('$2,500'));
    highCoveragePlanAnnualLimitLabel = new Label(this.page, this.page.getByText('$10,000'));

    // Loading overlay
    loadingOverlay = new Label(this.page, this.page.locator('#global-loader-overlay'));

    // Add a pet
    addPetCtaButton = new Button(this.page, this.page.getByTestId('checkout-add-pet-cta'));

    // Add-pet modal form
    addPetNameTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: "Pet's Name*" }));
    private addPetDogLabel = this.page.getByText('Dog', { exact: true });
    private addPetMaleLabel = this.page.locator('label').filter({ hasText: /^Male$/ });
    addPetAgeCombobox = new ReactCombobox(this.page, this.page.getByRole('combobox', { name: "Pet's Age*" }));
    addPetBreedCombobox = new ReactCombobox(this.page, this.page.getByRole('combobox', { name: "Pet's Breed*" }));
    saveAndContinueButton = new Button(this.page, this.page.getByRole('button', { name: 'Save & Continue' }));

    // Edit-pet flow
    editPetDetailsButton = new Button(this.page, this.page.getByRole('button', { name: 'Edit Pet Details' }).first());
    private editPetForm = this.page.getByLabel('Edit Pet', { exact: true });
    editPetBreedCombobox = new ReactCombobox(this.page, this.page.getByRole('combobox', { name: "Pet's Breed*" }));

    /**
     * Selects Dog species in the add-pet modal.
     */
    async selectDogInAddPetModal(): Promise<void> {
        logger.info('[AspcaCheckoutPage.selectDogInAddPetModal] - Selecting Dog species');
        await this.addPetDogLabel.click();
    }

    /**
     * Selects Male gender in the add-pet modal.
     */
    async selectMaleInAddPetModal(): Promise<void> {
        logger.info('[AspcaCheckoutPage.selectMaleInAddPetModal] - Selecting Male gender');
        await this.addPetMaleLabel.click();
    }

    /**
     * Selects Cat species inside the edit-pet form.
     */
    async selectCatInEditForm(): Promise<void> {
        logger.info('[AspcaCheckoutPage.selectCatInEditForm] - Selecting Cat species in edit pet form');
        await this.editPetForm.getByText('Cat', { exact: true }).click();
    }

    /**
     * Clicks the Edit button for a specific pet by name in the checkout summary.
     * @param petName - The pet name label shown in the checkout summary
     */
    async clickEditForPet(petName: string): Promise<void> {
        logger.info(`[AspcaCheckoutPage.clickEditForPet] - Clicking Edit for pet: ${petName}`);
        await this.page.getByLabel(petName).getByRole('button', { name: 'Edit' }).click();
    }

    /**
     * Returns a Label scoped to the pet name shown in the policy summary.
     * @param petName - The pet name as entered in the Pet Info form
     */
    getPetSummaryLabel(petName: string): Label {
        return new Label(this.page, this.page.getByText(petName, { exact: false }));
    }

    /**
     * Fills the personal info stage in the checkout sequence.
     * @param data - Checkout data
     */
    async fillPersonalInfo(data: Partial<AspcaCheckoutData> = {}): Promise<void> {
        logger.info('[AspcaCheckoutPage.fillPersonalInfo] - Filling personal info');
        const formData = { ...getDefaultAspcaCheckoutData(), ...data };
        if (formData.firstName) await this.firstNameTextBox.setText(formData.firstName);
        if (formData.lastName) await this.lastNameTextBox.setText(formData.lastName);
        if (formData.phoneNumber) await this.phoneNumberTextBox.setText(formData.phoneNumber);
        logger.info('[AspcaCheckoutPage.fillPersonalInfo] - Personal info filled');
    }

    /**
     * Fills the address stage in the checkout sequence.
     * @param data - Checkout data
     */
    async fillAddress(data: Partial<AspcaCheckoutData> = {}): Promise<void> {
        logger.info('[AspcaCheckoutPage.fillAddress] - Filling address');
        const formData = { ...getDefaultAspcaCheckoutData(), ...data };
        if (formData.address) await this.addressTextBox.setTextAndTab(formData.address);
        if (formData.aptSuite) await this.aptSuiteTextBox.setTextAndTab(formData.aptSuite);
        if (formData.city) await this.cityTextBox.setTextAndTab(formData.city);
        logger.info('[AspcaCheckoutPage.fillAddress] - Address filled');
    }

    /**
     * Fills the "Your Info" section of the checkout form.
     * @param data - Checkout data
     */
    async fillYourInfo(data: Partial<AspcaCheckoutData> = {}): Promise<void> {
        logger.info('[AspcaCheckoutPage.fillYourInfo] - Filling Your Info section');
        await this.fillPersonalInfo(data);
        await this.commitHowDidYouHearSelection();
        await this.continuePersonalInfo();
        await this.fillAddress(data);
        logger.info('[AspcaCheckoutPage.fillYourInfo] - Your Info section filled');
    }

    /**
    * Selects the named referral option so the progressive personal-info form can validate.
     */
    async commitHowDidYouHearSelection(): Promise<void> {
        logger.info('[AspcaCheckoutPage.commitHowDidYouHearSelection] - Selecting referral option: Friend/Relative Referral');
        await this.howDidYouHearSelect.select('Friend/Relative Referral');
    }

    /**
     * Selects the billing cycle.
     * @param cycle - 'monthly' or 'annually'
     *
     * Note: the billing cycle radios are visually styled cards. The native radio input
     * is sr-only and a sibling div intercepts pointer events, so we must click the
     * wrapping label element rather than the radio input directly.
     */
    async selectBillingCycle(cycle: 'monthly' | 'annually'): Promise<void> {
        logger.info(`[AspcaCheckoutPage.selectBillingCycle] - Selecting billing cycle: ${cycle}`);
        if (cycle === 'monthly') {
            await this.monthlyBillingLabel.click();
        } else {
            await this.annualBillingLabel.click();
        }
    }

    async selectBillingOption(cycle: 'monthly' | 'annually', keyboard = false): Promise<void> {
        await this.selectBillingCycle(cycle);
        if (keyboard) await this.moveToOtherBillingCycleWithKeyboard(cycle);
    }

    getBillingCycleRadio(cycle: 'monthly' | 'annually'): RadioButton {
        return cycle === 'monthly' ? this.monthlyRadio : this.annuallyRadio;
    }

    getOtherBillingCycleRadio(cycle: 'monthly' | 'annually'): RadioButton {
        return cycle === 'monthly' ? this.annuallyRadio : this.monthlyRadio;
    }

    getBillingCycleLabel(cycle: 'monthly' | 'annually'): Label {
        return cycle === 'monthly' ? this.monthlyBillingLabel : this.annualBillingLabel;
    }

    getBillingCycleHelperNote(cycle: 'monthly' | 'annually'): Label {
        return cycle === 'monthly' ? this.installmentFeeNote : this.annualSavingsNote;
    }

    async moveToOtherBillingCycleWithKeyboard(cycle: 'monthly' | 'annually'): Promise<void> {
        await this.getBillingCycleRadio(cycle).getLocator().press(cycle === 'monthly' ? 'ArrowRight' : 'ArrowLeft');
    }

    /**
     * Continues from the personal-info stage to the address stage.
     */
    async continuePersonalInfo(): Promise<void> {
        logger.info('[AspcaCheckoutPage.continuePersonalInfo] - Continuing from personal info');
        await this.personalInfoContinueButton.click();
        await this.addressTextBox.waitForVisible();
    }

    /**
     * Continues from the address stage to the billing-cycle stage.
     */
    async continueAddress(): Promise<void> {
        logger.info('[AspcaCheckoutPage.continueAddress] - Continuing from address');
        await this.addressContinueButton.click();
        await this.monthlyRadio.waitForVisible();
    }

    /**
     * Advances from the billing cycle stage to the Stripe step.
     */
    async clickOneMoreStep(): Promise<void> {
        logger.info('[AspcaCheckoutPage.clickOneMoreStep] - Clicking one more step');
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.oneMoreStepButton.getLocator().evaluate((element: HTMLElement) => {
            element.scrollIntoView({ block: 'end', inline: 'nearest' });
        });
        await this.oneMoreStepButton.click();
    }

    /**
     * Waits for the Stripe card inputs to be ready inside the visible secure payment iframe —
     * waiting only for the iframe element is not enough; Stripe's card element
     * needs additional time to initialize its internal event handlers after mount.
     */
    async waitForStripeInputsReady(): Promise<void> {
        logger.info('[AspcaCheckoutPage.waitForStripeInputsReady] - Waiting for Stripe card inputs');
        await this.cardNumberTextBox.getLocator().waitFor({ state: 'visible', timeout: timeouts.veryLong });
        await this.expiryDateTextBox.getLocator().waitFor({ state: 'visible', timeout: timeouts.veryLong });
        await this.cvcTextBox.getLocator().waitFor({ state: 'visible', timeout: timeouts.veryLong });
        await this.billingZipTextBox.getLocator().waitFor({ state: 'visible', timeout: timeouts.veryLong });
    }

    /**
     * Completes the billing selection and advances to the Stripe step.
     * @param data - Checkout data containing the selected billing cycle and payment details
     */
    async completeBillingStep(data: Partial<AspcaCheckoutData> = {}): Promise<void> {
        logger.info('[AspcaCheckoutPage.completeBillingStep] - Completing basic billing flow');
        const formData = { ...getDefaultAspcaCheckoutData(), ...data };
        await this.selectBillingCycle(formData.billingCycle ?? 'monthly');
        await this.clickOneMoreStep();
        await this.waitForStripeInputsReady();
        await this.fillCardPaymentDetails(formData);
    }

    /**
     * Fills the Stripe card payment fields inside the secure payment iframe.
     * @param data - Checkout data containing card details
     */
    async fillCardPaymentDetails(data: Partial<AspcaCheckoutData> = {}): Promise<void> {
        logger.info('[AspcaCheckoutPage.fillCardPaymentDetails] - Filling Stripe card payment details');
        const formData = { ...getDefaultAspcaCheckoutData(), ...data };
        await this.waitForStripeInputsReady();
        if (formData.cardNumber) await this.cardNumberTextBox.setText(formData.cardNumber);
        if (formData.expiryDate) await this.expiryDateTextBox.setText(formData.expiryDate);
        if (formData.cvc) await this.cvcTextBox.setText(formData.cvc);
        await this.countrySelect.selectOption('US');
        if (formData.billingZip) await this.billingZipTextBox.setText(formData.billingZip);
        logger.info('[AspcaCheckoutPage.fillCardPaymentDetails] - Stripe card payment details filled');
    }

    /**
     * Checks the policy terms checkbox.
     * Clicks the associated visible label so the test exercises the same user-facing control.
     */
    async checkPolicyTerms(): Promise<void> {
        logger.info('[AspcaCheckoutPage.checkPolicyTerms] - Checking policy terms checkbox');
        await this.policyTermsLabel.click();
        await expect(this.policyTermsCheckbox.getLocator()).toBeChecked();
        logger.info('[AspcaCheckoutPage.checkPolicyTerms] - Policy terms checkbox checked');
    }

    /**
     * Accepts the terms and submits the purchase.
     */
    async acceptTermsAndPurchase(): Promise<void> {
        logger.info('[AspcaCheckoutPage.acceptTermsAndPurchase] - Accepting terms and submitting purchase');
        await this.checkPolicyTerms();
        await this.purchaseButton.click();
        logger.info('[AspcaCheckoutPage.acceptTermsAndPurchase] - Purchase submitted');
    }

    /**
     * Completes the entire checkout form and clicks Purchase.
     * @param data - Checkout data (defaults applied if not provided)
     */
    async completeCheckout(data: Partial<AspcaCheckoutData> = {}): Promise<void> {
        logger.info('[AspcaCheckoutPage.completeCheckout] - Completing checkout form');
        const formData = { ...getDefaultAspcaCheckoutData(), ...data };

        await this.commitHowDidYouHearSelection();
        await this.fillPersonalInfo(formData);
        await this.continuePersonalInfo();
        await this.fillAddress(formData);
        await this.continueAddress();

        await this.completeBillingStep(formData);
        await this.acceptTermsAndPurchase();
        logger.info('[AspcaCheckoutPage.completeCheckout] - Purchase submitted');
    }
}
