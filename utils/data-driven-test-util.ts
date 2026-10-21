import { PublicApiClient } from '@api-setup/client/public-api-client';
import { QuoteEndpoints } from '@api-setup/endpoints/quote-endpoints';
import { QuoteDataHelper } from '@api-setup/helpers/quote-data-helper';
import { CreatePolicyTestParams, PolicyPetTestParams } from '@api-setup/interfaces/api-tests/create-policy-interface';
import { FIFTY_STATE_ZIP_CODES } from '@data/prod-release/fifty-state-zip-codes';
import { CoverageUpgradesDisplay, getEligibleUpgradesForAge } from '@test-business-rules/coverage-upgrades-rules';
import { COINSURANCES, COVERAGE_LIMITS, COVERAGE_LIMITS_FELIX, DEDUCTIBLES, DEDUCTIBLES_FELIX } from '@test-business-rules/plan-limit-rules';
import { Brand } from '@utils/brand-util';
import { logger } from '@utils/logger-util';
import { hash, seededChoice, seededRandom, weekKey } from '@utils/seeded-random-util';

/**
 * Internal function to generate pet policies with specified zip codes
 */
async function generatePetsWithZipCodes(
    publicApi: PublicApiClient,
    marketDisplay: Brand,
    zipCodes: string[],
    count: number,
    logPrefix: string,
    testSeed?: string
): Promise<CreatePolicyTestParams[]> {
    const seedPrefix = testSeed ? `${testSeed}|` : '';
    const marketChannelId = await QuoteDataHelper.getMarketChannelId(marketDisplay);
    const wk = weekKey();
    const isFelix = marketDisplay === 'FELIX' || marketDisplay === 'FLX';

    const policies: CreatePolicyTestParams[] = [];

    for (let i = 0; i < count; i++) {
        // Select zip code (random from array or single zip)
        const postalCode = zipCodes.length === 1
            ? zipCodes[0]
            : seededChoice(`${seedPrefix}${wk}|policy${i}|zip`, zipCodes);
        const stateCode = await QuoteDataHelper.getStateCodeByZip(publicApi, postalCode);

        logger.info(`[${logPrefix}] Policy ${i + 1}/${count} - Using zip: ${postalCode}, state: ${stateCode}`);

        const seed = `${seedPrefix}${marketDisplay}|${postalCode}|${wk}|policy${i}`;

        // Random species - FELIX is cat-only
        let species: string;
        if (isFelix) {
            species = 'Cat';
        } else {
            species = ((hash(seed + '|species') & 1) === 0) ? 'Dog' : 'Cat';
        }
        const speciesId = species === 'Dog' ? 1 : 2;

        // Get and select random breed
        const breedsResponse = await publicApi.get(
            QuoteEndpoints.GET_BREEDS(speciesId, stateCode),
            { marketChannelId }
        );
        if (!breedsResponse.data || breedsResponse.data.length === 0) {
            throw new Error(`[${logPrefix}] No breeds found for ${species} in ${stateCode}`);
        }
        const breedName = (seededChoice(seed + '|breed', breedsResponse.data) as any).display as string;

        // Random age (1-12 years)
        const petAge = 1 + seededRandom(seed + '|age', 12);

        // Plan type based on age - AO (9+) has no plan type. For FELIX (FLX) markets AI should always be 'custom' (no 'basic' option).
        const isAccidentOnly = petAge >= 9;
        const planType: 'basic' | 'custom' | undefined = isAccidentOnly
            ? undefined
            : isFelix
                ? 'custom'
                : ((hash(seed + '|plan') & 1) === 1 ? 'basic' : 'custom');

        const pet: PolicyPetTestParams = {
            petAge,
            petTypeCode: speciesId,
            breedName,
            ...(planType && { planType })
        };

        // Add custom limits for AI custom plans
        if (!isAccidentOnly && planType === 'custom') {
            pet.coverageLimit = seededChoice(seed + '|limit', isFelix ? [...COVERAGE_LIMITS_FELIX] : [...COVERAGE_LIMITS]);
            pet.deductible = seededChoice(seed + '|deduct', isFelix ? [...DEDUCTIBLES_FELIX] : [...DEDUCTIBLES]);
            pet.coinsurance = seededChoice(seed + '|coins', [...COINSURANCES]);
        }

        const allEligible = getEligibleUpgradesForAge(petAge);
        const isWellness = (u: CoverageUpgradesDisplay) => u === 'Defender' || u === 'DefenderPlus';
        const wellnessOptions = allEligible.filter(isWellness);
        const regularUpgrades = allEligible.filter(u => !isWellness(u));

        // Randomly select wellness option (50% chance if available)
        const selectedWellness = wellnessOptions.length > 0 && (hash(seed + '|hasWellness') & 1) === 1
            ? seededChoice(seed + '|wellness', wellnessOptions)
            : undefined;
        if (selectedWellness) pet.wellnessOptions = selectedWellness;

        // Shuffle and select regular upgrades (0 to all available)
        const shuffled = [...regularUpgrades];
        for (let j = shuffled.length - 1; j > 0; j--) {
            const k = seededRandom(seed + `|shuffle${j}`, j + 1);
            [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
        }

        const selectedUpgrades = shuffled.slice(0, seededRandom(seed + '|numUpgrades', regularUpgrades.length + 1));
        selectedUpgrades.forEach((upgrade, idx) => {
            pet[`upgrade${idx + 1}` as 'upgrade1' | 'upgrade2' | 'upgrade3' | 'upgrade4'] = upgrade;
        });

        // Build upgrade display string for logging
        const upgradesParts = [
            selectedWellness && `Wellness: ${selectedWellness}`,
            selectedUpgrades.length > 0 && `Upgrades: ${selectedUpgrades.join(', ')}`
        ].filter(Boolean);

        logger.info(
            `[${logPrefix}] Policy ${i + 1}/${count}: ${species}, ${breedName}, Age ${petAge}, ${planType || 'AO'}, ` +
            `${upgradesParts.length > 0 ? upgradesParts.join(', ') : 'No upgrades'}` +
            `${petAge < 9 ? ' + AlternativePlus (auto)' : ''}`
        );

        // Create policy with single pet
        policies.push({
            marketDisplay,
            postalCode,
            petsData: [pet]
        });
    }

    return policies;
}

/**
 * Generate random policies for testing with all business rules applied
 * @param publicApi PublicApiClient instance
 * @param marketDisplay Brand/market channel
 * @param count Number of policies to generate (1 pet per policy)
 * @param testSeed Optional seed string to differentiate between multiple seeded tests
 * @returns Array of CreatePolicyTestParams objects ready for createPolicyViaApi
 */
export async function generateRandomPets(
    publicApi: PublicApiClient,
    marketDisplay: Brand,
    count: number,
    testSeed?: string
): Promise<CreatePolicyTestParams[]> {
    return generatePetsWithZipCodes(publicApi, marketDisplay, FIFTY_STATE_ZIP_CODES, count, 'generateRandomPets', testSeed);
}

/**
 * Generate random pets for a specific state
 * @param publicApi PublicApiClient instance
 * @param marketDisplay Brand/market channel
 * @param stateZipCode Zip code for the specific state
 * @param count Number of policies to generate (1 pet per policy)
 * @param testSeed Optional seed string to differentiate between multiple seeded tests
 * @returns Array of CreatePolicyTestParams objects ready for createPolicyViaApi
 */
export async function generatePetsForState(
    publicApi: PublicApiClient,
    marketDisplay: Brand,
    stateZipCode: string,
    count: number,
    testSeed?: string
): Promise<CreatePolicyTestParams[]> {
    return generatePetsWithZipCodes(publicApi, marketDisplay, [stateZipCode], count, 'generatePetsForState', testSeed);
}

/**
 * Generate random pets for all 50 states in the USA
 * @param publicApi PublicApiClient instance
 * @param marketDisplay Brand/market channel
 * @param petsPerState Number of policies to generate per state (1 pet per policy)
 * @param testSeed Optional seed string to differentiate between multiple seeded tests
 * @returns Array of CreatePolicyTestParams objects ready for createPolicyViaApi
 */
export async function generatePetsForAllStates(
    publicApi: PublicApiClient,
    marketDisplay: Brand,
    petsPerState: number = 1,
    testSeed?: string
): Promise<CreatePolicyTestParams[]> {
    logger.info(`[generatePetsForAllStates] Starting: ${petsPerState} pet(s) per state × 50 states = ${petsPerState * 50} total for ${marketDisplay}`);

    const allPolicies: CreatePolicyTestParams[] = [];

    for (const stateZipCode of FIFTY_STATE_ZIP_CODES) {
        const stateCode = await QuoteDataHelper.getStateCodeByZip(publicApi, stateZipCode);
        const statePolicies = await generatePetsForState(
            publicApi,
            marketDisplay,
            stateZipCode,
            petsPerState,
            testSeed ? `${testSeed}|${stateCode}` : stateCode
        );
        allPolicies.push(...statePolicies);
    }

    logger.info(`[generatePetsForAllStates] Complete! Generated ${allPolicies.length} total policies across 50 states`);
    return allPolicies;
}
