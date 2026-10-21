import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Iframe } from '@controls/iframe';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { CompleteEnrollmentData, getDefaultCompleteEnrollmentData } from '@data/quote-tool/complete-enrollment-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';

export class CompleteEnrollmentPage extends BasePage {
    // Labels
    completeYourEnrollmentLabel = new Label(this.page, "//h1[text()='Complete your enrollment']");
    policyOverviewCostLabel = new Label(this.page, "//div[contains(@class,'pet-overview__premium-price')]/span");
    cartIsEmptyLabel = new Label(this.page, "//*[@class = 'heading']//*[text() ='Your cart is empty!']");
    priceMonthLabel = new Label(this.page, "//div[@class='pet-overview__premium-price c--secondary']/span");
    todaysTotal = new Label(this.page, this.page.locator('b').filter({ hasText: '$' }));
    dateOfCharge = new Label(this.page, ".day-number");
    petCoverageOverviewLabel = new Label(this.page, "#pet-coverage-overview .pet-overview__info");

    // Customer Info TextBoxes
    firstNameTextBox = new TextBox(this.page, "#customer-firstName");
    lastNameTextBox = new TextBox(this.page, "#customer-lastName");
    addressTextBox = new TextBox(this.page, "#customer-address-address1");
    aptSuiteEtcTextBox = new TextBox(this.page, "#customer-address-address2");
    cityTextBox = new TextBox(this.page, "#customer-address-city");
    stateSelect = new Select(this.page, "#customer-address-stateProvId");
    zipCodeTextBox = new TextBox(this.page, "#customer-address-zipCode");
    phoneNumberTextBox = new TextBox(this.page, "#customer-phoneNumber");
    emailAddressTextBox = new TextBox(this.page, "#customer-emailAddress");
    groupCodeTextBox = new TextBox(this.page, "#affinity-group-code");

    // Stripe iframe and controls
    stripeIframe = new Iframe(this.page, '#payment-element iframe >> nth=0');
    cardNumberTextBox = this.stripeIframe.textBox('input[autocomplete="cc-number"]');
    expiresMMYYTextBox = this.stripeIframe.textBox('input[autocomplete="cc-exp"]');
    cvcTextBox = this.stripeIframe.textBox('input[autocomplete="cc-csc"]');
    countrySelect = this.stripeIframe.select('select[name="country"]');
    zipCodePaymentTextBox = this.stripeIframe.textBox('input[autocomplete="billing postal-code"]');

    // Buttons
    applyButton = new Button(this.page, "//span[text()='Apply']");
    enrollNowButton = new Button(this.page, "//button[@title='Submit my enrollment']");
    addAnotherPetButton = new Button(this.page, "//button[contains(text(),'Add Another Pet')]");
    removePlanYesButton = new Button(this.page, "//button[contains(text(),'Yes')]");
    removePlanNoButton = new Button(this.page, "//button[contains(text(),'No')]");
    cardButton = new Button(this.page, "#card-tab");

    // Checkboxes
    iAgreeToGoPaperlessOption = new Checkbox(this.page, "input[name='electronic-delivery']");
    iAgreeThatByCheckingOption = new Checkbox(this.page, "input[name='e-consent']");
    feeDisclosureOption = new Checkbox(this.page, "input[name='fee-disclosure']");
    paymentRenewalOption = new Checkbox(this.page, "input[name='payment-and-renewal-terms']");

    // Links
    useDifferentBillingAddressLink = new Link(this.page, "//label[contains(.,'Use a different billing Address')]");
    editPlanDetailsLink = new Link(this.page, this.page.getByRole('button', { name: 'Edit plan details >' }));
    removePlanLink = new Link(this.page, this.page.getByRole('button', { name: 'Remove Plan >' }));
    showTermDetailsLink = new Link(this.page, this.page.getByRole('button', { name: 'Show Term Details >' }));
    hideTermDetailsLink = new Link(this.page, this.page.getByRole('button', { name: 'Hide Term Details >' }));
    // Term details items shown by the Show Term Details section
    termDeductibleLabel = new Label(this.page, "//li[contains(text(),'Deductible')]");
    termCoinsuranceLabel = new Label(this.page, "//li[contains(text(),'Coinsurance')]");
    termIncidentLabel = new Label(this.page, "//li[contains(text(),'Incident')]");
    termAnnualLabel = new Label(this.page, "//li[contains(text(),'Annual')]");
    editPetLink = new Link(this.page, this.page.getByRole('button', { name: 'Edit Pet >' }));

    // Different Billing Address iframe and controls
    billingAddressIframe = new Iframe(this.page, "//div[@id='address-element']/div/iframe[not (@tabindex)]");
    differentAddressTextBox = this.billingAddressIframe.textBox("#Field-addressLine1Input");
    differentFirstNameTextBox = this.billingAddressIframe.textBox("#Field-firstNameInput");
    differentLastNameTextBox = this.billingAddressIframe.textBox("#Field-lastNameInput");
    differentCityTextBox = this.billingAddressIframe.textBox("#Field-localityInput");
    differentStateSelect = this.billingAddressIframe.select("#Field-administrativeAreaInput");
    differentZipCodeTextBox = this.billingAddressIframe.textBox("#Field-postalCodeInput");

    /**
     * Fills enrollment form with default data merged with any provided overrides
     * @param enrollmentData - Optional partial data to override defaults
     * @returns Promise that resolves when enrollment form is filled
     */
    async fillCompleteEnrollment(enrollmentData?: Partial<CompleteEnrollmentData>): Promise<void> {
        const formData = { ...getDefaultCompleteEnrollmentData(), ...enrollmentData };
        logger.info('[CompleteEnrollmentPage.fillCompleteEnrollment] Filling complete enrollment form with data:', formData);
        // Fill main form fields
        await this.firstNameTextBox.setText(formData.firstName!);
        await this.lastNameTextBox.setText(formData.lastName!);
        await this.addressTextBox.setText(formData.address!);
        if (formData.aptSuiteEtc) {
            await this.aptSuiteEtcTextBox.setText(formData.aptSuiteEtc);
        }
        await this.cityTextBox.setText(formData.city!);
        await this.phoneNumberTextBox.setText(formData.phoneNumber!);

        if (formData.emailAddress) {
            await this.emailAddressTextBox.setText(formData.emailAddress!);
        }

        // Handle payment and final agreement steps
        await this.fillPaymentAndCheckAgreements(formData);
    }

    /**
     * Fills payment fields inside the Stripe iframe and final steps such as different billing,
     * group code and agreement checkboxes.
     * @param enrollmentData - Partial enrollment data
     */
    async fillPaymentAndCheckAgreements(enrollmentData?: Partial<CompleteEnrollmentData>): Promise<void> {
        const formData = { ...getDefaultCompleteEnrollmentData(), ...enrollmentData };
        logger.info('[CompleteEnrollmentPage.fillPaymentAndCheckAgreements] Filling payment and final steps with data:', formData);
        const addressZip = await this.zipCodeTextBox.getText();
        await expect(this.zipCodePaymentTextBox.getLocator()).toHaveText(addressZip);
        await this.cardNumberTextBox.setText(formData.cardNumber!);
        await this.expiresMMYYTextBox.setText(formData.expiresMMYY!);
        await this.cvcTextBox.setText(formData.cvc!);
        await this.phoneNumberTextBox.setText(formData.phoneNumber!);

        if (formData.isUsingDifferentBilling) {
            await this.useDifferentBillingAddressLink.click();
            await this.fillDifferentBillingAddress(formData);
        }

        if (formData.groupCode) {
            await this.groupCodeTextBox.setText(formData.groupCode);
        }

        await this.checkAgreementOptions();
        logger.info('[CompleteEnrollmentPage.fillPaymentAndCheckAgreements] Payment and final steps completed successfully');
    }

    /**
     * Fills different billing address fields
     * @param differentBillingData - Enrollment data containing different billing information
     * @returns Promise that resolves when different billing address is filled
     */
    async fillDifferentBillingAddress(differentBillingData: CompleteEnrollmentData): Promise<void> {
        logger.info('[CompleteEnrollmentPage.fillDifferentBillingAddress] Filling different billing address with data:', differentBillingData);
        if (differentBillingData.differentFirstName) {
            await this.differentFirstNameTextBox.setText(differentBillingData.differentFirstName);
        }
        if (differentBillingData.differentLastName) {
            await this.differentLastNameTextBox.setText(differentBillingData.differentLastName);
        }
        if (differentBillingData.differentAddress) {
            await this.differentAddressTextBox.setText(differentBillingData.differentAddress);
            await this.differentAddressTextBox.press("Enter");
        }
        logger.info('[CompleteEnrollmentPage.fillDifferentBillingAddress] Different billing address filled successfully');
    }

    /**
     * Checks all required agreement checkboxes if they are displayed
     * @returns Promise that resolves when all checkboxes are checked
     */
    async checkAgreementOptions(): Promise<void> {
        logger.info('[CompleteEnrollmentPage.checkAgreementOptions] Checking agreement options if displayed');
        const checkboxes = [
            this.iAgreeThatByCheckingOption,
            this.iAgreeToGoPaperlessOption,
            this.feeDisclosureOption,
            this.paymentRenewalOption
        ];

        for (const checkbox of checkboxes) {
            if (await checkbox.isDisplayed() && !(await checkbox.isChecked())) {
                await checkbox.check();
            }
        }
        logger.info('[CompleteEnrollmentPage.checkAgreementOptions] All agreement options checked successfully');
    }

    /**
     * Shows the term details section and waits for it to be visible
     */
    async showTermDetails(): Promise<void> {
        logger.info('[CompleteEnrollmentPage.showTermDetails] Clicking Show Term Details');
        await this.showTermDetailsLink.click();
        await this.termDeductibleLabel.getLocator().waitFor({ state: 'visible' });
    }

    /**
     * Hides the term details section and waits for it to be hidden
     */
    async hideTermDetails(): Promise<void> {
        logger.info('[CompleteEnrollmentPage.hideTermDetails] Clicking Hide Term Details');
        await this.hideTermDetailsLink.click();
        await this.termDeductibleLabel.getLocator().waitFor({ state: 'hidden' });
    }

    /**
     * Returns term details values as strings: { deductible, coinsurance, incident, annual }
     */
    async getTermDetails(): Promise<{ deductible: string; coinsurance: string; incident: string; annual: string }> {
        const deductible = (await this.termDeductibleLabel.getText()).replace('Deductible:', '').trim();
        const coinsurance = (await this.termCoinsuranceLabel.getText()).replace('Coinsurance:', '').trim();
        const incident = (await this.termIncidentLabel.getText()).replace('Incident:', '').trim();
        const annual = (await this.termAnnualLabel.getText()).replace('Annual:', '').trim();
        return { deductible, coinsurance, incident, annual };
    }
}
