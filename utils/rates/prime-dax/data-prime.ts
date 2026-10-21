export interface DataPrime {
    isDog: boolean;
    breed: string;
    age: string;
    territory: string;
    baseSpeciesLevel: string;

}

export const getDefaultPrimeData = (): DataPrime => {
    return {
        isDog: true,
        breed: 'Crossbreed',
        age: '5',
        territory: 'Ontario',
        baseSpeciesLevel: 'level1'
    };
};