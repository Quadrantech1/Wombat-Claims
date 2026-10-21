import { faker } from "@faker-js/faker";

export interface AddRemovePetData {
    petName?: string;
    petSpecies: 'Dog' | 'Cat' | 'Horse';
    petBreed: string;
    petAge: string;
    gender?: 'Male' | 'Female';
    spayedNeutered?: 'Yes' | 'No';
    planType?: 'Accident Only Coverage' | 'Complete Coverage';

}

export const getDefaultAddRemovePetData = (): AddRemovePetData => {
    return {
        petName: "test" + faker.animal.dog(),
        petSpecies: 'Dog',
        petBreed: 'Affenpinscher',
        petAge: '1 years ',
        gender: 'Male',
        spayedNeutered: 'No',
        planType: 'Complete Coverage'
    };
}
