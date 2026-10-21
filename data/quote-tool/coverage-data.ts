export interface CoverageData {
    coverageType?: 'basic' | 'custom';
    deductible?: string;
    coinsurance?: string;
    annualLimit?: string;
    incidentLimit?: string;
}

export interface UpgradeData {
    ExamPlus?: boolean;
    BreedingCoverage?: boolean;
    SupportPlus?: boolean;
    DefenderPlus?: boolean;
    Defender?: boolean;
    HereditaryPlus?: boolean;
}

export const getDefaultCoverageData = (): CoverageData => {
    return {
        coverageType: 'custom',
        deductible: '$250',
        coinsurance: '20%',
        annualLimit: '$10,000'
    };
};

export const getDefaultUpgradeData = (): UpgradeData => {
    return {
        ExamPlus: false,
        BreedingCoverage: false,
        SupportPlus: false,
        DefenderPlus: false,
        Defender: false,
        HereditaryPlus: false
    };
};
