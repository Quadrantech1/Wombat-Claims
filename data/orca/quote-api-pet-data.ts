import { faker } from '@faker-js/faker';

/**
 * Pet details used for Quote API data generation.
 */
export interface QuoteApiPetInfo {
    petName: string;
    petBreed: string;
    petType: string;
    gender: string;
    weight: string;
    petAge: string;
}

export const getDefaultPetInfo = (): QuoteApiPetInfo => {
    return {
        petName: faker.person.firstName().replace(/'/g, ''),
        petBreed: 'Angora',
        petType: 'Cat',
        gender: 'Male',
        weight: '10',
        petAge: '3'
    };
};
