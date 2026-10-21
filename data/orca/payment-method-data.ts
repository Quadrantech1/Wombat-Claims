export interface PaymentMethodData {
    paymentType: 'Credit Card' | 'ACH';
    cardNumber: string;
    expirationDate: string;
    cvv: string;
}

export const getDefaultPaymentMethodData = (): PaymentMethodData => {
    return {
        paymentType: 'Credit Card',
        cardNumber: '4242424242424242',
        expirationDate: '0935',
        cvv: '123'
    };
};
