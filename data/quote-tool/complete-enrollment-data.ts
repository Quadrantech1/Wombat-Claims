import { faker } from '@faker-js/faker';

export interface CompleteEnrollmentData {
    firstName?: string;
    lastName?: string;
    address?: string;
    aptSuiteEtc?: string;
    city?: string;
    phoneNumber?: string;
    emailAddress?: string;
    groupCode?: string;
    cardNumber?: string;
    expiresMMYY?: string;
    cvc?: string;
    isUsingDifferentBilling?: boolean;
    differentFirstName?: string;
    differentLastName?: string;
    differentAddress?: string;
}

export const getDefaultCompleteEnrollmentData = (): CompleteEnrollmentData => {
    return {
        firstName: faker.person.firstName().replace(/'/g, ''),
        lastName: faker.person.lastName().replace(/'/g, ''),
        address: faker.location.streetAddress(),
        aptSuiteEtc: faker.location.secondaryAddress(),
        city: faker.location.city(),
        phoneNumber: '1112223333',
        cardNumber: '5555555555554444', // MasterCard test number was chosen to know what policies were created using UI
        expiresMMYY: '1229',
        cvc: '123',
        isUsingDifferentBilling: false
    };
};