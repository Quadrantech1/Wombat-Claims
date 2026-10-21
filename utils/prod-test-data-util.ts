import { CAT_BREEDS } from '@data/prod-release/cat-breeds';
import { DOG_BREEDS } from '@data/prod-release/dog-breeds';
import { ZIP_CODES } from '@data/prod-release/zip-codes';
import { filterZipCodesForThirtyDayPolicies } from '@test-business-rules/thirty-day-policy-rules';
import { hash, weekKey } from '@utils/seeded-random-util';

type Species = 'Dog' | 'Cat';

interface WeeklyPetData {
    age: number;
    species: Species;
    breed: string;
    zipCode: string;
}

// Use business rule to filter zip codes for 30-day policies
const THIRTY_DAY_ALLOWED_ZIPS = filterZipCodesForThirtyDayPolicies(ZIP_CODES);

function buildWeeklyPetData(
    scenarioKey: string,
    ref: Date | undefined,
    ageMin: number,
    ageMax: number,
    zipPool: string[]
): WeeklyPetData {
    const wk = weekKey(ref);
    const base = `${scenarioKey}|${wk}`;
    const species: Species = (hash(base + '|species') & 1) === 0 ? 'Dog' : 'Cat';
    const breeds = species === 'Dog' ? DOG_BREEDS : CAT_BREEDS;
    const age = ageMin + (hash(base + '|age') % (ageMax - ageMin + 1));
    const breed = breeds[hash(base + '|breed') % breeds.length];
    const zipCode = zipPool[hash(base + '|zip') % zipPool.length];
    return { age, species, breed, zipCode };
}

export function buildWeeklyThirtyDayPetData(scenarioKey: string, ref?: Date): WeeklyPetData {
    return buildWeeklyPetData(scenarioKey, ref, 1, 8, THIRTY_DAY_ALLOWED_ZIPS);
}

export function buildWeeklyQuotePolicyPetData(scenarioKey: string, ref?: Date): WeeklyPetData {
    return buildWeeklyPetData(scenarioKey, ref, 9, 15, ZIP_CODES);
}