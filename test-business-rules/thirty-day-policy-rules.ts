/**
 * States excluded from 30-day policies.
 * Business Rule: 30-day policies are not available in New York, California, and Washington.
 */
export const THIRTY_DAY_EXCLUDED_STATES = ['NY', 'CA', 'WA'] as const;

/**
 * Zip code ranges for states excluded from 30-day policies.
 * - New York (NY): 10000-14999
 * - California (CA): 90000-96199
 * - Washington (WA): 98000-99499
 */
export const THIRTY_DAY_EXCLUDED_ZIP_RANGES = [
    { state: 'NY', min: 10000, max: 14999 },
    { state: 'CA', min: 90000, max: 96199 },
    { state: 'WA', min: 98000, max: 99499 },
] as const;

/**
 * Check if a zip code is allowed for 30-day policies.
 * Business Rule: Zip codes in NY, CA, and WA are excluded from 30-day policies.
 * 
 * @param zipCode Zip code as string or number
 * @returns True if zip code is allowed for 30-day policies
 */
export function isZipAllowedForThirtyDayPolicy(zipCode: string | number): boolean {
    const zipInt = typeof zipCode === 'string' ? parseInt(zipCode, 10) : zipCode;

    for (const range of THIRTY_DAY_EXCLUDED_ZIP_RANGES) {
        if (zipInt >= range.min && zipInt <= range.max) {
            return false;
        }
    }

    return true;
}

/**
 * Filter a list of zip codes to only those allowed for 30-day policies.
 * 
 * @param zipCodes Array of zip codes
 * @returns Filtered array of zip codes allowed for 30-day policies
 */
export function filterZipCodesForThirtyDayPolicies(zipCodes: string[]): string[] {
    return zipCodes.filter(isZipAllowedForThirtyDayPolicy);
}
