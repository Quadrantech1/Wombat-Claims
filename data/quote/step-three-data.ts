import { faker } from '@faker-js/faker';

export interface StepThreeData {
    firstName?: string;
    lastName?: string;
    address?: string;
    aptSuiteEtc?: string;
    phoneNumber?: string;
    // Credit Card payment (iframe)
    cardholderName?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    // Bank Account payment (non-iframe)
    accountNumber?: string;
    bankNumber?: string;
    transitNumber?: string;
    accountHolderName?: string;
}

export const getDefaultStepThreeDataWithCreditCard = (): StepThreeData => {
    return {
        firstName: faker.person.firstName().replace(/'/g, ''),
        lastName: faker.person.lastName().replace(/'/g, ''),
        address: faker.location.streetAddress(),
        aptSuiteEtc: faker.location.secondaryAddress(),
        phoneNumber: '1112223333',
        cardNumber: '4242424242424242',
        expiryDate: '1229',
        cvv: '123',
    };
};


/**
 * Returns default data for credit card payment
 */
export const getDefaultPpuStepThreeDataWithCreditCard = (): StepThreeData => {
    const firstName = faker.person.firstName().replace(/'/g, '');
    const lastName = faker.person.lastName().replace(/'/g, '');
    return {
        firstName: firstName,
        lastName: lastName,
        address: faker.location.streetAddress(),
        phoneNumber: '1112223333',
        // Credit Card fields only
        cardholderName: `${firstName} ${lastName}`,
        cardNumber: '4242424242424242',
        expiryDate: '1229',
        cvv: '123'
    };
};

/**
 * Returns default data for bank account (ACH) payment
 */
export const getDefaultPpuStepThreeDataWithBankAccount = (): StepThreeData => {
    const firstName = faker.person.firstName().replace(/'/g, '');
    const lastName = faker.person.lastName().replace(/'/g, '');
    return {
        firstName: firstName,
        lastName: lastName,
        address: faker.location.streetAddress(),
        phoneNumber: '1112223333',
        // Bank Account fields only (Canadian format)
        accountNumber: '000123456789',
        bankNumber: '004',
        transitNumber: '12345',
        accountHolderName: `${firstName} ${lastName}`
    };
};
