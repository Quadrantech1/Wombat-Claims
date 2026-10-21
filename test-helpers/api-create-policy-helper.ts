import { QuoteCheckoutBuilder } from '@api-setup/builders/quote-checkout-builder';
import { QuoteStepOneBuilder } from '@api-setup/builders/quote-step-one-builder';
import { QuoteStepTwoBuilder } from '@api-setup/builders/quote-step-two-builder';
import { InternalApiClient } from '@api-setup/client/internal-api-client';
import { PublicApiClient } from '@api-setup/client/public-api-client';
import { QuoteEndpoints } from '@api-setup/endpoints/quote-endpoints';
import { QuoteDataHelper } from '@api-setup/helpers/quote-data-helper';
import { CreatePolicyTestParams } from '@api-setup/interfaces/api-tests/create-policy-interface';
import { config } from '@config/env-config';
import { StripeService } from '@services/stripe-service';
import { CoverageUpgradesDisplay } from '@test-business-rules/coverage-upgrades-rules';
import { logger } from '@utils/logger-util';
import { getRandomValue } from '@utils/random-values-util';

/**
 * Generates CreatePolicyTestParams for AKC brand with sensible defaults.
 * @param overrides Optional overrides for test params (e.g., petsData, postalCode, email)
 * @returns {Promise<{ policyId: string; quoteGuid: string; petNames: string[] }>} Object containing created policyId, quoteGuid, and petNames array
 */
export async function createAkcPolicyApi(
    publicApi: PublicApiClient,
    internalApi: InternalApiClient,
    overrides: Partial<CreatePolicyTestParams> = {}
): Promise<{ policyId: string; quoteGuid: string; petNames: string[]; response: any, data: any }> {
    // Default AKC pet data
    const defaultPet = { petAge: 2, petTypeCode: 2, breedName: 'American Curl', petName: `Lucy${getRandomValue()}` };
    // Merge overrides for the single pet
    const pet = { ...defaultPet, ...(overrides.petsData?.[0] || {}) };

    const params: CreatePolicyTestParams = {
        marketDisplay: 'AKC',
        postalCode: '77433',
        email: `akc_${getRandomValue()}@yopmail.com`,
        ...overrides,
        petsData: [pet]
    };
    return createPolicyViaApi(publicApi, internalApi, params);
}

/**
 * Generates CreatePolicyTestParams for PPI brand with sensible defaults.
 * @param overrides Optional overrides for test params (e.g., petsData, postalCode, email)
 * @returns {Promise<{ policyId: string; quoteGuid: string; petNames: string[] }>} Object containing created policyId, quoteGuid, and petNames array
 */
export async function createPpiPolicyApi(
    publicApi: PublicApiClient,
    internalApi: InternalApiClient,
    overrides: Partial<CreatePolicyTestParams> = {}
): Promise<{ policyId: string; quoteGuid: string; petNames: string[], response: any, data: any }> {
    // Default PPI pet data
    const defaultPet = { petAge: 2, petTypeCode: 1, breedName: 'Mixed Breed', petName: `Lucy${getRandomValue()}` };
    // Merge overrides for the single pet
    const pet = { ...defaultPet, ...(overrides.petsData?.[0] || {}) };

    const params: CreatePolicyTestParams = {
        marketDisplay: 'PPI',
        postalCode: '77433',
        email: `ppi_${getRandomValue()}@yopmail.com`,
        ...overrides,
        petsData: [pet]
    };
    return createPolicyViaApi(publicApi, internalApi, params);
}

/**
 * Generates CreatePolicyTestParams for Felix brand with sensible defaults.
 * @param overrides Optional overrides for test params (e.g., petsData, postalCode, email)
 * @returns {Promise<{ policyId: string; quoteGuid: string; petNames: string[] }>} Object containing created policyId, quoteGuid, and petNames array
 */
export async function createFelixPolicyApi(
    publicApi: PublicApiClient,
    internalApi: InternalApiClient,
    overrides: Partial<CreatePolicyTestParams> = {}
): Promise<{ policyId: string; quoteGuid: string; petNames: string[], response: any, data: any }> {
    // Default Felix pet data
    const defaultPet = { petAge: 3, petTypeCode: 2, breedName: 'Abyssinian', petName: `Lucy${getRandomValue()}` };
    // Merge overrides for the single pet
    const pet = { ...defaultPet, ...(overrides.petsData?.[0] || {}) };

    const params: CreatePolicyTestParams = {
        marketDisplay: 'FELIX',
        postalCode: '77433',
        email: `felix_${getRandomValue()}@yopmail.com`,
        ...overrides,
        petsData: [pet]
    };
    return createPolicyViaApi(publicApi, internalApi, params);
}
/**
 * Generates CreatePolicyTestParams for PPU Core brand with sensible defaults.
 * @param overrides Optional overrides for test params (e.g., petsData, postalCode, email)
 * @returns {Promise<{ policyId: string; quoteGuid: string; petNames: string[] }>} Object containing created policyId, quoteGuid, and petNames array
 */
export async function createPPUCorePolicyApi(publicApi: PublicApiClient,
    internalApi: InternalApiClient,
    overrides: Partial<CreatePolicyTestParams> = {}
): Promise<{ policyId: string; quoteGuid: string; petNames: string[], response: any, data: any }> {
    const defaultPet = { petAge: 2, petTypeCode: 2, breedName: 'Persian', petName: `Lucy${getRandomValue()}` };
    const pet = { ...defaultPet, ...(overrides.petsData?.[0] || {}) };

    const params: CreatePolicyTestParams = {
        marketDisplay: 'PPU_CORE2',
        postalCode: 'K7A 0A1',
        email: `core_${getRandomValue()}@yopmail.com`,
        ...overrides,
        petsData: [pet]
    };
    return createPolicyViaApi(publicApi, internalApi, params);
}

/**
 * Creates a policy via API (single or multipet) and returns the policyId.
 * @param publicApi PublicApiClient fixture
 * @param internalApi InternalApiClient fixture
 * @param policy CreatePolicyTestParams object containing marketDisplay, postalCode, and pets array
 * @returns Promise<string> policyId
 */
export async function createPolicyViaApi(
    publicApi: PublicApiClient,
    internalApi: InternalApiClient,
    policy: CreatePolicyTestParams
): Promise<{ policyId: string; quoteGuid: string, petNames: string[], response: any, data: any }> {
    const { marketDisplay, postalCode, petsData, email } = policy;
    const randomValue = getRandomValue();
    if (!marketDisplay) throw new Error('[api-create-policy-helper.createPolicyViaApi] - marketDisplay is required');
    if (!postalCode) throw new Error('[api-create-policy-helper.createPolicyViaApi] - postalCode is required');
    if (!petsData || petsData.length === 0) throw new Error('[api-create-policy-helper.createPolicyViaApi] - petsData array is required');
    const stateCode = await QuoteDataHelper.getStateCodeByZip(publicApi, postalCode);
    const marketChannelId = await QuoteDataHelper.getMarketChannelId(marketDisplay);

    // Get breedIds for all pets in parallel
    const breedIdMap = await QuoteDataHelper.getBreedIdMapForPets(publicApi, petsData, stateCode, marketChannelId);

    // Step 1: Build and send initial quote payload with all pets
    const stepOneBuilder = QuoteStepOneBuilder.create(randomValue)
        .withPayload({ marketChannelId, postalCode })
        .withCustomer({ postalCode });
    if (email) {
        stepOneBuilder.withCustomer({ email });
    }

    for (const [index, pet] of petsData.entries()) {
        const breedId = breedIdMap[pet.breedName];
        // Generate pet name if not provided
        const petName = pet.petName || `Lucy${randomValue}_${index + 1}`;
        stepOneBuilder.withPet(index + 1, {
            breedId,
            dob: pet.petAge,
            petName
        });
    }

    const stepOneResponse = await publicApi.post(QuoteEndpoints.SAVE_QUOTE, stepOneBuilder.build());
    const quoteGuid = stepOneResponse.data.quoteGuid;

    // Step 2: For each pet, get products
    const petProductsResults = await Promise.all(
        petsData.map(async (pet, index) => {
            const petId = stepOneResponse.data.pets[index].petId;
            const dob = stepOneResponse.data.pets[index].dob;
            const upgradeSelections = [pet.upgrade1, pet.upgrade2, pet.upgrade3, pet.wellnessOptions].filter(Boolean) as CoverageUpgradesDisplay[];
            const productIds = await QuoteDataHelper.getProductIds(publicApi, petId, dob, upgradeSelections);
            return productIds;
        })
    );
    logger.info(`[QuoteDataHelper.getProductIds] - petProductsResults: ${JSON.stringify(petProductsResults)}`);

    // Step 3: Get limits for each pet
    const petLimitsResults = await Promise.all(
        petsData.map(async (pet, index) => {
            const dob = stepOneResponse.data.pets[index].dob;
            const planType = pet.planType;
            const limitIds = await QuoteDataHelper.getLimitIds(publicApi, postalCode, marketChannelId, dob, planType, { coverageLimit: pet.coverageLimit, deductible: pet.deductible, coinsurance: pet.coinsurance });
            return limitIds;
        })
    );

    logger.info(`[QuoteDataHelper.getLimitIds] - petLimitsResults: ${JSON.stringify(petLimitsResults)}`);

    // Step 4: Build and send step two payload with all pets' products and limits
    const stepTwoBuilder = QuoteStepTwoBuilder.create(randomValue)
        .withStepOneResponse(stepOneResponse)
        .withPayload({ postalCode })
        .withCustomer({ postalCode });

    if (email) {
        stepTwoBuilder.withCustomer({ email });
    }

    for (const [index] of petsData.entries()) {
        stepTwoBuilder
            .withSelectedLimitsForPet(index + 1, petLimitsResults[index])
            .withSelectedProductsForPet(index + 1, petProductsResults[index]);
    }

    const stepTwoResponse = await publicApi.post(QuoteEndpoints.SAVE_QUOTE, stepTwoBuilder.build());
    const monthlyPremium = stepTwoResponse.data.pets[0].coverage.monthlyPremium;

    // Canada checkout uses Paymentech (iframe-based), not Stripe; ignoreBillingInfo is required while backend support is incomplete.
    const isCanada = config.ENVIRONMENT.includes('-ca');

    const checkoutBuilder = QuoteCheckoutBuilder.create(randomValue)
        .withStepTwoResponse(stepTwoResponse)
        .withPayload({ postalCode, ignoreBillingInfo: isCanada });

    if (isCanada) {
        checkoutBuilder
            .withPaymentech()
            .withPayload({ stateCode, paymentFrequencyId: 2 });
    } else {
        // Step 5: Process Stripe payment
        const stripeClient = new StripeService();
        const stripePaymentResult = await stripeClient.processCheckout(randomValue, {
            quoteGuid: quoteGuid,
            marketChannelId: marketChannelId.toString(),
            amount: monthlyPremium * 100
        });
        checkoutBuilder.withPaymentDetails(stripePaymentResult);
    }

    // Step 6: Complete checkout and return policyId
    const checkoutPayload = checkoutBuilder.build();

    const response = await internalApi.post(QuoteEndpoints.CHECKOUT, checkoutPayload);
    if (!response.data.policyId) {
        throw new Error('[api-create-policy-helper.createPolicyViaApi] - Policy creation failed: policyId is missing in the response');
    }

    // Extract actual pet names from the API response
    const actualPetNames = stepOneResponse.data.pets.map((pet: any) => pet.petName);

    return {
        response, // Full HTTP client response for additional context if needed
        data: response.data, // Actual response data containing json body
        policyId: String(response.data.policyId),
        quoteGuid: quoteGuid,
        petNames: actualPetNames
    };
}
