import { SidneyAddress, SidneyBreed } from './sidney-common-interface';

export interface SidneyCreatePet {
    name: string;
    breed: SidneyBreed;
    exclusions: string[];
    birthDate: string;
    gender: string;
    isSpayedOrNeutered?: boolean;
    color?: string;
}

export interface SidneyScratchPadEntry {
    key: string;
    value?: string;
}

export interface SidneyCreateQuotePayload {
    emailAddress: string;
    brand: string;
    ratingAddress: Pick<SidneyAddress, 'zipcode'>;
    pets: SidneyCreatePet[];
    scratchPad?: SidneyScratchPadEntry[];
    effectiveDate?: string;
    mailingAddress?: SidneyAddress;
    goPaperless?: boolean;
    allowMarketing?: boolean;
    preferredLanguage?: string;
}
