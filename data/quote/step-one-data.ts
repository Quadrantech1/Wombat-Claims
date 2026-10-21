import { faker } from '@faker-js/faker';

export interface StepOneData {
    petName: string;
    postalCode: string;
    gender: 'male' | 'female';
    petAge: string;
    petType: 'cat' | 'dog';
    breed: string;
    email: string;
    partnerCode?: string;
    acceptTerms: boolean;
    phoneNumber: string;
}

export const getDefaultStepOneData = (): StepOneData => {
    return {
        petName: faker.animal.cat(),
        postalCode: '77433',
        gender: 'male',
        petAge: '2',
        petType: 'cat',
        breed: 'Abyssinian',
        email: faker.internet.email({ provider: 'yopmail.com' }),
        partnerCode: '',
        phoneNumber: '123-456-7890',
        acceptTerms: true
    };
};

export const getDefaultPpuStepOneData = (): StepOneData => {
    return {
        petName: faker.animal.cat(),
        postalCode: 'K7G 1R3',
        gender: 'male',
        petAge: '2',
        petType: 'cat',
        breed: 'Abyssinian',
        email: faker.internet.email({ provider: 'yopmail.com' }),
        partnerCode: '',
        phoneNumber: '1234567890',
        acceptTerms: true
    };
};
