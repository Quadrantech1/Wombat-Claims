export interface SidneyWellnessOption {
    code: string;
    level?: string;
    marketingName?: string;
    price?: number;
    calculatedTax?: number;
    wellnessItems?: any[];
}

export interface SidneyAnnualLimitOption {
    limit: string;
    limitFormatted?: string;
    priceDifference?: number;
    calculatedTax?: number;
}

export interface SidneyPetOption {
    code: string;
    level?: string;
    deductible?: string;
    copay?: string;
    basePrice?: number;
    adjustedPrice?: number;
    marketingName?: string;
    price?: number;
    version?: string;
    minorVersion?: number;
    annualLimitAvailability?: string;
    wellnessOptions?: SidneyWellnessOption[];
    annualLimitOptions?: SidneyAnnualLimitOption[];
}

/**
 * GET /quotes/{quoteId}/pets/{petId}/options returns an object with a 'policies' array.
 * Each entry in policies is a SidneyPetOption with nested wellnessOptions and annualLimitOptions.
 */
export interface SidneyPetOptionsResponse {
    policies: SidneyPetOption[];
    userCanEdit?: boolean;
    ratingDate?: string;
}
