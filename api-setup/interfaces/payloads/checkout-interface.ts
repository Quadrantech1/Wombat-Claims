export interface Checkout {
    quoteGuid: string;
    customerId: string | null;
    policyTermId: number;
    ignoreBillingInfo: boolean;
    eConsent: boolean;
    feeDisclosure: boolean;
    isElectronicDelivery: boolean;
    postalCode: string;
    address1: string;
    address2: string | null;
    phone: string;
    firstName: string;
    lastName: string;
    city: string;
    stateCode?: string;
    paymentProviderCustomerId: string | null;
    paymentMethod: string | null;
    paymentProviderId: string | null;
    paymentTypeId: string | null;
    paymentFrequencyId?: number;
    institutionNumber?: string | null;
    transitNumber?: string | null;
    accountNumber?: string | null;

}
