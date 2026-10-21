export interface Pet {
    petName: string;
    breedId: number;
    petId?: number;
    dob: string | number;
    genderId: number | null;
    weight: number | null;
    coverage: any | null;
    salesForceId: string | null;
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
    marketChannelId: number;
    effectiveOn: string;
    postalCode: string;
    partnerCode: string | null;
    pets: Pet[];
    customer: Customer;
    discounts: any | null;
    customerSourceCode: string | null;
    customerSourceDetail: string | null;
}

export interface StepOneResponseData {
    quoteGuid: string;
    stateFilingId: number;
    marketChannelId: number;
    effectiveOn: string;
    pets: Pet[];
    customer: Customer;
}

export interface StepOneResponse {
    data: StepOneResponseData;
}
