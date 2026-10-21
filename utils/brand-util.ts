import { config } from '@config/env-config';
/**
 * Supported short brand codes.
 */
export type Brand = 'AKC' | 'PPI' | 'FELIX' | 'FLX' | 'ORCA' | 'PPU_PRIME' | 'ORCA_GROUP' | 'AKC_NEW' | 'PPI_NEW' | 'PPU_CORE' | 'PPU' | 'ASPCA' | 'OPP' | 'ORCA_CA';

export const BrandUrl: Record<Brand, string> = {
    AKC: config.URL_AKC,
    PPI: config.URL_PPI,
    FELIX: config.URL_FELIX,
    FLX: config.URL_FELIX,
    ORCA: config.URL_ORCA,
    ORCA_GROUP: config.URL_ORCA_GROUP,
    PPU_PRIME: '',
    AKC_NEW: config.URL_AKC_NEW,
    PPI_NEW: config.URL_PPI_NEW,
    ASPCA: config.URL_ASPCA,
    PPU_CORE: '',
    PPU: config.URL_PPU,
    OPP: config.URL_OPP,
    ORCA_CA: config.URL_ORCA_CA,
    PPU_CORE2: ''
};
export const ASPCAUrl = {
    scroller: config.URL_ASPCA,
    stepper: `${config.URL_ASPCA}?view=stepper`,
} as const;
/**
 * Supported full brand names.
 */
export const BrandFullName: Record<Brand, string> = {
    AKC: 'AKC - AKC Pet Insurance',
    PPI: 'PET - PetPartners, Inc.',
    FELIX: 'FLX - Felix Cat Insurance',
    FLX: 'FLX - Felix Cat Insurance',
    ORCA: 'ORCA',
    ORCA_GROUP: 'ORCA_GROUP',
    PPU_PRIME: 'Pets Plus Us - Prime',
    AKC_NEW: 'AKC - AKC Pet Insurance',
    PPI_NEW: 'PET - PetPartners, Inc.',
    PPU_CORE: 'Pets Plus Us - Core',
    PPU_CORE2: 'Pets Plus Us - Core 2',
    PPU: 'PPU - Pets Plus Us',
    ASPCA: 'ASPCA - ASPCA Pet Insurance',
    OPP: 'OPP - One Plan Pet Insurance',
    ORCA_CA: 'ORCA_CA - ORCA Canada'
};

/**
 * Maps short brand codes to their IDs.
 */
export const brandIdMap: Readonly<Record<Brand, string>> = {
    PPI: '1',
    AKC: '2',
    FELIX: '15',
    FLX: '15',
    ORCA: '',
    ORCA_GROUP: '',
    PPU_PRIME: '2003',
    AKC_NEW: '2',
    PPI_NEW: '1',
    PPU_CORE: '2001',
    PPU_CORE2: '2007',
    PPU: '',
    ASPCA: '0000',
    OPP: '0000',
    ORCA_CA: '',

};