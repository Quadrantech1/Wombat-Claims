/** Available coverage limit options */
export const COVERAGE_LIMITS = ['$2,500', '$5,000', '$7,500', '$10,000', '$15,000', '$20,000', '$25,000', 'Unlimited'] as const;

/** Available deductible options */
export const DEDUCTIBLES = ['$100', '$250', '$300', '$400', '$500', '$600', '$750', '$1000'] as const;

/** Available coinsurance options (displayed as patient responsibility) */
export const COINSURANCES = ['10%', '20%', '30%'] as const;

/** Felix-specific coverage limits (do not modify original COVERAGE_LIMITS) */
export const COVERAGE_LIMITS_FELIX = ['$1,000', '$2,500', '$5,000', '$7,500', '$10,000'] as const;

/** Felix-specific deductible options (do not modify original DEDUCTIBLES) */
export const DEDUCTIBLES_FELIX = ['$100', '$250', '$500'] as const;


/** Default limits for Accident Only (AO) plans (pets >= 9 years in US) */
export const ACCIDENT_ONLY_DEFAULT_LIMITS = {
    coverageLimit: 'Unlimited',
    deductible: '$100',
    coinsurance: '10%',
    incidentLimit: 'Unlimited',
} as const;

/** Default limits for Basic AI plans */
export const BASIC_PLAN_DEFAULT_LIMITS = {
    coverageLimit: 'Unlimited',
    deductible: '$100',
    coinsurance: '20%',
    incidentLimit: '$500',
} as const;

/** Default limits for Custom AI plans */
export const CUSTOM_PLAN_DEFAULT_LIMITS = {
    coverageLimit: '$10,000',
    deductible: '$250',
    coinsurance: '20%',
    incidentLimit: 'Unlimited',
} as const;

/** Default limits for Canada Custom AI plans (CA state filings don't offer $10,000 coverage/$250 deductible) */
export const CANADA_PLAN_DEFAULT_LIMITS = {
    coverageLimit: '$7,500',
    deductible: '$300',
    coinsurance: '20%',
    incidentLimit: 'Unlimited',
} as const;

/**
 * Get default limits for a given plan type and pet age.
 * Business Rules:
 * - Canada: Always uses custom limits (overrides allowed)
 * - US Accident Only (age >= 9): Unlimited coverage, $100 deductible, 10% coinsurance
 * - US Basic Plan: Unlimited coverage, $100 deductible, 20% coinsurance, $500 incident limit
 * - US Custom Plan: $10,000 coverage, $250 deductible, 20% coinsurance
 * 
 * @param planType Plan type ('basic', 'custom', or undefined for AO)
 * @param petAge Pet age in years
 * @param isCanada Whether this is a Canada environment
 * @returns Default limit values for the plan
 */
export function getDefaultLimitsForPlan(
    planType: 'basic' | 'custom' | undefined,
    petAge: number,
    isCanada: boolean = false
): typeof ACCIDENT_ONLY_DEFAULT_LIMITS | typeof BASIC_PLAN_DEFAULT_LIMITS | typeof CUSTOM_PLAN_DEFAULT_LIMITS | typeof CANADA_PLAN_DEFAULT_LIMITS {
    const ageInt = Math.floor(petAge);
    const isAccidentOnly = ageInt >= 9;

    // Canada always uses custom limits (overrides allowed)
    if (isCanada) {
        return CANADA_PLAN_DEFAULT_LIMITS;
    }

    // US logic: age-based for undefined planType, explicit for basic/custom
    if (isAccidentOnly && planType === undefined) {
        return ACCIDENT_ONLY_DEFAULT_LIMITS;
    } else if (planType === 'basic') {
        return BASIC_PLAN_DEFAULT_LIMITS;
    } else {
        return CUSTOM_PLAN_DEFAULT_LIMITS;
    }
}
