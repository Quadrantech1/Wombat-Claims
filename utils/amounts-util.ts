/**
 * Extracts and sums all dollar amounts from a text string.
 * Examples:
 * - "$112.74" → "$112.74"
 * - "$112.74 /mo + $3.00 Service Fee" → "$115.74"
 * - "$1,352.90/yr" → "$1,352.90"
 * - "Payment amount: $31.55 + $3.00 Service Fee" → "$34.55"
 * 
 * @param text - The text containing one or more dollar amounts
 * @returns The total amount as a formatted string (e.g., "$115.74")
 */
export function extractTotalAmount(text: string): string {
    const cleanText = text.trim();
    const matches = cleanText.match(/\$[\d,]+\.?\d*/g);

    if (!matches || matches.length === 0) {
        throw new Error(`Could not find any dollar amounts in text: ${cleanText}`);
    }

    let totalAmount = 0;

    for (const match of matches) {
        const amount = parseFloat(match.replace(/[$,]/g, ''));
        totalAmount += amount;
    }

    return `$${totalAmount.toFixed(2)}`;
}

/**
 * Extracts only the first dollar amount from text (ignores service fees and additional amounts).
 * Examples:
 * - "$112.74 /mo + $3.00 Service Fee" → "$112.74"
 * - "$1,352.90/yr" → "$1,352.90"
 * 
 * @param text - The text containing a dollar amount
 * @returns The first amount as a formatted string (e.g., "$112.74")
 */
export function extractFirstAmount(text: string): string {
    const cleanText = text.trim();
    const match = cleanText.match(/\$([\d,]+\.?\d*)/);

    if (!match || !match[1]) {
        throw new Error(`Could not find dollar amount in text: ${cleanText}`);
    }

    return `$${match[1]}`;
}

/**
 * Calculates the final amount after applying one or more tax rates on top of a base amount.
 * Examples:
 * - calculateAmountWithTax(100, [0.05, 0.07]) → 112 (GST 5% + PST 7%)
 * - calculateAmountWithTax(100, [0.13]) → 113 (HST 13%)
 *
 * @param baseAmount - The submitted/base amount before tax
 * @param taxRates - One or more tax rates as decimals (e.g., 0.05 for 5%)
 * @returns The final amount with all tax rates applied
 */
export function calculateAmountWithTax(baseAmount: number, taxRates: number[]): number {
    const totalTaxRate = taxRates.reduce((sum, rate) => sum + rate, 0);
    return baseAmount * (1 + totalTaxRate);
}
