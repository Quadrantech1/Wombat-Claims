import { SidneyAddress, SidneyBreed } from './sidney-common-interface';

export interface SidneyWellnessInfo {
    level: string;
    marketingName?: string;
    price?: number;
    calculatedTax?: number;
    code: string;
    wellnessItems?: any[];
}

export interface SidneyAnnualLimitInfo {
    limit: string;
    priceDifference?: number;
    calculatedTax?: number;
    limitFormatted?: string;
}

export interface SidneySelectedPolicy {
    code: string;
    discounts?: any[];
    version?: string;
    minorVersion?: number;
    level?: string;
    copay?: string;
    deductible?: string;
    wellness?: SidneyWellnessInfo;
    annualLimit?: SidneyAnnualLimitInfo;
    basePrice?: number;
    adjustedPrice?: number;
    cceBasePrice?: number;
    cceAdjustedPrice?: number;
    cheBasePrice?: number;
    cheAdjustedPrice?: number;
    totalBasePrice?: number;
    totalAdjustedPrice?: number;
    totalAdjustedPriceLM?: number;
    tax?: number;
    firstMonthAdjustedPrice?: number;
    marketingName?: string;
    optionalExclusions?: any[];
}

export interface SidneyPet {
    petId?: string;
    name: string;
    breed: SidneyBreed;
    color?: string;
    birthDate: string;
    age?: number;
    gender: string;
    isSpayedOrNeutered?: boolean;
    selectedPolicy?: SidneySelectedPolicy;
    invoiceFee?: number;
    enrolledPetId?: number;
    exclusions?: any[];
    accountId?: number;
    frequencyTotalAdjustedPrice?: number;
    isExpanded?: boolean;
}

export interface SidneyBillingInformation {
    billingType?: string;
    billingFrequency?: string;
    creditCardType?: string;
    nameOnAccount?: string;
    usePlatformAccount?: boolean;
    expirationDate?: string | Record<string, any>;
    stripeConfirmationToken?: string | null;
    accountNumber?: string | null;
    accountNumberLast4?: string | null;
    routingNumber?: string | null;
    customerId?: string | null;
    paymentMethodId?: string | null;
}

export interface SidneyUpdateQuotePayload {
    quoteId: string;
    pets: SidneyPet[];
    emailAddress: string;
    brand: string;
    effectiveDate: string;
    mailingAddress?: SidneyAddress;
    ratingAddress?: SidneyAddress;
    billingAddress?: SidneyAddress;
    billingInformation?: SidneyBillingInformation;
    goPaperless?: boolean;
    allowMarketing?: boolean;
    isMilitary?: boolean;
    isSalesQuote?: boolean;
    allowSMS?: boolean;
    preferredLanguage?: string;
    callStatusId?: number;
    quoteStatus?: string;
    transactionFee?: number;
    totalTax?: number;
    baseTotal?: number;
    quoteTotal?: number;
    enrollmentFee?: number;
    petOwnerId?: number;
    productVersion?: string;
    minorVersion?: number;
    scratchPad?: Array<{ key: string; value?: string }>;
    accidentEffectiveDate?: string;
    hereditaryEffectiveDate?: string;
    illnessEffectiveDate?: string;
    isOpenInSalesScript?: boolean;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    marketCode?: string;
}

export interface SidneyQuoteResponse {
    quoteId: string;
    pets: SidneyPet[];
    emailAddress: string;
    brand: string;
    effectiveDate: string;
    accountNumber?: string;
    mailingAddress?: SidneyAddress;
    ratingAddress?: SidneyAddress;
    billingAddress?: SidneyAddress;
    billingInformation?: SidneyBillingInformation;
    goPaperless?: boolean;
    allowMarketing?: boolean;
    isMilitary?: boolean;
    isSalesQuote?: boolean;
    allowSMS?: boolean;
    preferredLanguage?: string;
    callStatusId?: number;
    quoteStatus?: string;
    transactionFee?: number;
    totalTax?: number;
    baseTotal?: number;
    quoteTotal?: number;
    enrollmentFee?: number;
    petOwnerId?: number;
    productVersion?: string;
    minorVersion?: number;
    scratchPad?: Array<{ key: string; value?: string }>;
    accidentEffectiveDate?: string;
    hereditaryEffectiveDate?: string;
    illnessEffectiveDate?: string;
    isOpenInSalesScript?: boolean;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    marketCode?: string;
}
