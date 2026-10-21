import { config } from '@config/env-config';
import { logger } from '@utils/logger-util';
import Stripe from 'stripe';

export class SidneyStripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(config.SIDNEY_STRIPE_SECRET_KEY, { apiVersion: '2025-06-30.basil' });
    }

    /**
     * Creates a Stripe test confirmation token for use in Sidney quote checkout.
     * Uses the Stripe test helpers API — only works in test/sandbox mode.
     * @param options - Optional card overrides.
     * @returns Promise<string> - The confirmation token ID (ctoken_...).
     */
    async createConfirmationToken(
        options?: {
            cardNumber?: string;
            expMonth?: number;
            expYear?: number;
            cvc?: string;
            name?: string;
        }
    ): Promise<string> {
        logger.info('[SidneyStripeService.createConfirmationToken] - Creating confirmation token');
        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card: { token: options?.cardNumber ?? 'tok_visa' },
            billing_details: {
                name: options?.name ?? 'Test User',
                email: 'example@example.com',
            },
        });
        logger.info('[SidneyStripeService.createConfirmationToken] - Created payment method with id: ' + paymentMethod.id);
        const confirmationToken = await this.stripe.testHelpers.confirmationTokens.create({
            payment_method: paymentMethod.id,
            setup_future_usage: 'off_session',
        });
        logger.info('[SidneyStripeService.createConfirmationToken] - Created confirmation token with id: ' + confirmationToken.id);
        return confirmationToken.id;
    }
}
