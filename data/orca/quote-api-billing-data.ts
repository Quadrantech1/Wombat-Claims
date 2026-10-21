import { faker } from '@faker-js/faker';

export interface QuoteApiCustomerInfo {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    phoneNumber: string;
    state: string;
}

export interface QuoteApiBillingInfo {
    nameOnCard: string;
    cardNumber: string;
    expiryMM: string;
    expiryYY: string;
    expiryCVC: string;
}

export const getDefaultCustomerInfo = (): QuoteApiCustomerInfo => {
    return {
        firstName: faker.person.firstName().replace(/'/g, ''),
        lastName: faker.person.lastName().replace(/'/g, ''),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        phoneNumber: '1234567891',
        state: 'Texas'
    };
};

export const getDefaultBillingInfo = (): QuoteApiBillingInfo => {
    return {
        nameOnCard: faker.person.fullName().replace(/'/g, ''),
        cardNumber: '4242424242424242',
        expiryMM: '04',
        expiryYY: '29',
        expiryCVC: '123'
    };
};
