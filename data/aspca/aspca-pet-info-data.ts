import { faker } from '@faker-js/faker';

export interface AspcaPetInfoData {
    petName: string;
    petType: 'dog' | 'cat';
    gender: 'male' | 'female';
    age: string;
    zipCode: string;
    breed: string;
    email: string;
}

export const getDefaultAspcaDogData = (): AspcaPetInfoData => {
    return {
        petName: faker.animal.dog(),
        petType: 'dog',
        gender: 'male',
        age: '2 years',
        zipCode: '10001',
        breed: 'Labrador Retriever',
        email: faker.internet.email({ provider: 'yopmail.com' }),
    };
};

export const getDefaultAspcaCatData = (): AspcaPetInfoData => {
    return {
        petName: faker.animal.cat(),
        petType: 'cat',
        gender: 'female',
        age: '2 years',
        zipCode: '10001',
        breed: 'American Shorthair',
        email: faker.internet.email({ provider: 'yopmail.com' }),
    };
};
