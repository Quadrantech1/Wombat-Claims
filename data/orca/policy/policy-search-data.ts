export interface PolicySearchData {
    marketChannel?: string;
    policyNumber?: string;
    postalCode?: string;
    lastName?: string;
    emailAddress?: string;
    phoneNumber?: string;
    billingId?: string;
    registrationNumber?: string;
    linkedPolicy?: string;
    petName?: string;
}

export function getDefaultPolicySearchData(): PolicySearchData {
    return {
        marketChannel: '',
        policyNumber: '',
        postalCode: '',
        lastName: '',
        emailAddress: '',
        phoneNumber: '',
        billingId: '',
        registrationNumber: '',
        linkedPolicy: '',
        petName: '',
    };
}