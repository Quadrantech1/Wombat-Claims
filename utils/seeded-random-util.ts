/**
 * Deterministic hash function for seeded random generation
 * @param s Input string to hash
 * @returns Positive integer hash value
 */
export function hash(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
}

/**
 * Get the week key (Monday date) for a given date or current date
 * Format: YYYYMMDD (e.g., "20251013" for Monday, October 13, 2025)
 * @param ref Optional reference date (defaults to current date)
 * @returns Week key string
 */
export function weekKey(ref?: Date): string {
    const d = ref ?? new Date();
    const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
    return `${monday.getFullYear()}${String(monday.getMonth() + 1).padStart(2, '0')}${String(monday.getDate()).padStart(2, '0')}`;
}

/**
 * Generate a seeded random number
 * @param seed Seed string for deterministic randomness
 * @param max Maximum value (exclusive)
 * @returns Random number between 0 and max-1
 */
export function seededRandom(seed: string, max: number): number {
    return hash(seed) % max;
}

/**
 * Select a random item from an array using a seed
 * @param seed Seed string for deterministic randomness
 * @param array Array to select from
 * @returns Randomly selected item from the array
 */
export function seededChoice<T>(seed: string, array: T[]): T {
    return array[seededRandom(seed, array.length)];
}
