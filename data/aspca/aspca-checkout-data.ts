import { faker } from '@faker-js/faker';

export interface AspcaCheckoutData {
    firstName: string;
    lastName: string;
    address: string;
    aptSuite?: string;
    phoneNumber: string;
    city: string;
    billingCycle: 'monthly' | 'annually';
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    billingZip: string;
}

export const getDefaultAspcaCheckoutData = (): AspcaCheckoutData => {
    return {
        firstName: faker.person.firstName().replace(/'/g, ''),
        lastName: faker.person.lastName().replace(/'/g, ''),
        address: faker.location.streetAddress(),
        phoneNumber: '2125551234',
        city: 'New York',
        billingCycle: 'monthly',
        cardNumber: '4242424242424242',
        expiryDate: '1229',
        cvc: '123',
        billingZip: '10001',
    };
};
