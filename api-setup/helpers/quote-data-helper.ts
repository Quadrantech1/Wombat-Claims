import { BaseApiClient } from '@api-setup/client/base-api-client';
import { QuoteEndpoints } from '@api-setup/endpoints/quote-endpoints';
import { SelectedLimits, SelectedProduct } from '@api-setup/interfaces/payloads/quote-step-two-interface';
import { config } from '@config/env-config';
import { expect } from '@playwright/test';
import { CoverageUpgradesDisplay, getStateFilingUpgradeIds } from '@test-business-rules/coverage-upgrades-rules';
import { getDefaultLimitsForPlan } from '@test-business-rules/plan-limit-rules';
import { Brand, brandIdMap } from '@utils/brand-util';
import { getAgeFromDateString } from '@utils/date-util';
import { logger } from '@utils/logger-util';
import { InternalApiClient } from './../client/internal-api-client';
import { AdminEndpoints } from './../endpoints/admin-endpoints';


export class QuoteDataHelper {
    /**
     * Get state code by zip code using the GET_STATE_BY_ZIP endpoint.
     * @param publicApi The API client to use.
     * @param zipCode The zip code to look up.
     * @returns The state code as a string.
     */
    static async getStateCodeByZip(publicApi: BaseApiClient, zipCode: string): Promise<string> {
        logger.info(`[QuoteDataHelper.getStateCodeByZip] - Fetching state code for zip code: ${zipCode}`);
        const response = await publicApi.get(QuoteEndpoints.GET_STATE_BY_ZIP(zipCode));
        // Use the correct property 'code' for state code
        if (!response?.data.code) {
            throw new Error('[QuoteDataHelper.getStateCodeByZip] - State code not found for zip code ' + zipCode);
        }
        return response.data.code;
    }

    /**
     * Get the breedId for a given pet type and breed name.
     * Fetches all breeds for the pet type and finds the matching breed by display name.
     * @param publicApi The API client to use.
     * @param petType The pet type code (e.g., 1 for dog, 2 for cat).
     * @param breedName The display name of the breed.
     * @param stateCode The state code.
     * @param marketChannelId The market channel ID.
     * @returns The breedId for the given breed name.
     */
    static async getBreedId(publicApi: BaseApiClient, petType: number, breedName: string, stateCode: string, marketChannelId: number): Promise<number> {
        logger.info(`[QuoteDataHelper.getBreedId] - Fetching breed ID for petType: ${petType}, breedName: ${breedName}, stateCode: ${stateCode}, marketChannelId: ${marketChannelId}`);
        const breeds = await publicApi.get(QuoteEndpoints.GET_BREEDS(petType, stateCode), { marketChannelId });

        const breed = breeds.data.find((b: any) => b.display === breedName);
        if (!breed) throw new Error('[QuoteDataHelper.getBreedId] - Breed ' + breedName + ' not found');
        logger.info(`[QuoteDataHelper.getBreedId] - Found breed ID: ${breed.breedId}`);
        return breed.breedId;
    }

    /**
    * Efficiently resolves breedIds for a list of pets.
    * Fetches breed lists only once per unique petTypeCode.
    * @param publicApi API client
    * @param pets Array of pets with petTypeCode and breedName
    * @param stateCode State code
    * @param marketChannelId Market channel ID
    * @returns Map of { '<petTypeCode>:<breedName>': breedId }
    */
    static async getBreedIdMapForPets(
        publicApi: BaseApiClient,
        pets: { petTypeCode: number; breedName: string }[],
        stateCode: string,
        marketChannelId: number
    ): Promise<Record<string, number>> {
        logger.info(`[QuoteDataHelper.getBreedIdMapForPets] - Fetching breed IDs for ${pets.length} pets in state ${stateCode} with market channel ID ${marketChannelId}`);
        let hasDog = false;
        let hasCat = false;

        for (const pet of pets) {
            if (pet.petTypeCode === 1) hasDog = true;
            if (pet.petTypeCode === 2) hasCat = true;
        }

        let breedList: any[] = [];
        if (hasDog) {
            const dogBreeds = await publicApi.get(QuoteEndpoints.GET_BREEDS(1, stateCode), { marketChannelId });
            breedList = breedList.concat(dogBreeds.data);
        }
        if (hasCat) {
            const catBreeds = await publicApi.get(QuoteEndpoints.GET_BREEDS(2, stateCode), { marketChannelId });
            breedList = breedList.concat(catBreeds.data);
        }

        const breedIdMap: Record<string, number> = {};
        for (const [index, pet] of pets.entries()) {
            const breed = breedList.find((b: any) => b.display === pet.breedName);
            if (!breed) {
                throw new Error(`[QuoteDataHelper.getBreedIdMapForPets] - Breed '${pet.breedName}' not found for pet ${index + 1}`);
            }
            breedIdMap[pet.breedName] = breed.breedId;
        }
        return breedIdMap;
    }

    /**
     * Get the market channel ID for a given market display name.
     * @param internalApi The internal API client to use.
     * @param marketDisplay short Brand name.
     * @returns The market channel ID.
     */
    static async getMarketChannelId(marketDisplay: Brand): Promise<number> {
        logger.info(`[QuoteDataHelper.getMarketChannelId] - Fetching market channel ID for display: ${marketDisplay}`);
        if (marketDisplay === 'ORCA') {
            throw new Error('[QuoteDataHelper.getMarketChannelId] - ORCA is not a valid market channel');
        }
        const marketChannelId = Number(brandIdMap[marketDisplay]);
        if (!marketChannelId)
            throw new Error('[QuoteDataHelper.getMarketChannelId] - Market channel ' + marketDisplay + ' not found');
        return marketChannelId;
    }


    static async getMarketChannelIdUsingDisplayName(internalApiClient: InternalApiClient, displayName: string): Promise<number> {
        logger.info(`[QuoteDataHelper.getMarketChannelIdUsingDisplayName] - Fetching market channel ID for display: ${displayName}`);
        const response = await internalApiClient.get(AdminEndpoints.GET_MARKET_CHANNELS);
        expect(response.responseCode, `ERROR!, Expected response code 200 but got ${response.responseCode}, 
            it is not possible to get the market channels`).toBe(200);

        const marketChannel = response.data.find((channel: any) => channel.display === displayName);
        if (!marketChannel) {
            throw new Error(`[QuoteDataHelper.getMarketChannelIdUsingDisplayName] - Market channel with display '${displayName}' not found`);
        }
        logger.info(`[QuoteDataHelper.getMarketChannelIdUsingDisplayName] - Found market channel ID: ${marketChannel.marketChannelId}`);
        return marketChannel.marketChannelId;
    }


    /**
     * Fetches available products for a pet and selects upgrades based on business rules.
     * @param publicApi API client instance
     * @param petId Pet ID
     * @param petAgeOrDob Pet age or DOB in "yyyy-MM-dd" or "yyyy-MM-ddTHH:mm:ss" format
     * @param userSelectedProducts User-selected upgrades (optional)
     * @param isAccidentOnly Whether this is an accident-only policy (optional)
     * @returns Array of selected upgrades
     */
    static async getProductIds(
        publicApi: BaseApiClient,
        petId: number,
        petAgeOrDob: number | string,
        userSelectedProducts?: CoverageUpgradesDisplay[],
        isAccidentOnly: boolean = false
    ): Promise<SelectedProduct[]> {
        logger.info(`[QuoteDataHelper.getProductIds] - Fetching products for petId: ${petId}, age/DOB: ${petAgeOrDob}, userSelectedProducts: ${userSelectedProducts?.join(', ')}`);
        logger.info(`[QuoteDataHelper.getProductIds] - isAccidentOnly: ${isAccidentOnly}`);
        const ageInt = getAgeFromDateString(petAgeOrDob);
        const isCanada = config.ENVIRONMENT.toLowerCase().includes('ca');
        let response;
        if (isCanada) {
            response = await publicApi.get(QuoteEndpoints.GET_QUOTE_PRODUCTS_V2(petId));
        } else {
            response = await publicApi.get(QuoteEndpoints.GET_QUOTE_PRODUCTS_V1(petId));
        }
        const combinedProducts = [
            ...(response.data.baseProducts ?? []),
            ...(response.data.upgradeOptions ?? []),
            ...(response.data.wellnessOptions ?? []),
            ...(response.data.preselectedOptions ?? [])
        ];
        return getStateFilingUpgradeIds(combinedProducts, ageInt, userSelectedProducts, isAccidentOnly);
    }



    /**
     * Fetches available limits for a pet and selects limits based on business rules and plan type.
     * @param publicApi API client instance
     * @param postalCode Postal code
     * @param marketChannelId Market channel ID
     * @param petAgeOrDob Pet age or DOB (optional)
     * @param planType Plan type - 'custom' allows overrides, 'basic' uses fixed limits
     * @param overrides Optional: user-supplied limit values (only applied for custom plans on pets <9 years)
     * @returns SelectedLimits object with coverage, incident, deductible, and coinsurance IDs
     */
    static async getLimitIds(
        publicApi: BaseApiClient,
        postalCode: string,
        marketChannelId: number,
        petAgeOrDob: number | string = 3,
        planType: 'custom' | 'basic' | undefined = 'custom',
        overrides?: {
            coverageLimit?: string;
            deductible?: string;
            coinsurance?: string;
            incidentLimit?: string;
        }
    ): Promise<SelectedLimits> {
        const limits = await publicApi.get(QuoteEndpoints.GET_LIMITS(postalCode), { marketChannelId });
        const ageInt = getAgeFromDateString(petAgeOrDob);
        const isCanada = config.ENVIRONMENT.includes('-ca');
        logger.info(`[QuoteDataHelper.getLimitIds] - Fetching limits for postalCode: ${postalCode}, marketChannelId: ${marketChannelId}, petAgeOrDob: ${petAgeOrDob}, planType: ${planType}, overrides: ${JSON.stringify(overrides)}`);

        // Get default limits based on business rules
        const defaultLimits = getDefaultLimitsForPlan(planType, ageInt, isCanada);
        logger.info(`[QuoteDataHelper.getLimitIds] - Using default limits: ${JSON.stringify(defaultLimits)}`);

        let coverageLimitId;
        let incidentLimitId;
        let deductibleId;
        let coinsuranceId;

        // Apply overrides if provided, otherwise use defaults from business rules
        const coverageLimitDisplay = overrides?.coverageLimit ?? defaultLimits.coverageLimit;
        const deductibleDisplay = overrides?.deductible ?? defaultLimits.deductible;
        const coinsuranceDisplay = overrides?.coinsurance ?? defaultLimits.coinsurance;
        const incidentLimitDisplay = overrides?.incidentLimit ?? defaultLimits.incidentLimit;

        coverageLimitId = limits.data.coverageLimits.find((l: any) => l.display === coverageLimitDisplay)?.id;
        deductibleId = limits.data.deductibleLimits.find((l: any) => l.display === deductibleDisplay)?.id;
        coinsuranceId = limits.data.coinsuranceLimits.find((l: any) => l.display === coinsuranceDisplay)?.id;
        incidentLimitId = limits.data.incidentLimits.find((l: any) => l.display === incidentLimitDisplay)?.id;

        const selectedLimits: SelectedLimits = {
            coverageLimitId,
            incidentLimitId,
            deductibleId,
            coinsuranceId
        };

        logger.info(`[QuoteDataHelper.getLimitIds] - Selected limits to use: ${JSON.stringify(selectedLimits)}`);

        // Validate all IDs were found
        if (coverageLimitId === undefined) {
            throw new Error('[QuoteDataHelper.getLimitIds] - coverageLimitId is undefined');
        }
        if (incidentLimitId === undefined) {
            throw new Error('[QuoteDataHelper.getLimitIds] - incidentLimitId is undefined');
        }
        if (deductibleId === undefined) {
            throw new Error('[QuoteDataHelper.getLimitIds] - deductibleId is undefined');
        }
        if (coinsuranceId === undefined) {
            throw new Error('[QuoteDataHelper.getLimitIds] - coinsuranceId is undefined');
        }

        return selectedLimits;
    }
}