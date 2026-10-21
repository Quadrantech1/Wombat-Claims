export interface FelixCoverageData {
    planType?: 'basic' | 'custom';
    annualCoverage?: string;
    annualDeductible?: string;
    reimbursement?: string;
    incidentLimit?: string;
}

export interface FelixUpgradeData {
    wellnessCoverage?: 'basic' | 'prime' | 'none';
    examCareCoverage?: boolean;
    inheritedAndCongenitalCareCoverage?: boolean | null;
    breedingCoverage?: boolean | null;
    finalRespectsCoverage?: boolean | null;
}

export const getDefaultFelixCoverageData = (): FelixCoverageData => {
    return {
        annualCoverage: '$2,500',
        annualDeductible: '$500',
        reimbursement: '80%',
    };
};

export const getDefaultFelixUpgradeData = (): FelixUpgradeData => {
    return {
        wellnessCoverage: 'none',
        examCareCoverage: false,
        inheritedAndCongenitalCareCoverage: null,
        breedingCoverage: null,
        finalRespectsCoverage: null
    };
};
