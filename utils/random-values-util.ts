import { faker } from '@faker-js/faker';
import { logger } from './logger-util';

/**
 * Returns a random 7-digit numeric string
 */
export function getRandomValue(): string {
    const randomValue = faker.string.numeric(7);
    logger.info(`[random-values-util.getRandomValue] - Generated random value: ${randomValue}`);
    return randomValue;
}