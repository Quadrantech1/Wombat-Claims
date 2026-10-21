export interface SelectedLimits {
    coverageLimitId: number;
    incidentLimitId: number;
    deductibleId: number;
    coinsuranceId: number;
}

export interface SelectedProduct {
    stateFilingProductId: number;
    termDays: number;
}

export interface Coverage {
    selectedLimits: SelectedLimits;
    selectedProducts: SelectedProduct[];
}

export interface Pet {
    petId: number;
    petName: string;
    breedId: number;
    dob: string | number;
    qualifyingConditions: boolean;
    genderId: number | null;
    internalPetId: number | null;
    registrationNumber: string | null;
    salesforceId: string | null;
    weight: number | null;
    quotePetResponses: any[];
    coverage: Coverage;
}

export interface Customer {
    customerId: string | null;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string | null;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
}

export interface Payload {
    quoteGuid: string;
    marketChannelId: number;
    stateFilingId: number;
    effectiveOn: string;
    expiresOn: string | null;
    // currentPetId: number;
    currentCoveragePeriodId: number | null;
    serviceFee: number;
    partnerCode: string | null;
    postalCode: string;
    pets: Pet[];
    customer: Customer;
    discounts: any;
    agentId: number | null;
    customerSourceCode: string | null;
    customerSourceDetail: string | null;
}

export interface StepTwoResponseData {
    quoteGuid: string;
    postalCode: string;
    customer: Customer;
}

export interface StepTwoResponse {
    data: StepTwoResponseData;
}