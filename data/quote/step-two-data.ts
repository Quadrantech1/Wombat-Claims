export interface CustomPlanData {
    coverageType?: 'accidentAndIllness' | 'accident' | 'basic' | 'custom';
    annualCoverage?: string;
    deductible?: string;
    reimbursement?: string;
}

export const getDefaultPpuCustomPlanData = (): CustomPlanData => {
    return {
        coverageType: 'accidentAndIllness', //accidentAndIllness' | 'accident'
        annualCoverage: '$7,500',
        deductible: '$200',
        reimbursement: '80%'
    };
};

export const getDefaultCustomPlanData = (): CustomPlanData => {
    return {
        coverageType: 'custom', // 'basic' | 'custom'
        annualCoverage: '$10,000',
        deductible: '$250',
        reimbursement: '80%'
    };
};

export interface UpgradeData {
    ExamPlus?: boolean;
    BreedingCoverage?: boolean;
    SupportPlus?: boolean;
    Wellness?: 'DefenderPlus' | 'Defender' | 'none';
    HereditaryPlus?: boolean;
}

export const getDefaultUpgradeData = (): UpgradeData => {
    return {
        ExamPlus: false,
        BreedingCoverage: false,
        SupportPlus: false,
        Wellness: 'none',
        HereditaryPlus: false
    };
};
