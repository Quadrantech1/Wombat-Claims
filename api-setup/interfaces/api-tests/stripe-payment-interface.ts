export interface PaymentData {
    quoteGuid: string;
    marketChannelId: string;
    email?: string;
    cardToken?: string;
    amount: number;
    firstName?: string;
    lastName?: string;
}

export interface PaymentResult {
    customerId: string;
    paymentMethodId: string;
}