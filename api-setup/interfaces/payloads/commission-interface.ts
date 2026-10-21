export interface Commission {
    producerName: string;
    nationalProducerNumber: string;
    subProducerNumber: string;
    subProducerName: string;
    subProducerAddress: string;
    subProducerCity: string;
    subProducerState: string;
    subProducerPostalCode: string;
    commissionMonthYear: string;
    invoicePaymentDate: string;
    appliedDate: string;
    commissionPercentage: number;
    commissionAmount: number;
    periodPremiumBilled: number;
    periodPremiumCollected: number;
    payrollStartDate: string;
    payrollEndDate: string;
    policyEffectiveDate: string;
    policyTerm: number;
    masterPolicyNumber: string;
    groupAccountName: string;
}
