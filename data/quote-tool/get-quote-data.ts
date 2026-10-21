import { faker } from '@faker-js/faker';
import { getRandomValue } from '@utils/random-values-util';

export interface GetQuoteData {
    petName: string;
    zipCode: string;
    gender: 'male' | 'female';
    petAge: string;
    petType: 'cat' | 'dog';
    breed: string;
    email: string;
    acceptTerms: boolean;
}

export const getDefaultQuoteData = (): GetQuoteData => {

    return {
        petName: `Lucy${getRandomValue()}`,
        zipCode: '77433',
        gender: 'male',
        petAge: '2',
        petType: 'cat',
        breed: 'Abyssinian',
        email: faker.internet.email({ provider: 'yopmail.com' }),
        acceptTerms: true
    };
};