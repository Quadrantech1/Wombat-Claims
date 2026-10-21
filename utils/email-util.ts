import { config } from '@config/env-config';

/**
 * Generate a test email (e.g. "Sanity73623812@rvyo5ez1.mailosaur.net").
 * @param prefix Optional prefix for the email-part (e.g. "Sanity")
 * @param randomValue random value to ensure uniqueness
 */
export function generateMailosaurEmail(prefix: string, randomValue: string): string {
    const email = `${prefix}${randomValue}`;
    return `${email}${config.EMAIL_DOMAIN}`;
}