export interface DiagnosisDetail {
    diagnosis: string;
    onsetDate: string;
    treatmentStartDate: string;
}

export interface Diagnosis {
    additionalInsurance: string;
    additionalInsuranceCompanyName: string;
    diagnoses: DiagnosisDetail[];
    petId: string;
    petName: string;
    petSelected: boolean;
}

export interface ClaimSubmit {
    customer: any;
    policyId: string | null;
    claimId: number;
    employeeGeneratedNumber: string;
    tempAttachmentFilePath: string;
    diagnoses: Diagnosis[];
}
