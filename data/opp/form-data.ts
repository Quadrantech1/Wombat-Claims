export interface OppPdfDownloadFormData {
    firstName: string;
    lastName: string;
    workEmail: string;
    phone?: string;
    companyRole: string;
    jobTitle?: string;
    companyName?: string;
    corporateHqState: string;
}

export function getDefaultOppPdfDownloadFormData(): OppPdfDownloadFormData {
    return {
        firstName: 'QA',
        lastName: 'Tester',
        workEmail: 'qa@yopmail.com',
        companyRole: 'Insurance Broker',
        corporateHqState: 'HI',
    };
}
