import { faker } from '@faker-js/faker';

export interface StepOneData {
    petName: string;
    zipCode: string;
    gender: 'male' | 'female';
    petAge: string;
    petType: 'cat' | 'dog';
    breed: string;
    email: string;
    acceptTerms: boolean;
}

export const getDefaultStepOneData = (): StepOneData => {

    return {
        petName: faker.animal.cat(),
        zipCode: '77433',
        gender: 'male',
        petAge: '2',
        petType: 'cat',
        breed: 'Abyssinian',
        email: faker.internet.email({ provider: 'yopmail.com' }),
        acceptTerms: true
    };
};

