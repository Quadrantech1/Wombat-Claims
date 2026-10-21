import { faker } from '@faker-js/faker';

export interface FelixFinalizePlanData {
    firstName?: string;
    lastName?: string;
    address?: string;
    aptSuiteEtc?: string;
    phoneNumber?: string;
    cardNumber?: string;
    expiresMMYY?: string;
    expiresCVC?: string;
    useDifferentBilling?: boolean;
    differentFirstName?: string;
    differentLastName?: string;
    differentAddress?: string;
}

export const getDefaultFelixFinalizePlanData = (): FelixFinalizePlanData => {
    return {
        firstName: faker.person.firstName().replace(/'/g, ''),
        lastName: faker.person.lastName().replace(/'/g, ''),
        address: faker.location.streetAddress(),
        aptSuiteEtc: faker.location.secondaryAddress(),
        phoneNumber: '1112223333',
        cardNumber: '4242424242424242',
        expiresMMYY: '1229',
        expiresCVC: '123',
        useDifferentBilling: false
    };
};
