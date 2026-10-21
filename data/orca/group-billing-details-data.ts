export interface GroupBillingDetails {
    groupName: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    contactAddress1: string;
    contactAddress2: string;
    city: string;
    state: string;
    postalCode: string;
}

export const getDefaultGroupBillingDetails = (): GroupBillingDetails => {
    return {
        groupName: 'Testing',
        contactName: 'Testing Name',
        contactEmail: 'testing@email.com',
        contactPhone: '(123)456-7899',
        contactAddress1: 'La Rioja St.',
        contactAddress2: 'La Pampa St.',
        city: 'Cypress',
        state: 'TX',
        postalCode: '77433'
    };
};
