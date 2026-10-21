export interface ReimbursementOption {
    employeeReimbursementOptionId: number;
    employeeGeneratedNumber: string | null;
    employeeId: number;
    accountNumber: string;
    routingNumber: string;
    accountTypeId: number;
    bankName: string;
    active: boolean;
    createdOn: string;
    modifiedOn: string;
    secCodeId: number;
}
