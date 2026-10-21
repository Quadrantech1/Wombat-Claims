export interface Distributor {
    name?: string;
    address1?: string;
    Address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
}

export interface GroupPet {
    petCertificateNumber: string;
    petStatus: string;
    certificateEffectiveDate: string;
    certificateTerminationDate: string | null;
    petName: string;
    species: string;
    breed: string;
    age: number;
    adultWeight: number;
    planName: string;
    planType: string;
    premium: number;
    preExistingConditionLimit: number;
    injuriesWaitingPeriod: number;
    illnessesWaitingPeriod: number;
    orthopedicWaitingPeriod: number;
    annualPolicyLimit: number;
    annualDeductible: number;
    diminishingDeductible: number;
    coinsurance: number;
    perIncidentCopay: number;
    rehabPhysicalTherapy: boolean;
    priorCoverageCredit: boolean;
    officeExamsTelehealthConsult: boolean;
    petOwnersAssistance: boolean;
    alternativeCare: boolean;
    alternativeBehavioralCare: boolean;
    routineDental: number;
    finalRespects: number;
    inheritedCongenital: boolean;
    wellness: string;
    enrollmentType: string;
}

export interface GroupEmployee {
    certificateNumber?: string;
    employeeGeneratedNumber: string;
    employeeStatus: string;
    eligibleClass: string;
    lastName: string;
    firstName: string;
    middleName: string;
    streetNumber: string;
    address1: string;
    address2: string;
    address2type: string;
    city: string;
    state: string;
    zip: string;
    phoneNumber: string;
    emailAddress: string;
    preferredEmail?: string;
    electronicConsent: boolean;
    sendNotification: boolean;
    enrollmentType: string;
    enrollmentTypeId: string | null;
    coverageStartDate: string;
    coverageEndDate: string;
    numberOfPets?: number | null;
    numberOfCats?: number | null;
    numberOfDogs?: number | null;
    pets: GroupPet[];
}

export interface Payload {
    masterPolicyNumber: string;
    masterPolicyStatus: string;
    initialEnrolmentWaitingPeriod: number;
    employerName: string;
    employerGeneratedNumber: string;
    situsState: string;
    masterPolicyEffectiveDate: string;
    masterPolicyTermDate: string | null;
    masterPolicyRenewalDate: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    groupContactPhoneNumber: string;
    agencyCode: string;
    distributor: Distributor | null;
    employees: GroupEmployee[];
}