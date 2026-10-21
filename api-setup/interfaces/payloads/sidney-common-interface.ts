export interface SidneyBreedAlias {
    breedId: number;
    alias: string;
}

export interface SidneyBreed {
    species: string;
    type: string;
    name: string;
    code: string;
    maxAge?: number;
    alias?: SidneyBreedAlias;
    aliases?: SidneyBreedAlias[];
}

export interface SidneyAddress {
    state?: string;
    zipcode: string;
    street1?: string;
    city?: string;
}
