export interface CustomPlanData {
    coverageType?: 'basic' | 'custom';
    annualCoverage?: string;
    deductible?: string;
    reimbursement?: string;
    incidentLimit?: string;
}

export interface UpgradeData {
    examPlus?: boolean | null;
    breedingCoverage?: boolean | null;
    supportPlus?: boolean | null;
    wellnessCoverage?: 'defender' | 'defenderPlus' | 'none';
    hereditaryPlus?: boolean | null;
}

export const getDefaultCustomPlanData = (): CustomPlanData => {
    return {
        coverageType: 'custom',
        annualCoverage: '$10,000',
        deductible: '$250',
        reimbursement: '80%'
    };
};

export const getDefaultUpgradeData = (): UpgradeData => {
    return {
        wellnessCoverage: 'none',
        examPlus: false,
        supportPlus: null,
        breedingCoverage: null,
        hereditaryPlus: null
    };
};
