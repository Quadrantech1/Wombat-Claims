import { CoverageUpgradesDisplay } from '@test-business-rules/coverage-upgrades-rules';
import { Brand } from '@utils/brand-util';

export interface PolicyPetTestParams {
    petAge: number;
    petTypeCode: number;
    breedName: string;
    petName?: string;
    planType?: 'custom' | 'basic';
    wellnessOptions?: CoverageUpgradesDisplay | string;
    upgrade1?: CoverageUpgradesDisplay;
    upgrade2?: CoverageUpgradesDisplay;
    upgrade3?: CoverageUpgradesDisplay;
    upgrade4?: CoverageUpgradesDisplay;
    coverageLimit?: string;
    deductible?: string;
    coinsurance?: string;
}

export interface CreatePolicyTestParams {
    marketDisplay: Brand;
    postalCode: string;
    email?: string;
    petsData: PolicyPetTestParams[];
}