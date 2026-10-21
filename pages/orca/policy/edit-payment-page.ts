import { Button } from '@controls/button';
import { Iframe } from '@controls/iframe';
import { Select } from '@controls/select';
import { PaymentMethodData, getDefaultPaymentMethodData } from '@data/orca/payment-method-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class EditPaymentPage extends BasePage {
    paymentType = new Select(this.page, "//select[@id='select-payment-type']");
    stripePaymentDetailsIframe = new Iframe(this.page, "//iframe[contains(@name,'__privateStripeFrame') and contains(@allow,'publickey-credentials-get')]");
    cardStripeButton = new Button(this.page, '//*[contains(@class,"--card")]/..');
    cardNumberTextBox = this.stripePaymentDetailsIframe.textBox('#payment-numberInput');
    expirationDateTextBox = this.stripePaymentDetailsIframe.textBox('#payment-expiryInput');
    cvvTextBox = this.stripePaymentDetailsIframe.textBox('#payment-cvcInput');
    achStripeButton = new Button(this.page, "//div[contains(@class,'p-PaymentAccordionButtonText')]//*[contains(text(),'US bank account')]");
    achRoutingNumberTextbox = this.stripePaymentDetailsIframe.textBox('#payment-routingNumberInput');
    achAccountNumberTextbox = this.stripePaymentDetailsIframe.textBox('#payment-accountNumberInput');
    achconfirmAccountNumberTextbox = this.stripePaymentDetailsIframe.textBox('#payment-confirmAccountNumberInput');
    saveButton = new Button(this.page, '#submitBtn');
    cancelButton = new Button(this.page, "//button[@data-dismiss='modal'][normalize-space()='Cancel']");
    createNewButton = new Button(this.page, "//a[normalize-space()='Create New']");
    unassignPaymentOptionButton = new Button(this.page, "//a[@class='pull-left btn btn-danger']");

    /**
     * Fills the payment method form with provided data or defaults
     * @param data - Optional data object with payment fields to override defaults
     */
    async fillPaymentMethod(data?: Partial<PaymentMethodData>): Promise<void> {
        const defaultData = getDefaultPaymentMethodData();
        const formData = { ...defaultData, ...data };
        logger.info(`[EditPaymentPage.fillPaymentMethod] - Filling payment method with data: ${JSON.stringify(formData)}`);

        await this.paymentType.selectOption(formData.paymentType);
        await this.cardNumberTextBox.setText(formData.cardNumber);
        await this.expirationDateTextBox.setText(formData.expirationDate);
        await this.cvvTextBox.setText(formData.cvv);

        logger.info(`[EditPaymentPage.fillPaymentMethod] - Payment method filled successfully`);
    }
}
