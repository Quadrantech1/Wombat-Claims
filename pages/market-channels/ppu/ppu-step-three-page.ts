import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Iframe } from '@controls/iframe';
import { Label } from '@controls/label';
import { TextBox } from '@controls/textbox';
import { getDefaultPpuStepThreeDataWithBankAccount, getDefaultPpuStepThreeDataWithCreditCard, StepThreeData } from '@data/quote/step-three-data';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { StepThreePage } from '../quote/step-three-page';

export class PpuStepThreePage extends StepThreePage {

    purchaseButton = new Button(this.page, this.page.getByRole('button', { name: /^Purchase|Souscrire$/ }));

    acknowledgeCheckbox = new Checkbox(this.page, '#agreementTermsControl');
    override goPaperlessCheckbox = new Checkbox(this.page, '#goGreenControl');

    // Override iframe selector for PPU
    override paymentIframe = new Iframe(this.page, 'iframe[id="monerisCheckout-Frame"]');

    // Credit Card Payment (iframe)
    override cardholderNameTextBox = new TextBox(this.page, this.paymentIframe.getFrame().getByRole('textbox', { name: 'Cardholder Name' }));
    override cardNumberTextBox = new TextBox(this.page, this.paymentIframe.getFrame().getByRole('textbox', { name: 'Card Number' }));
    override expiryDateTextBox = new TextBox(this.page, this.paymentIframe.getFrame().getByRole('textbox', { name: 'Expiry Date MMYY' }));
    override cvvTextBox = new TextBox(this.page, this.paymentIframe.getFrame().getByRole('textbox', { name: 'CVV' }));
    override cancelPaymentButton = new Button(this.page, this.paymentIframe.getFrame().getByRole('link', { name: 'Cancel' }));
    override submitPaymentButton = new Button(this.page, this.paymentIframe.getFrame().getByRole('button', { name: 'Submit' }));
    transactionApprovedLabel = new Label(this.page, this.page.getByText('Payment Verified! One Last'));
    transactionDeclinedLabel = new Label(this.page, this.paymentIframe.getFrame().getByRole('heading', { name: 'Transaction Declined' }));
    creditCardErrorLabel = new Label(this.page, this.page.getByText('Please submit the credit card information to continue'));
    tryAgainButton = new Button(this.page, this.page.getByRole('button', { name: 'Try Again' }));

    // Costco membership validation
    costcoMembershipNumberTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Costco Membership Number The' }));
    clickHereLink = new Label(this.page, this.page.getByText('click here', { exact: true }));
    validateButton = new Button(this.page, this.page.getByRole('button', { name: 'VALIDATE' }));
    partnerCodeValidLabel = new Label(this.page, '#partnerCode_valid');

    /**
     * Fills out customer information section
     * @param customerData - Optional data object with customer fields
     */
    override async fillCustomerInformation(customerData?: Partial<StepThreeData>): Promise<void> {
        logger.info('[PPU ThreePage.fillCustomerInformation] Filling customer information');
        const defaultData = getDefaultPpuStepThreeDataWithCreditCard();
        const formData = { ...defaultData, ...customerData };

        if (formData.firstName) await this.firstNameTextBox.setText(formData.firstName);
        if (formData.lastName) await this.lastNameTextBox.setText(formData.lastName);
        if (formData.address) await this.streetAddressTextBox.setText(formData.address);
        if (formData.aptSuiteEtc) await this.streetAddress2TextBox.setText(formData.aptSuiteEtc);
        if (formData.phoneNumber) await this.phoneNumberTextBox.setText(formData.phoneNumber);

        logger.info('[PPU StepThreePage.fillCustomerInformation] Customer information filled successfully');
    }

    /**
     * Fills credit card payment information (iframe fields)
     * @param paymentData - Optional data object with credit card fields
     */
    override async fillCreditCardPayment(paymentData?: Partial<StepThreeData>): Promise<void> {
        logger.info('[PPU StepThreePage.fillCreditCardPayment] Filling credit card payment');
        const defaultData = getDefaultPpuStepThreeDataWithCreditCard();
        const formData = { ...defaultData, ...paymentData };

        await this.cardholderNameTextBox.waitForVisible();

        if (formData.cardholderName) await this.cardholderNameTextBox.setText(formData.cardholderName);
        if (formData.cardNumber) await this.cardNumberTextBox.setText(formData.cardNumber);
        if (formData.expiryDate) await this.expiryDateTextBox.setText(formData.expiryDate);
        if (formData.cvv) await this.cvvTextBox.setText(formData.cvv);

        await this.submitPaymentButton.click();
        await expect(this.transactionApprovedLabel.getLocator()).toBeVisible();

        logger.info('[PPU StepThreePage.fillCreditCardPayment] Credit card payment filled successfully');
    }

    /**
     * Fills bank account payment information (non-iframe fields)
     * @param paymentData - Optional data object with bank account fields
     */
    async fillBankAccountPayment(paymentData?: Partial<StepThreeData>): Promise<void> {
        logger.info('[PPU StepThreePage.fillBankAccountPayment] Filling bank account payment');
        const defaultData = getDefaultPpuStepThreeDataWithBankAccount();
        const formData = { ...defaultData, ...paymentData };

        await this.bankWithdrawalButton.click();

        if (formData.accountNumber) await this.accountNumberTextBox.setText(formData.accountNumber);
        if (formData.bankNumber) await this.bankNumberTextBox.setText(formData.bankNumber);
        if (formData.transitNumber) await this.transitNumberTextBox.setText(formData.transitNumber);
        if (formData.accountHolderName) await this.accountHolderNameTextBox.setText(formData.accountHolderName);

        logger.info('[PPU StepThreePage.fillBankAccountPayment] Bank account payment filled successfully');
    }


    /**
     * Fills the complete checkout form with customer info, payment (bank account), and agreements
     * @param formData - Optional data object with all form fields
     */
    async fillCheckoutFormWithBankAccount(formData?: Partial<StepThreeData>): Promise<void> {
        logger.info('[PPU StepThreePage.fillCheckoutFormWithBankAccount] Filling complete checkout form with bank account');
        await this.fillCustomerInformation(formData);
        await this.fillBankAccountPayment(formData);
        await this.checkAgreementOptions();
        logger.info('[PPU StepThreePage.fillCheckoutFormWithBankAccount] Complete checkout form filled successfully');
    }

    override async checkAgreementOptions(): Promise<void> {
        logger.info('[PPU StepThreePage.checkAgreementOptions] Checking agreement options');
        const checkboxes = [
            this.acknowledgeCheckbox,
            this.goPaperlessCheckbox
        ];

        for (const checkbox of checkboxes) {
            if ((await checkbox.isDisplayed()) && !(await checkbox.isChecked())) {
                await checkbox.checkMobile();
            }
        }
        logger.info('[PPU StepThreePage.checkAgreementOptions] All agreement options checked successfully');
    }

    async verifyIfLabelIsDisplayed(value: string): Promise<boolean> {
        logger.info(`[PPU StepThreePage.verifyIfLabelIsDisplayed] Verifying if label is displayed for value: ${value}`);
        let label;
        if (value === 'Adresse municipale') {
            label = this.page.locator("//label[contains(text(), 'Adresse municipale') and not(contains(text(), '2'))]");
        } else {
            label = this.page.locator("//label[contains(text(), '" + value + "')]")
        }
        return await label.isVisible();
    }
    complimentaryFirstMonthLabel = new Label(this.page, this.page.locator('app-discounts').getByText('Complimentary First Month'));
    complimentaryFirstMonthAmountLabel = new Label(this.page, this.page.getByTestId('complimentary-first-month-value'));
    fullTermCoverageLabel = new Label(this.page, this.page.getByTestId('quote-total-full-term-coverage-included-discounts'));
    override fullTermCoverageAmountLabel = new Label(this.page, this.page.getByTestId('quote-total-full-term-coverage-included-discounts-value'));
    taxesLabel = new Label(this.page, this.page.getByText('Taxes').first());
    taxesAmountLabel = new Label(this.page, this.page.getByTestId('total-sales-tax-value'));
    nextPaymentLabel = new Label(this.page, this.page.getByText('Your next payment:'));
    nextPaymentAmountLabel = new Label(this.page, this.page.getByTestId('next-payment-total-value'));

    // Shared – visible in both layouts
    override todayTotalAmountLabel = new Label(this.page,
        this.page.getByTestId('today-total-first-month-free-value').or(this.page.getByTestId('today-total-full-term-value')));
    override paymentScheduleTextLabel = new Label(this.page, this.page.locator('.billing-section p.quote-summary-row'));
    override paymentDayLabel = new Label(this.page,
        this.page.getByTestId('todays-date-ppu-total-due-card').or(this.page.getByTestId('ppu-total-due-card-todays-date')));
    numberOfPetsLabel = new Label(this.page, this.page.getByTestId('ppu-total-due-card-pets-added'));
    scheduleChargeAmountLabel = new Label(this.page,
        this.page.getByTestId('ppu-total-due-card-total-value-with-first-month-free').or(this.page.getByTestId('ppu-total-due-card-total-value')));

    // PPU-specific Pet Card methods
    override getAnnualLimitLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('coverage-limit-value'));
    }

    override getAnnualDeductibleLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('deductible-limit-value'));
    }

    override getReimbursementLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('coinsurance-limit-value'));
    }

    getEditPlanButton(petNameOrIndex: string | number) {
        return new Button(this.page, this.getPetCard(petNameOrIndex).getByTestId('edit-annual-plan-btn-link'));
    }

    // Preventive Add On / Wellness Section for PPU
    getWellnessNameLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('wellness-display-name'));
    }

    getWellnessStatusLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('wellness-added'));
    }

    getEditWellnessButton(petNameOrIndex: string | number) {
        return new Button(this.page, this.getPetCard(petNameOrIndex).getByTestId('edit-wellness-btn-link'));
    }

    // PPU-specific Monthly Cost Breakdown methods
    override getMonthlyPremiumLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('pet-base-premium-cost'));
    }

    getWellnessCostLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('upgrade-monthly-installment-cost-0'));
    }

    getTaxesLabelForPet(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('monthly-taxes'));
    }

    override getMonthlyTotalLabel(petNameOrIndex: string | number) {
        return new Label(this.page, this.getPetCard(petNameOrIndex).getByTestId('monthly-premium-total'));
    }
}

