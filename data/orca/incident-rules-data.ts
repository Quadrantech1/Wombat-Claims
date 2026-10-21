export interface IncidentRulesEntity {
    incidentType: string;
    denialReason: string;
    documentVersion: string;
    denialCode: string;
    incidentLimitValue: string;
    limitFrequency: string;
    individualProductType: string;
    groupProductType: string;
    hasCoinsurance: boolean;
    hasDeductible: boolean;
}

/**
 * Gets default incident rules data for testing
 */
export function getDefaultIncidentRulesData(): IncidentRulesEntity {
    return {
        incidentType: 'Abscess',
        denialReason: `Automation Test`,
        documentVersion: '006',
        denialCode: 'Alternative',
        incidentLimitValue: '0',
        limitFrequency: 'Annual',
        individualProductType: 'Base',
        groupProductType: 'Allowance',
        hasCoinsurance: true,
        hasDeductible: true,
    };
}
