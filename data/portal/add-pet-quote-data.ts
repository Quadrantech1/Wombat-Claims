import { faker } from "@faker-js/faker";

export interface AddPetQuoteData {
    petName?: string;
    petType?: 'dog' | 'cat';
    petBreed?: string;
    petAge?: string;
}

export const getDefaultAddPetQuoteData = (): AddPetQuoteData => {
    return {
        petName: faker.animal.dog(),
        petType: 'dog',
        petBreed: 'Golden Retriever',
        petAge: '2'
    };
}
