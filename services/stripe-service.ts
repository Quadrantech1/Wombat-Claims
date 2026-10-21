import { PaymentData, PaymentResult } from '@api-setup/interfaces/api-tests/stripe-payment-interface';
import { config } from '@config/env-config';
import { logger } from '@utils/logger-util';
import Stripe from 'stripe';

export class StripeService {
    private stripe: Stripe;
    private readonly serviceFee = 300;
    private readonly accountPPI = 'acct_1PDumNRrPQ3Ba5OS';
    private readonly accountAKC = 'acct_1PEWctRuCiisRwsT';
    private readonly accountFelix = 'acct_1PEWi3Rv7kJGKzXa';

    private readonly stripeMetadata = {
        IsRealTimeCreditCardPayment: "True",
        IsRealTimePayment: "True",
        Origin: "Automation Framework",
        Environment: config.ENVIRONMENT,
        ReturnUrl: config.STRIPE_RETURN_URL,
        SystemOfRecord: "Orca"
    };

    constructor() {
        this.stripe = new Stripe(config.SECRET_KEY, { apiVersion: '2025-06-30.basil' });
    }

    /**
     * Processes a payment using Stripe and returns the result containing customerId and paymentMethodId.
     * Applies default values for optional fields and performs the full payment flow.
     * @param randomValue - Unique value for test data
     * @param paymentData - Payment data for the checkout
     * @returns Promise<PaymentResult>
     */
    async processCheckout(randomValue: string, paymentData: PaymentData): Promise<PaymentResult> {
        const paymentDataWithDefaults: PaymentData = {
            ...paymentData,
            email: paymentData.email ?? `quote${randomValue}@yopmail.com`,
            firstName: paymentData.firstName ?? `FN${randomValue}`,
            lastName: paymentData.lastName ?? `LN${randomValue}`,
            cardToken: paymentData.cardToken ?? 'tok_visa',
        };
        const customerId = await this.createCustomer(paymentDataWithDefaults.firstName!, paymentDataWithDefaults.lastName!, paymentDataWithDefaults.email!);
        const paymentMethodId = await this.createPaymentMethod(paymentDataWithDefaults.cardToken!);
        await this.attachPaymentMethod(customerId, paymentMethodId);
        const sanitizedAmount = Math.round(paymentDataWithDefaults.amount);
        const paymentIntentId = await this.createPaymentIntent(
            paymentDataWithDefaults.marketChannelId,
            paymentDataWithDefaults.quoteGuid,
            sanitizedAmount,
            paymentMethodId,
            customerId
        );
        await this.confirmPaymentIntent(paymentIntentId, paymentMethodId, config.STRIPE_RETURN_URL);
        return { customerId, paymentMethodId };
    }

    /**
     * Creates a Stripe customer.
     * @param firstName - Customer first name
     * @param lastName - Customer last name
     * @param email - Customer email
     * @returns Promise<string> - Stripe customer ID
     */
    async createCustomer(firstName: string, lastName: string, email: string): Promise<string> {
        const name = `${firstName} ${lastName}`;
        logger.info('[StripeService.createCustomer] - Creating customer with name: ' + name + ', email: ' + email);
        const customer = await this.stripe.customers.create({ name, email });
        logger.info('[StripeService.createCustomer] - Created customer with id: ' + customer.id);
        return customer.id;
    }

    /**
     * Creates a Stripe payment method.
     * @param cardToken - Card token
     * @returns Promise<string> - Stripe payment method ID
     */
    async createPaymentMethod(cardToken: string): Promise<string> {
        logger.info('[StripeService.createPaymentMethod] - Creating payment method with card token: ' + cardToken);
        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card: { token: cardToken },
        });
        logger.info('[StripeService.createPaymentMethod] - Created payment method with id: ' + paymentMethod.id);
        return paymentMethod.id;
    }

    /**
     * Attaches a payment method to a customer.
     * @param customerId - Stripe customer ID
     * @param paymentMethodId - Stripe payment method ID
     * @returns Promise<void>
     */
    async attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
        logger.info('[StripeService.attachPaymentMethod] - Attaching payment method ' + paymentMethodId + ' to customer ' + customerId);
        await this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
        logger.info('[StripeService.attachPaymentMethod] - Payment method attached.');
    }

    /**
     * Creates a Stripe payment intent.
     * @param marketChannelId - Market channel identifier
     * @param guidId - Private GUID for metadata
     * @param amount - Payment amount in cents
     * @param paymentMethodId - Stripe payment method ID
     * @param customerId - Stripe customer ID
     * @returns Promise<string> - Stripe payment intent ID
     */
    async createPaymentIntent(marketChannelId: string, guidId: string, amount: number, paymentMethodId: string, customerId: string): Promise<string> {
        logger.info('[StripeService.createPaymentIntent] - Creating payment intent for customer: ' + customerId + ', amount: ' + amount);
        const params = this.createPaymentIntentParams(marketChannelId, guidId, amount, paymentMethodId, customerId);
        const paymentIntent = await this.stripe.paymentIntents.create(params);
        logger.info('[StripeService.createPaymentIntent] - Created payment intent with id: ' + paymentIntent.id);
        return paymentIntent.id;
    }

    /**
     * Confirms a Stripe payment intent.
     * @param paymentIntentId - Payment intent ID
     * @param paymentMethodId - Payment method ID
     * @param returnUrl - Return URL for Stripe
     * @returns Promise<void>
     */
    async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string, returnUrl: string): Promise<void> {
        logger.info('[StripeService.confirmPaymentIntent] - Confirming payment intent: ' + paymentIntentId + ' with payment method: ' + paymentMethodId);
        await this.stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
            return_url: returnUrl,
        });
        logger.info('[StripeService.confirmPaymentIntent] - Payment intent confirmed.');
    }

    /**
     * Builds PaymentIntent params for Stripe using standard metadata and connected account logic.
     * @param marketChannelId - The market channel identifier.
     * @param guidId - The private GUID for metadata.
     * @param amount - The payment amount in cents.
     * @param paymentMethodId - The Stripe payment method ID.
     * @param customerId - The Stripe customer ID.
     * @returns Stripe.PaymentIntentCreateParams object for Stripe API.
     */
    private createPaymentIntentParams(
        marketChannelId: string,
        guidId: string,
        amount: number,
        paymentMethodId: string,
        customerId: string
    ): Stripe.PaymentIntentCreateParams {
        const connectedAccount = this.getConnectedAccount(marketChannelId);
        logger.info('[StripeService.createPaymentIntentParams] - Using connected account: ' + connectedAccount);
        return {
            amount: amount + this.serviceFee,
            currency: 'usd',
            customer: customerId,
            payment_method: paymentMethodId,
            transfer_data: { destination: connectedAccount },
            on_behalf_of: connectedAccount,
            metadata: { ...this.stripeMetadata, PrivateId: guidId },
            setup_future_usage: 'off_session',
        };
    }

    /**
     * Returns the connected account ID based on the marketChannelId.
     * @param marketChannelId - The market channel identifier.
     */
    private getConnectedAccount(marketChannelId: string): string {
        const id = marketChannelId.toLowerCase();
        let account = this.accountPPI;
        if (id.includes('akc') || id === '2') {
            account = this.accountAKC;
        } else if (id.includes('felix') || id.includes('flx') || id === '15') {
            account = this.accountFelix;
        }
        logger.info('[StripeService.getConnectedAccount] - Selected account: ' + account + ' for marketChannelId: ' + marketChannelId);
        return account;
    }
}
