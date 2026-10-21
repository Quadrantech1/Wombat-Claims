export interface UpgradeData {
    ExamPlus?: boolean;
    BreedingCoverage?: boolean;
    SupportPlus?: boolean;
    DefenderPlus?: boolean;
    Defender?: boolean;
    HereditaryPlus?: boolean;
}

export interface CustomizePlanData {
    deductible?: string;
    coinsurance?: string;
    annualLimit?: string;
    upgradeOptions?: UpgradeData;
}

export const getDefaultCustomizePlanData = (): CustomizePlanData => {
    return {
        deductible: '$250',
        coinsurance: '20%',
        annualLimit: '$5,000',
    };
}

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
