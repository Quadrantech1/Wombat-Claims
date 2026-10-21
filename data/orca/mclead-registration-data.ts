import { faker } from '@faker-js/faker';
import { BrandFullName } from '@utils/brand-util';
import { getYearsAgoDate, getYesterdayDate } from '@utils/date-util';

export interface McLeadPetData {
    registrationNo: string;
    registrationDate: string;
    dateOfBirth: string;
    color: string;
    marketChannel: string;
    partner?: string;
    petName: string;
    species: string;
    breed: string;
    gender: string;
    soldDate?: string;
}

export interface McLeadCustomerData {
    firstName: string;
    middleName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    email: string;
    phone: string;
    sendEmail: string;
}


export interface McLeadRegistrationData {
    petDetails?: Partial<McLeadPetData>;
    customerDetails?: Partial<McLeadCustomerData>;
}

export const getDefaultMcLeadPetData = (): McLeadPetData => {    return {
        registrationNo: faker.string.alphanumeric(8).toUpperCase(),
        registrationDate: getYesterdayDate(),
        dateOfBirth: getYearsAgoDate(2),
        color: faker.color.human(),
        marketChannel: BrandFullName.AKC,
        petName: faker.animal.dog(),
        species: 'Cat',
        breed: 'Angora',
        gender: 'Male',
    };
};

export const getDefaultMcLeadCustomerData = (): McLeadCustomerData => {
    return {
        firstName: faker.person.firstName(),
        middleName: faker.person.middleName(),
        lastName: faker.person.lastName(),
        address1: faker.location.streetAddress(),
        address2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        stateProvince: 'Texas',
        postalCode: '77433',
        email: faker.internet.email({ provider: 'yopmail.com' }),
        phone: '1112223333',
        sendEmail: 'Yes'
    };
};

export const getDefaultMcLeadRegistrationData = (): McLeadRegistrationData => {
    return {
        petDetails: getDefaultMcLeadPetData(),
        customerDetails: getDefaultMcLeadCustomerData()
    };
};
