export interface CompleteEnrollmentData {
    cardNumber?: string;
    expiryDate?: string;
    cvc?: string;
    zipCode?: string;
}

export const getDefaultCompleteEnrollmentData = (): CompleteEnrollmentData => {
    return {
        cardNumber: '4242424242424242',
        expiryDate: '1234',
        cvc: '123'
    };
}
