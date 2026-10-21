import { faker } from '@faker-js/faker';

export interface FelixQuoteData {
    petName: string;
    zipCode: string;
    gender: 'male' | 'female';
    petAge: string;
    breed: string;
    email: string;
    acceptTerms: boolean;
    registrationNumber?: string;
    registrationZipCode?: string;
}

export const getDefaultFelixQuoteData = (): FelixQuoteData => {
    return {
        petName: faker.animal.cat(),
        zipCode: '77433',
        gender: 'male',
        petAge: '2',
        breed: 'Abyssinian',
        email: faker.internet.email({ provider: 'yopmail.com' }),
        acceptTerms: true
    };
};
