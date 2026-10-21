import { BrandFullName } from '@utils/brand-util';
import { getTodayDate } from '@utils/date-util';
import { getRandomValue } from '@utils/random-values-util';

export interface BreederDetailsData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    address1: string;
    address2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
}

export interface LitterDetailsData {
    marketChannel: string;
    registrationNumber: string;
    registrationDate: string;
    dateOfBirth: string;
    breed: string;
    maleCount: string;
    femaleCount: string;
}

/**
 * Returns default breeder details data.
 * Default values extracted from Cucumber test scenarios.
 */
export const getDefaultBreederDetailsData = (): BreederDetailsData => {
    const randomValue = getRandomValue();
    return {
        firstName: `RANDOM${randomValue}`,
        lastName: `RANDOM${randomValue}`,
        email: `RANDOM${randomValue}@yopmail.com`,
        phoneNo: '(123)456-7899',
        address1: `RANDOM${randomValue} address`,
        address2: `RANDOM${randomValue} address`,
        city: 'Cypress',
        stateProvince: 'Texas',
        postalCode: '77433'
    };
};

/**
 * Returns default litter details data.
 * Default values extracted from Cucumber test scenarios.
 */
export const getDefaultLitterDetailsData = (): LitterDetailsData => {
    const randomValue = getRandomValue();
    return {
        marketChannel: BrandFullName.AKC,
        registrationNumber: `Test${randomValue}`,
        registrationDate: getTodayDate(),
        dateOfBirth: '01/01/2022',
        breed: 'Affenpinscher',
        maleCount: '3',
        femaleCount: '1'
    };
};
