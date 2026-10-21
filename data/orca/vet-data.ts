export interface VetData {
    vetName?: string;
    address1?: string;
    address2?: string;
    fax?: string;
    prefDeliveryMethod?: string;
    notes?: string;
    city?: string;
    postalCode?: string;
    stateProvince?: string;
    phone?: string;
    email?: string;
}

export const getDefaultVetData = (): VetData => {
    return {
        stateProvince: 'Florida',
        postalCode: '32401'
    };
};

export interface SearchVetData {
    vetName?: string;
    phone?: string;
    city?: string;
    postalCode?: string;
    stateProvince?: string;
}
