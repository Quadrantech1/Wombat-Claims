import { faker } from "@faker-js/faker";

export interface PetInfoData {
    petName?: string;
    petType: 'Dog' | 'Cat' | 'Horse';
    petBreed: string;
    petAge: string;
    gender?: 'Male' | 'Female';
    spayedNeutered?: 'Yes' | 'No';
    vetTrialCode?: 'Yes' | 'No' | 'No Trial';
    vetName?: string;

}

export const getDefaultPetInfoData = (): PetInfoData => {
    return {
        petName: "test"+faker.animal.dog(),
        petType: 'Dog',
        petBreed: 'Affenpinscher',
        petAge: '1 years ',
        gender: 'Male',
        spayedNeutered: 'No',
        vetTrialCode: 'No',
        vetName: 'Has No Vet'
    };
}
