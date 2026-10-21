/** GST + PST/HST rates by Canadian province/territory, as decimals (e.g., 0.05 for 5%) */
export const CANADA_PROVINCE_TAX_RATES: Record<string, number[]> = {
    Alberta: [0.05],
    'British Columbia': [0.05, 0.07],
    Manitoba: [0.05, 0.07],
    'New Brunswick': [0.15],
    'Newfoundland and Labrador': [0.15],
    'Northwest Territory': [0.05],
    'Nova Scotia': [0.14],
    Nunavut: [0.05],
    Ontario: [0.13],
    'Prince Edward Island': [0.15],
    Quebec: [0.05, 0.09975],
    Saskatchewan: [0.05, 0.06],
    'Yukon Territory': [0.05],
};

/**
 * Get the applicable tax rates (GST/PST/HST) for a given Canadian province/territory.
 * @param province Province/territory name as used in the vet-search province selector
 * @returns Array of tax rates as decimals, for use with calculateAmountWithTax
 */
export function getTaxRatesForProvince(province: string): number[] {
    const rates = CANADA_PROVINCE_TAX_RATES[province];
    if (!rates) {
        throw new Error(`[canada-tax-rules.getTaxRatesForProvince] - No tax rates defined for province: ${province}`);
    }
    return rates;
}
