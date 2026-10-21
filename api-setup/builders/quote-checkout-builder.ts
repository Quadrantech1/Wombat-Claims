import { PaymentResult } from '../interfaces/api-tests/stripe-payment-interface';
import { Checkout } from '../interfaces/payloads/checkout-interface';
import { StepTwoResponse } from '../interfaces/payloads/quote-step-two-interface';

export class QuoteCheckoutBuilder {
    private payload: Checkout;

    constructor(randomValue: string) {
        this.payload = {
            quoteGuid: '',
            customerId: null,
            policyTermId: 0,
            ignoreBillingInfo: false,
            eConsent: true,
            feeDisclosure: true,
            isElectronicDelivery: true,
            postalCode: '77433',
            address1: `${randomValue} Automation St`,
            address2: null,
            phone: `123-456-7890`,
            firstName: `FN${randomValue}`,
            lastName: `LN${randomValue}`,
            city: `AutomationCity`,
            paymentProviderCustomerId: null,
            paymentMethod: null,
            paymentProviderId: '3',
            paymentTypeId: '2',
            institutionNumber: null,
            transitNumber: null,
            accountNumber: null
        };
    }

    /**
     * Merge overrides into payload.
     * @param {Partial<Checkout>} overrides
     */
    withPayload(overrides: Partial<Checkout>) {
        this.payload = { ...this.payload, ...overrides };
        return this;
    }

    /**
     * Update payload from step two response.
     * @param {StepTwoResponse} response
     */
    withStepTwoResponse(response: StepTwoResponse) {
        if (!response) {
            throw new Error('[QuoteCheckoutBuilder.withStepTwoResponse] - Response object is required');
        }
        const { quoteGuid, postalCode, customer } = response.data;
        this.payload = {
            ...this.payload,
            quoteGuid,
            postalCode,
            address1: customer.address1,
            phone: customer.phone,
            firstName: customer.firstName,
            lastName: customer.lastName,
            city: customer.city
        };
        return this;
    }

    /**
     * Set payment provider customer id and method from payment result.
     * @param {PaymentResult} paymentDetails
     * @throws {Error} if customerId is missing
     */
    withPaymentDetails(paymentDetails: PaymentResult) {

        if (!paymentDetails.customerId) {
            throw new Error('[QuoteCheckoutBuilder.withPaymentDetails] - Customer ID is required');
        }
        this.payload.paymentProviderCustomerId = paymentDetails.customerId;
        this.payload.paymentMethod = paymentDetails.paymentMethodId || null;
        return this;
    }

    /**
     * Set Scotiabank provider ids and bank account details.
     * paymentProviderId is 6 and paymentTypeId is 1 for Scotiabank.
     * @param {string} institutionNumber
     * @param {string} transitNumber
     * @param {string} accountNumber
     */
    withScotiabank(institutionNumber: string, transitNumber: string, accountNumber: string) {
        // Hardcoded IDs for Scotiabank
        this.payload.paymentProviderId = '6';
        this.payload.paymentTypeId = '1';
        this.payload.institutionNumber = institutionNumber;
        this.payload.transitNumber = transitNumber;
        this.payload.accountNumber = accountNumber;
        return this;
    }

    /**
     * Set Moneris provider ids and payment method.
     * paymentProviderId is 5 and paymentTypeId is 2 for Moneris.
     * @param {string} paymentMethod
     */
    withMoneris(paymentMethod: string) {
        // Hardcoded IDs for Moneris
        this.payload.paymentProviderId = '5';
        this.payload.paymentTypeId = '2';
        this.payload.paymentMethod = paymentMethod;
        return this;
    }

    /**
     * Set Paymentech provider ids and payment method.
     * paymentProviderId is 4 and paymentTypeId 1 - ACH, 2 - Credit Card for Paymentech.
     * @param {string} paymentMethod uid used to mount the Paymentech iframe
     * @param {string} paymentTypeId
     */
    withPaymentech(paymentMethod: string = '', paymentTypeId: string = '2') {
        // Hardcoded IDs for Paymentech
        this.payload.paymentProviderId = '4';
        this.payload.paymentTypeId = paymentTypeId;
        this.payload.paymentMethod = paymentMethod;
        return this;
    }


    build(): Checkout {
        return { ...this.payload };
    }

    static create(randomValue: string) {
        return new QuoteCheckoutBuilder(randomValue);
    }
}
