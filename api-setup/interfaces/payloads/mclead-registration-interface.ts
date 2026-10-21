export interface Address {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    zip: string;
}

export interface Owner {
    firstName: string;
    middleName: string | null;
    lastName: string;
    address: Address;
    email: string;
    phone: string;
    spamOk: string;
    customerNumber: string | null;
}

export interface McleadRegistration {
    marketChannelId: number;
    ppiCertificateId: string;
    registrationNumber: string;
    name: string;
    sex: string;
    breedId: number;
    bvgCode: string;
    breedDescription: string;
    whelpDate: string | number;
    color: string;
    registrationDate: string;
    certificateIssueDate: string | null;
    sireRegistrationNumber: string;
    damRegistrationNumber: string;
    limited: string;
    documentType: string;
    dogOwnerIsLitterOwner: string;
    owners: Owner[];
    soldDate: string | null;
    storeIdentifier?: string;
    storeName?: string;
}
