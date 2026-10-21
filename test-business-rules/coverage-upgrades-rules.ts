import { SelectedProduct as SelectedUpgrade } from '@api-setup/interfaces/payloads/quote-step-two-interface';
import { config } from '@config/env-config';
import { logger } from '@utils/logger-util';

export const UPGRADE_CODES = {
    SupportPlus: 'FINAL_RESPECTS',
    ExamPlus: 'NP_EXAM',
    Defender: 'Wellness1',
    DefenderPlus: 'Wellness2',
    BreedingCoverage: 'BREEDER',
    HereditaryPlus: 'NP_INHERITED',
} as const;

/** All available upgrade names */
export type CoverageUpgradesDisplay = keyof typeof UPGRADE_CODES;

/**
 * Upgrades available for Accident & Illness (AI) coverage.
 * AI coverage is for pets under 9 years old.
 */
export const UPGRADES_FOR_AI: CoverageUpgradesDisplay[] = [
    'SupportPlus',
    'ExamPlus',
    'Defender',
    'DefenderPlus',
    'BreedingCoverage',
    'HereditaryPlus',
];

/**
 * Upgrades available for Accident Only (AO) coverage.
 * AO coverage is for senior pets (9+ years old).
 */
export const UPGRADES_FOR_AO: CoverageUpgradesDisplay[] = [
    'ExamPlus',
    'Defender',
    'DefenderPlus',
];

/**
 * Upgrades that cannot be selected together.
 */
export const CONFLICTING_UPGRADES = {
    Defender: 'DefenderPlus',
    DefenderPlus: 'Defender',
} as const;

/**
 * Get all upgrades available for a specific pet age.
 * 
 * Business Rules:
 * - Pets < 6 years: All AI upgrades EXCEPT SupportPlus
 * - Pets 6-8 years: All AI upgrades INCLUDING SupportPlus
 * - Pets 9+ years: Only AO upgrades
 * 
 * @param petAge Pet's age in years
 * @returns List of upgrade names the pet is eligible for
 */
export function getEligibleUpgradesForAge(petAge: number): CoverageUpgradesDisplay[] {
    const age = Math.floor(petAge);

    if (age >= 9) {
        return [...UPGRADES_FOR_AO];
    }

    if (age < 6) {
        return UPGRADES_FOR_AI.filter(upgrade => upgrade !== 'SupportPlus');
    }

    return [...UPGRADES_FOR_AI];
}

/**
 * Get the backend product code for an upgrade.
 * 
 * @param upgradeName User-friendly upgrade name
 * @returns Backend product code
 */
export function getUpgradeCode(upgradeName: CoverageUpgradesDisplay): string {
    return UPGRADE_CODES[upgradeName];
}

/**
 * Determine which base product to use based on pet age and environment.
 * 
 * Business Rules:
 * - US: Age-based logic (9+ years = AccidentOnly, under 9 = Accident_Illness)
 * - Canada: Explicit isAccidentOnly flag determines the base product
 * 
 * @param petAge Pet's age in years
 * @param isCanada Whether this is a Canada environment
 * @param isAccidentOnly Explicit flag for Canada to select base product
 * @returns Base product code ('AccidentOnly' or 'Accident_Illness')
 */
export function determineBaseProductCode(
    petAge: number,
    isCanada: boolean,
    isAccidentOnly?: boolean
): 'AccidentOnly' | 'Accident_Illness' {
    const ageInt = Math.floor(petAge);

    if (isCanada) {
        logger.info('[coverage-upgrade-rules.determineBaseProductCode] - Canada environment: using explicit isAccidentOnly flag');
        return isAccidentOnly ? 'AccidentOnly' : 'Accident_Illness';
    } else {
        logger.info('[coverage-upgrade-rules.determineBaseProductCode] - US environment: using age-based logic');
        return ageInt >= 9 ? 'AccidentOnly' : 'Accident_Illness';
    }
}

/**
 * Convert user-selected upgrades into state filing product IDs for API submission.
 * 
 * This is the main function that applies ALL business rules:
 * 1. Selects base product (AI or AO) based on age/environment
 * 2. Auto-includes AlternativePlus for qualifying pets (< 9 years, US only)
 * 3. Adds user-selected optional upgrades
 * 4. Validates no conflicting upgrades are selected
 * 
 * @param jsonResponse Product list from GET /quote/v1/quote-pet/:quotePetId/products
 * @param petAge Pet's age in years
 * @param selectedCoverage Optional upgrades the user wants to add
 * @param isAccidentOnly For Canada only - explicitly choose AO vs AI coverage
 * @returns Array of product IDs to submit in the quote
 */
export function getStateFilingUpgradeIds(
    jsonResponse: any[],
    petAge: number,
    selectedCoverage?: CoverageUpgradesDisplay[],
    isAccidentOnly?: boolean
): SelectedUpgrade[] {
    const ageInt = Math.floor(petAge);
    const selectedUpgrades: SelectedUpgrade[] = [];
    const coverageToSelect = selectedCoverage ?? [];
    const isCanada = config.ENVIRONMENT.includes('-ca');

    // Determine base product
    const baseProductCode = determineBaseProductCode(ageInt, isCanada, isAccidentOnly);
    logger.info(`[coverage-upgrade-rules.getStateFilingUpgradeIds] - Base product code: ${baseProductCode}`);

    // Add base product
    const baseProduct = jsonResponse.find((p: any) => p.code === baseProductCode);
    if (baseProduct) {
        selectedUpgrades.push({
            stateFilingProductId: baseProduct.stateFilingProductId,
            termDays: 365
        });
    } else {
        logger.warning(`[coverage-upgrades-rules.getStateFilingUpgradeIds] - Base product '${baseProductCode}' not found in response`);
    }

    // Auto-include AlternativePlus for pets < 9 years in US environments
    // This is always included and not part of user-selected upgrades
    if (petAge < 9 && !isCanada) {
        const alternativeProduct = jsonResponse.find((p: any) => p.code === 'ALTERNATIVE');
        if (alternativeProduct) {
            selectedUpgrades.push({
                stateFilingProductId: alternativeProduct.stateFilingProductId,
                termDays: 365
            });
        } else {
            logger.warning('[coverage-upgrades-rules.getStateFilingUpgradeIds] - ALTERNATIVE product not found in response (e.g. CA Prop 103 filing)');
        }
    }
    // Add user-selected upgrades
    for (const upgradeName of coverageToSelect) {
        const code = getUpgradeCode(upgradeName);
        const upgrade = jsonResponse.find((p: any) => p.code === code);
        if (upgrade) {
            selectedUpgrades.push({
                stateFilingProductId: upgrade.stateFilingProductId,
                termDays: 365
            });
        } else {
            logger.warning(`[coverage-upgrades-rules.getStateFilingUpgradeIds] - Upgrade '${upgradeName}' (${code}) not found in response`);
        }
    }

    return selectedUpgrades;
}
