import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Iframe } from '@controls/iframe';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { RadioButton } from '@controls/radio-button';
import { TextBox } from '@controls/textbox';
import { getDefaultStepThreeDataWithCreditCard, StepThreeData } from '@data/quote/step-three-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';


export class StepThreePage extends BasePage {
    // Customer Information
    firstNameTextBox = new TextBox(this.page, '#customerInfoFirstName');
    lastNameTextBox = new TextBox(this.page, '#customerInfoLastName');
    streetAddressTextBox = new TextBox(this.page, '#customerInfoAddress1');
    streetAddress2TextBox = new TextBox(this.page, '#customerInfoAddress2');
    cityTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'City', exact: true }));
    stateTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'State', exact: true }));
    zipCodeTextBox = new TextBox(this.page, '#customerInfoPostalCode');
    phoneNumberTextBox = new TextBox(this.page, '#customerInfoPhone');
    emailTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Email Address*' }));

    // Pet and Plan Edit Options
    editPetButton = new Button(this.page, "//a[@aria-label='Edit Pet']");
    editPetDetailsLink = new Link(this.page, this.page.getByRole('button', { name: 'Edit Pet', exact: true }));
    editPlanSummaryButton = new Button(this.page, this.page.locator('div').filter({ hasText: /^Plan SummaryEdit$/ }).getByRole('button'));
    editAnnualPlanLink = new Link(this.page, this.page.getByRole('link', { name: 'Edit', exact: true }));
    editPreventiveAddOnButton = new Button(this.page, this.page.locator('div').filter({ hasText: /^Preventive Add OnEdit$/ }).getByRole('button'));
    addAnotherPetButton = new Button(this.page, this.page.getByRole('button', { name: 'ADD ANOTHER PET' }));
    noStayButton = new Button(this.page, this.page.getByRole('button', { name: 'No, Stay' }));
    yesLeaveButton = new Button(this.page, this.page.getByRole('button', { name: 'Yes, Leave' }));

    // Billing Cycle section for Prop 103 flow
    billingCycleLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Billing Cycle', exact: true }));
    monthlyBillingCycleButton = new RadioButton(this.page, 'input[data-testid="monthly-billing-cycle-option"]');
    annuallyBillingCycleButton = new RadioButton(this.page, 'input[data-testid="annual-billing-cycle-option"]');

    // Delete Pet confirmation dialog
    confirmDeletePetButton = new Button(this.page, this.page.getByRole('button', { name: 'Yes, Remove Pet' }));
    cancelDeletePetButton = new Button(this.page, this.page.getByRole('button', { name: 'Keep Pet' }));

    // Payment Method Selection
    paymentIframe = new Iframe(this.page, 'iframe[title="Secure payment input frame"]:not([aria-hidden="true"])');
    creditCardButton = new Button(this.page, this.paymentIframe.getFrame().locator("#card-tab"));
    bankWithdrawalButton = new Button(this.page, this.page.getByText(/^Bank Withdrawal|Retrait bancaire$/));

    // Credit Card Payment (iframe)
    cardholderNameTextBox = new TextBox(this.page, this.paymentIframe.getFrame().getByRole('textbox', { name: 'Cardholder Name' }));
    cardNumberTextBox = new TextBox(this.page, this.paymentIframe.getFrame().locator("#payment-numberInput"));
    expiryDateTextBox = new TextBox(this.page, this.paymentIframe.getFrame().locator("#payment-expiryInput"));
    cvvTextBox = new TextBox(this.page, this.paymentIframe.getFrame().locator("#payment-cvcInput"));
    postalCodeTextBox = new TextBox(this.page, this.paymentIframe.getFrame().locator("#payment-postalCodeInput"));
    cancelPaymentButton = new Button(this.page, this.paymentIframe.getFrame().getByRole('link', { name: 'Cancel' }));
    submitPaymentButton = new Button(this.page, this.paymentIframe.getFrame().getByRole('button', { name: 'Submit' }));

    // Bank Account Payment (non-iframe, regular page elements)
    accountNumberTextBox = new TextBox(this.page, "#accountNumber");
    bankNumberTextBox = new TextBox(this.page, "#bankNumber");
    transitNumberTextBox = new TextBox(this.page, "#transitNumber");
    accountHolderNameTextBox = new TextBox(this.page, "#accountHolderName");

    // Different billing iframe
    useDifferentBillingCheckBox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'Use different billing address' }));
    diffBillingIframe = new Iframe(this.page, "//div[@id='address-element']/div/iframe[not (@tabindex)]");
    differentFirstNameTextBox = this.diffBillingIframe.textBox('#Field-firstNameInput');
    differentLastNameTextBox = this.diffBillingIframe.textBox('#Field-lastNameInput');
    differentAddressTextBox = this.diffBillingIframe.textBox('#Field-addressLine1Input');

    // Terms and Conditions
    applicationAcknowledgementsCheckbox = new Checkbox(this.page, "#agreementTermsControl");
    paymentAndRenewalTermsCheckbox = new Checkbox(this.page, "#paymentAndRenewalTermsControl");
    paperlessReceivePolicyCheckbox = new Checkbox(this.page, "#goGreenControl");
    termsAndConditionsCheckbox = new Checkbox(this.page, '#agreementTermsControl');
    goPaperlessCheckbox = new Checkbox(this.page, '#goGreenControl');
    agreePaymentAndRenewalsCheckbox = new Checkbox(this.page, '#paymentAndRenewalTermsControl');

    // Footer
    backButton = new Button(this.page, this.page.getByRole('button', { name: 'Back' }));
    enrollNowButton = new Button(this.page, this.page.getByRole('button', { name: /Enroll Now|Purchase/ }));

    // Total Due Card - Coverage line items
    thirtyDayCoverageAmountLabel = new Label(this.page, this.page.getByTestId('cfa-coverage-zero-value'));
    todayTotalFullTermCoverageAmountLabel = new Label(this.page, this.page.getByTestId('cfa-full-term-value=only-included-disc'));
    fullTermCoverageAmountLabel = new Label(this.page, this.page.locator(
        '[data-testid="cfa-full-term-coverage-included-discounts-value"], ' +
        '[data-testid="cfa-plus-full-term-coverage-included-discounts-value"], ' +
        '[data-testid="full-term-coverage-included-discounts-value"]'
    ).first());
    monthlyInstallmentFeeAmountLabel = new Label(this.page, this.page.getByTestId('quote-total-due-card-monthly-service-fee').first());

    // Total Due Card - Totals
    todayTotalAmountLabel = new Label(this.page, this.page.locator(
        '[data-testid="today-total-full-term-value"], ' +
        '[data-testid="today-total-zero-value"], ' +
        '[data-testid="today-total-cfa-plus-full-term-value"]'
    ));
    totalAfter30DaysAmountLabel = new Label(this.page, this.page.getByTestId('after-30-days-total-cfa-plus-full-term-value'));

    // Total Due Card - Calendar and billing schedule
    calendarDayLabel = new Label(this.page, this.page.locator(
        '[data-testid="date-calendar-template-todays-date"], ' +
        '[data-testid="date-calendar-template-31-days"]'
    ));
    paymentScheduleTextLabel = new Label(this.page, this.page.locator('.billing-section p.quote-summary-row'));

    // Total Due Card - In-text payment amounts
    todayChargeAmountInTextLabel = new Label(this.page, this.page.locator(
        '[data-testid="cfa-total-monthly-with-full-term-plus-service-fee-today"], ' +
        '[data-testid="quote-total-monthly-plus-service-fee-today"], ' +
        '[data-testid="full-term-pet-todays-total"], ' +
        '[data-testid="cfa-full-term-plus-30-day-total-due-card-todays-total"]'
    ));
    after30DaysChargeAmountInTextLabel = new Label(this.page, this.page.locator(
        '[data-testid="cfa-total-monthly-with-full-term-plus-service-fee-after30days"], ' +
        '[data-testid="quote-total-monthly-plus-service-fee-after"], ' +
        '[data-testid="full-term-pet-accounts-total"], ' +
        '[data-testid="cfa-full-term-plus-30-day-total-due-card-account-charge"]'
    ));
    paymentDayLabel = new Label(this.page, this.page.locator(
        '[data-testid="cfa-total-monthly-todays-date"], ' +
        '[data-testid="full-term-pet-todays-date"], ' +
        '[data-testid="cfa-full-term-plus-30-day-total-due-card-todays-date"]'
    ));

    // Add another Pet Pop-up
    addAnotherPetPopUpButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Another Pet' }));
    nevermindButton = new Button(this.page, this.page.getByRole('button', { name: 'Nevermind' }));

    /**
     * Fills out customer information section
     * @param customerData - Optional data object with customer fields
     */
    async fillCustomerInformation(customerData?: Partial<StepThreeData>): Promise<void> {
        logger.info('[StepThreePage.fillCustomerInformation] Filling customer information');
        const defaultData = getDefaultStepThreeDataWithCreditCard();
        const formData = { ...defaultData, ...customerData };

        if (formData.firstName) await this.firstNameTextBox.setText(formData.firstName);
        if (formData.lastName) await this.lastNameTextBox.setText(formData.lastName);
        if (formData.address) await this.streetAddressTextBox.setText(formData.address);
        if (formData.aptSuiteEtc) await this.streetAddress2TextBox.setText(formData.aptSuiteEtc);
        if (formData.phoneNumber) await this.phoneNumberTextBox.setText(formData.phoneNumber);

        logger.info('[StepThreePage.fillCustomerInformation] Customer information filled successfully');
    }

    /**
     * Fills credit card payment information (iframe fields)
     * @param paymentData - Optional data object with credit card fields
     */
    async fillCreditCardPayment(paymentData?: Partial<StepThreeData>): Promise<void> {
        logger.info('[StepThreePage.fillCreditCardPayment] Filling credit card payment');
        const defaultData = getDefaultStepThreeDataWithCreditCard();
        const formData = { ...defaultData, ...paymentData };
        await this.page.waitForLoadState();

        if (formData.cardNumber) await this.cardNumberTextBox.setText(formData.cardNumber);
        if (formData.expiryDate) await this.expiryDateTextBox.setText(formData.expiryDate);
        if (formData.cvv) await this.cvvTextBox.setText(formData.cvv);

        logger.info('[StepThreePage.fillCreditCardPayment] Credit card payment filled successfully');
    }


    /**
     * Checks all required agreement checkboxes if they are displayed
     */
    async checkAgreementOptions(): Promise<void> {
        logger.info('[StepThreePage.checkAgreementOptions] Checking agreement options');
        const checkboxes = [
            this.applicationAcknowledgementsCheckbox,
            this.paymentAndRenewalTermsCheckbox,
            this.paperlessReceivePolicyCheckbox
        ];

        for (const checkbox of checkboxes) {
            if ((await checkbox.isDisplayed()) && !(await checkbox.isChecked())) {
                await checkbox.check();
            }
        }
        logger.info('[StepThreePage.checkAgreementOptions] All agreement options checked successfully');
    }

    /**
     * Fills the complete checkout form with customer info, payment (credit card), and agreements
     * @param formData - Optional data object with all form fields
     */
    async fillCheckoutFormWithCreditCard(formData?: Partial<StepThreeData>): Promise<void> {
        logger.info('[StepThreePage.fillCheckoutFormWithCreditCard] Filling complete checkout form with credit card');
        await this.fillCustomerInformation(formData);
        await this.fillCreditCardPayment(formData);
        await this.checkAgreementOptions();
        logger.info('[StepThreePage.fillCheckoutFormWithCreditCard] Complete checkout form filled successfully');
    }

    /**
     * Fills out the finalize plan form for a quote scenario (default behavior)
     * @param planData - Optional data object with form fields
     */
    async fillFinalizePlanForm(planData?: Partial<StepThreeData>): Promise<void> {
        logger.info('[StepThreePage.fillFinalizePlanForm] - Filling finalize plan form for quote scenario');
        await this.fillFinalizePlanFormInternal('quote', planData);
    }

    /**
     * Fills out the finalize plan form for a mcleadPay scenario (starts with card number)
     * @param planData - Optional data object with form fields
     */
    async fillFinalizePlanFormForMcleadPay(planData?: Partial<StepThreeData>): Promise<void> {
        logger.info('[StepThreePage.fillFinalizePlanFormForMcleadPay] - Filling finalize plan form for mcleadPay scenario');
        await this.fillFinalizePlanFormInternal('mcleadPay', planData);
    }

    /**
     * Fills out the finalize plan form for a mcleadFree scenario (only checks agreement options)
     * @param planData - Optional data object with form fields
     */
    async fillFinalizePlanFormForMcleadFree(planData?: Partial<StepThreeData>): Promise<void> {
        logger.info('[StepThreePage.fillFinalizePlanFormForMcleadFree] - Filling finalize plan form for mcleadFree scenario');
        await this.fillFinalizePlanFormInternal('mcleadFree', planData);
    }

    /**
     * Private method to fill the finalize plan form based on scenario
     * @param scenario - 'quote' | 'mcleadPay' | 'mcleadFree'
     * @param planData - Optional data object with form fields
     */
    private async fillFinalizePlanFormInternal(scenario: 'quote' | 'mcleadPay' | 'mcleadFree', planData?: Partial<StepThreeData>): Promise<void> {
        logger.info(`[StepThreePage.fillFinalizePlanFormInternal] - Filling finalize plan form for scenario: ${scenario}`);
        const defaultData = getDefaultStepThreeDataWithCreditCard();
        const formData = { ...defaultData, ...planData };

        if (scenario === 'quote') {
            // Fill customer information
            if (formData.firstName) await this.firstNameTextBox.setText(formData.firstName);
            if (formData.lastName) await this.lastNameTextBox.setText(formData.lastName);
            if (formData.address) await this.streetAddressTextBox.setText(formData.address);
            if (formData.aptSuiteEtc) await this.streetAddress2TextBox.setText(formData.aptSuiteEtc);
            if (formData.phoneNumber) await this.phoneNumberTextBox.setText(formData.phoneNumber);
        }

        if (scenario === 'quote' || scenario === 'mcleadPay') {
            // Fill billing information (Stripe iframe)
            if (formData.cardNumber && formData.expiryDate && formData.cvv) {
                await expect(this.postalCodeTextBox.getLocator()).toHaveValue(/^\d{5}$/);
                await this.cardNumberTextBox.setText(formData.cardNumber);
                await this.expiryDateTextBox.setText(formData.expiryDate);
                await this.cvvTextBox.setText(formData.cvv);
            }
        }

        // For all scenarios, check agreement options
        await this.checkAgreementOptionsInternal();
        logger.info(`[StepThreePage.fillFinalizePlanFormInternal] - Finalize plan form filled successfully for scenario: ${scenario}`);
    }

    /**
     * Checks all required agreement checkboxes if they are displayed (internal version for scenario-based forms)
     * @returns Promise that resolves when all checkboxes are checked
     */
    private async checkAgreementOptionsInternal(): Promise<void> {
        logger.info('[StepThreePage.checkAgreementOptionsInternal] Checking agreement options');
        const checkboxes = [
            this.termsAndConditionsCheckbox,
            this.goPaperlessCheckbox,
            this.agreePaymentAndRenewalsCheckbox
        ];

        for (const checkbox of checkboxes) {
            if ((await checkbox.isDisplayed()) && !(await checkbox.isChecked())) {
                await checkbox.check();
            }
        }
        logger.info('[StepThreePage.checkAgreementOptionsInternal] All agreement options checked successfully');
    }

    /**
    * Gets the policy summary card locator for a specific pet
    * @param petNameOrIndex - Pet name (e.g., "Python") or index (1 for first, 2 for second, etc.)
    * @returns Locator for the pet card
    */
    getPetCard(petNameOrIndex: string | number) {
        if (typeof petNameOrIndex === 'string') {
            return this.page.locator(`app-policy-summary-card:has(.pet-name:has-text("${petNameOrIndex}"))`);
        } else {
            return this.page.locator('app-policy-summary-card').nth(petNameOrIndex - 1);
        }
    }

    /**
     * Returns the locator for all pet policy summary cards currently in the cart
     */
    getPetCards() {
        return this.page.locator('app-policy-summary-card');
    }

    // 30-Day Plan Summary Section
    getEdit30DayPlanButton(petNameOrIndex: string | number) {
        return new Button(this.page, this.getPetCard(petNameOrIndex).getByTestId('edit-pet-link-30-day-plan'));
    }

    get30DayAnnualLimitLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('coverage-limit-value-30-day-plan'));
    }

    get30DayAnnualDeductibleLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('deductible-limit-value-30-day-plan'));
    }

    get30DayReimbursementLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('coinsurance-limit-value-30-day-plan'));
    }

    get30DayCoverageCostLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('30-day-coverage-cost-plan'));
    }

    get30DayTotalLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('30-day-coverage-total'));
    }

    // Annual Plan Summary Section
    getEditAnnualPlanButton(petNameOrIndex: string | number) {
        return new Button(this.page, this.getPetCard(petNameOrIndex).getByTestId('edit-pet-link-full-term-plan'));
    }

    getAnnualLimitLabel(petNameOrIndex: string | number) {
        const petCard = this.getPetCard(petNameOrIndex);
        return new Label(this.page, petCard.locator('[data-testid="coverage-limit-full-term-value"], [data-testid="coverage-limit-value"]'));
    }

    getAnnualDeductibleLabel(petNameOrIndex: string | number) {
        const petCard = this.getPetCard(petNameOrIndex);
        return new Label(this.page, petCard.locator('[data-testid="deductible-limit-full-term-value"], [data-testid="deductible-limit-value"]'));

    }

    getReimbursementLabel(petNameOrIndex: string | number) {
        const petCard = this.getPetCard(petNameOrIndex);
        return new Label(this.page, petCard.locator('[data-testid="coinsurance-limit-full-term-value"], [data-testid="coinsurance-limit-value"]'));
    }

    getAnnualReimbursementLabel(petNameOrIndex: string | number) {
        return this.getReimbursementLabel(petNameOrIndex);
    }

    getUpgradesCountLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('upgrades-count'));
    }

    getAnnualUpgradesLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).locator('app-upgrades-total-count'));
    }

    // Monthly Cost Breakdown Section
    getMonthlyPremiumLabel(petNameOrIndex: string | number) {
        const petCard = this.getPetCard(petNameOrIndex);
        return new Label(this.page, petCard.locator('[data-testid="monthly-premium-base-cost"], [data-testid="pet-base-premium-cost"]'));
    }

    getBasePlanLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('base-product-selected'));
    }

    getUpgradeCostLabel(petNameOrIndex: string | number, upgradeIndex: number) {
        const petCard = this.getPetCard(petNameOrIndex);
        return new Label(this.page, petCard.locator(
            `[data-testid="monthly-installment-${upgradeIndex}-cost"], ` +
            `[data-testid="upgrade-monthly-installment-cost-${upgradeIndex}"]`
        ));
    }

    getMonthlyTotalLabel(petNameOrIndex: string | number) {
        const petCard = this.getPetCard(petNameOrIndex);
        return new Label(this.page, petCard.locator('[data-testid="monthly-premium-total"]'));
    }

    /**
     * Returns the collapsible toggle button for a pet's policy summary card
     * @param petNameOrIndex - Pet name or index (1 for first, 2 for second, etc.)
     */
    getPetCardToggleButton(petNameOrIndex: string | number): Button {
        return new Button(this.page, this.getPetCard(petNameOrIndex).getByRole('button', { name: /Collapsible section/ }));
    }

    /**
     * Clicks the toggle button to expand/collapse a pet card
     * @param petNameOrIndex - Pet name or index (1 for first, 2 for second, etc.)
     */
    async clickPetCardToggle(petNameOrIndex: string | number): Promise<void> {
        logger.info(`[StepThreePage.clickPetCardToggle] Clicking toggle for pet: ${petNameOrIndex}`);
        await this.getPetCardToggleButton(petNameOrIndex).click();
    }

    /**
     * Returns the Delete Pet button on a given pet's policy summary card
     * @param petNameOrIndex - Pet name or index (1 for first, 2 for second, etc.)
     */
    getDeletePetButton(petNameOrIndex: string | number): Button {
        return new Button(this.page, this.getPetCard(petNameOrIndex).getByRole('button', { name: 'Delete Pet' }));
    }

    /**
     * Clicks Delete Pet on the given pet's card and confirms or cancels the removal in the confirmation dialog
     * @param petNameOrIndex - Pet name or index (1 for first, 2 for second, etc.)
     * @param confirm - true to confirm deletion (Yes), false to cancel (No)
     */
    async deletePet(petNameOrIndex: string | number, confirm: boolean): Promise<void> {
        logger.info(`[StepThreePage.deletePet] ${confirm ? 'Confirming' : 'Cancelling'} pet deletion for pet: ${petNameOrIndex}`);
        await this.getDeletePetButton(petNameOrIndex).click();
        confirm ? await this.confirmDeletePetButton.click() : await this.cancelDeletePetButton.click();
    }

    /**
     * Returns plan term detail values displayed on a pet's plan summary card: deductible, reimbursement, and annual limit.
     * The new UI's plan summary card does not surface a per-incident limit field.
     * @param petNameOrIndex - Pet name or index (1 for first, 2 for second, etc.)
     */
    async getTermDetails(petNameOrIndex: string | number): Promise<{ deductible: string; reimbursement: string; annual: string }> {
        logger.info(`[StepThreePage.getTermDetails] Getting term details for pet: ${petNameOrIndex}`);
        const deductible = await this.getAnnualDeductibleLabel(petNameOrIndex).getText();
        const reimbursement = await this.getReimbursementLabel(petNameOrIndex).getText();
        const annual = await this.getAnnualLimitLabel(petNameOrIndex).getText();
        return { deductible, reimbursement, annual };
    }


    getMonthlyCostBreakdownLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByRole('heading', { name: 'Monthly Cost Breakdown' }));
    }

    getAnnualCostBreakdownLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByRole('heading', { name: 'Annual Cost Breakdown' }));
    }

    // Annual Cost Breakdown Section
    getAnnualPremiumLabel(petNameOrIndex: string | number) {
        const petCard = this.getPetCard(petNameOrIndex);
        return new Label(this.page, petCard.locator('[data-testid="annual-premium-base-cost"], [data-testid="pet-annual-premium-cost"]'));
    }

}
