import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Iframe } from '@controls/iframe';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { TextBox } from '@controls/textbox';
import { FelixFinalizePlanData, getDefaultFelixFinalizePlanData } from '@data/felix/felix-finalize-plan-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';

export class FinalizePlanPage extends BasePage {
    // Customer Information
    firstNameTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'First name*' }));
    lastNameTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'customer lastName' }));
    streetAddressTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Street address*' }));
    streetAddress2TextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'address two' }));
    phoneNumberTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Phone number*' }));
    postalCodeCustomerTextBox = new TextBox(this.page, this.page.locator('//input[@id="customerInfoPostalCode"]'));
    cityLabel = new TextBox(this.page, this.page.getByRole('textbox', { name: 'City*' }));
    emailLabel = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Email Address*' }));
    stateLabel = new TextBox(this.page, this.page.getByRole('textbox', { name: 'State*' }));
    deleteCatLink = new Link(this.page, this.page.getByRole('link', { name: 'Delete Cat' }));
    editCatDetailsLink = new Link(this.page, this.page.getByRole('link', { name: 'Edit Cat Details' }));
    editAnnualPlanLink = new Link(this.page, this.page.getByRole('link', { name: 'Edit', exact: true }));

    // Total Amount Labels
    todayTotalLabel = new Label(this.page, this.page.locator('//div[contains(text(), "Today\'s Total:")]/..//div[contains(@class, "col-3")]'));
    monthlyCostTotalLabel = new Label(this.page, this.page.locator('//h3[contains(text(),"Monthly Cost Breakdown")]/..//p[contains(text(),"$")]'));
    thirtyDayCostTotalLabel = new Label(this.page, this.page.locator('//h3[contains(text(),"30-Days Cost Breakdown")]/..//p[contains(text(),"$")]'));
    totalAfter30DaysLabel = new Label(this.page, this.page.locator('//div[contains(text(), "Total After 30 Days:")]/..//div[contains(@class, "col-3")]'));

    addAnotherCatButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Another Cat' }));
    // Billing Information
    stripeIframe = new Iframe(this.page, '#payment-element iframe >> nth=0');
    cardPaymentButton = this.stripeIframe.button('[data-testid="card"]');
    achPaymentButton = this.stripeIframe.button('[data-testid="us_bank_account"]');
    cardNumberTextBox = this.stripeIframe.textBox('input[autocomplete="cc-number"]');
    expirationDateTextBox = this.stripeIframe.textBox('input[autocomplete="cc-exp"]');
    cvcTextBox = this.stripeIframe.textBox('input[autocomplete="cc-csc"]');
    countrySelect = this.stripeIframe.select('select[name="country"]');
    postalCodeTextBox = this.stripeIframe.textBox('input[autocomplete="billing postal-code"]');
    useDifferentBillingCheckBox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'Use different billing address' }));

    // Different billing iframe
    diffBillingIframe = new Iframe(this.page, "//div[@id='address-element']/div/iframe[not (@tabindex)]");
    differentFirstNameTextBox = this.diffBillingIframe.textBox('#Field-firstNameInput');
    differentLastNameTextBox = this.diffBillingIframe.textBox('#Field-lastNameInput');
    differentAddressTextBox = this.diffBillingIframe.textBox('#Field-addressLine1Input');

    // Terms and Conditions
    termsAndConditionsCheckbox = new Checkbox(this.page, '#agreementTermsControl');
    goPaperlessCheckbox = new Checkbox(this.page, '#goGreenControl');
    agreePaymentAndRenewalsCheckbox = new Checkbox(this.page, '#paymentAndRenewalTermsControl');

    // Lower section
    purchaseButton = new Button(this.page, this.page.getByRole('button', { name: 'Purchase' }));

    /**
     * Fills out the finalize plan form for a quote scenario (default behavior)
     * @param planData - Optional data object with form fields
     */
    async fillFinalizePlanForm(planData?: Partial<FelixFinalizePlanData>): Promise<void> {
        logger.info('[FinalizePlanPage.fillFinalizePlanForm] - Filling finalize plan form for quote scenario');
        await this.fillFinalizePlanFormInternal('quote', planData);
    }

    /**
     * Fills out the finalize plan form for a mcleadPay scenario (starts with card number)
     * @param planData - Optional data object with form fields
     */
    async fillFinalizePlanFormForMcleadPay(planData?: Partial<FelixFinalizePlanData>): Promise<void> {
        logger.info('[FinalizePlanPage.fillFinalizePlanFormForMcleadPay] - Filling finalize plan form for mcleadPay scenario');
        await this.fillFinalizePlanFormInternal('mcleadPay', planData);
    }

    /**
     * Fills out the finalize plan form for a mcleadFree scenario (only checks agreement options)
     * @param planData - Optional data object with form fields
     */
    async fillFinalizePlanFormForMcleadFree(planData?: Partial<FelixFinalizePlanData>): Promise<void> {
        logger.info('[FinalizePlanPage.fillFinalizePlanFormForMcleadFree] - Filling finalize plan form for mcleadFree scenario');
        await this.fillFinalizePlanFormInternal('mcleadFree', planData);
    }

    /**
     * Private method to fill the finalize plan form based on scenario
     * @param scenario - 'quote' | 'mcleadPay' | 'mcleadFree'
     * @param planData - Optional data object with form fields
     */
    private async fillFinalizePlanFormInternal(scenario: 'quote' | 'mcleadPay' | 'mcleadFree', planData?: Partial<FelixFinalizePlanData>): Promise<void> {
        logger.info(`[FinalizePlanPage.fillFinalizePlanFormInternal] - Filling finalize plan form for scenario: ${scenario}`);
        const defaultData = getDefaultFelixFinalizePlanData();
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
            if (formData.cardNumber && formData.expiresMMYY && formData.expiresCVC) {
                await expect(this.postalCodeTextBox.getLocator()).toHaveValue(/^\d{5}$/);
                await this.cardNumberTextBox.setText(formData.cardNumber);
                await this.expirationDateTextBox.setText(formData.expiresMMYY);
                await this.cvcTextBox.setText(formData.expiresCVC);
            }
            if (formData.useDifferentBilling) {
                await this.fillDifferentBillingAddress(formData);
            }
        }

        // For all scenarios, check agreement options
        await this.checkAgreementOptions();
        logger.info(`[FinalizePlanPage.fillFinalizePlanFormInternal] - Finalize plan form filled successfully for scenario: ${scenario}`);
    }

    /**
     * Checks all required agreement checkboxes if they are displayed
     * @returns Promise that resolves when all checkboxes are checked
     */
    async checkAgreementOptions(): Promise<void> {
        logger.info('Checking agreement options');
        const checkboxes = [
            this.termsAndConditionsCheckbox,
            this.goPaperlessCheckbox,
            this.agreePaymentAndRenewalsCheckbox
        ];

        for (const checkbox of checkboxes) {
            if ((await checkbox.isDisplayed()) && !(await checkbox.isChecked())) {
                await checkbox.checkMobile();
            }
        }
        logger.info('All agreement options checked successfully');
    }

    /**
     * Fills different billing address information
     * @param formData - The form data containing different billing address info
     */
    private async fillDifferentBillingAddress(formData: FelixFinalizePlanData): Promise<void> {
        logger.info('[FinalizePlanPage.fillDifferentBillingAddress] Filling different billing address');
        await this.useDifferentBillingCheckBox.check();
        await this.differentFirstNameTextBox.setText(formData.differentFirstName);
        await this.differentLastNameTextBox.setText(formData.differentLastName);
        await this.differentAddressTextBox.typeText(formData.differentAddress!);
        await this.differentAddressTextBox.press('Enter');
        logger.info('[FinalizePlanPage.fillDifferentBillingAddress] Different billing address filled successfully');
    }
}
