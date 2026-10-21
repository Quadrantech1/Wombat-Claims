import { McleadRegistrationBuilder } from '@api-setup/builders/mclead-registration-builder';
import { InternalApiClient } from '@api-setup/client/internal-api-client';
import { PetEndpoints } from '@api-setup/endpoints/pet-endpoints';
import { QuoteDataHelper } from '@api-setup/helpers/quote-data-helper';
import { CreateMcleadTestParams } from '@api-setup/interfaces/api-tests/create-mclead-interface';
import { faker } from "@faker-js/faker";
import { logger } from '@utils/logger-util';
import { getRandomValue } from '@utils/random-values-util';

/**
 * Generates CreateMcleadTestParams for AKC brand with sensible defaults.
 * @param internalApi InternalApiClient fixture
 * @param overrides Optional overrides for test params (e.g., petName, zipCode, email, breed, petType, petAge)
 */
export async function createAkcMcleadRegistrationApi(
    internalApi: InternalApiClient,
    overrides: Partial<CreateMcleadTestParams> = {}
): Promise<any> {
    const randomValue = getRandomValue();
    const payload: CreateMcleadTestParams = {
        registrationNumber: `AKC_REG_${randomValue}`,
        marketChannelName: 'AKC',
        petName: faker.animal.petName(),
        email: `akc_${randomValue}@yopmail.com`,
        zipCode: '77433',
        petType: 2,
        breed: 'American Curl',
        petAge: 2,
        ...overrides
    };
    return createMcleadRegistrationViaApi(internalApi, payload);
}

/**
 * Generates CreateMcleadTestParams for PPI brand with sensible defaults.
 * @param internalApi InternalApiClient fixture
 * @param overrides Optional overrides for test params (e.g., petName, zipCode, email, breed, petType, petAge)
 */
export async function createPpiMcleadRegistrationApi(
    internalApi: InternalApiClient,
    overrides: Partial<CreateMcleadTestParams> = {}
): Promise<any> {
    const randomValue = getRandomValue();
    const payload: CreateMcleadTestParams = {
        registrationNumber: `PPI_REG_${randomValue}`,
        marketChannelName: 'PPI',
        petName: faker.animal.petName(),
        email: `ppi_${randomValue}@yopmail.com`,
        zipCode: '77433',
        petType: 1,
        breed: 'Mixed Breed',
        petAge: 2,
        ...overrides
    };
    return createMcleadRegistrationViaApi(internalApi, payload);
}

/**
 * Generates CreateMcleadTestParams for Felix brand with sensible defaults.
 * @param internalApi InternalApiClient fixture
 * @param overrides Optional overrides for test params (e.g., petName, zipCode, email, breed, petType, petAge)
 */
export async function createFelixMcleadRegistrationApi(
    internalApi: InternalApiClient,
    overrides: Partial<CreateMcleadTestParams> = {}
): Promise<any> {
    const randomValue = getRandomValue();
    const payload: CreateMcleadTestParams = {
        registrationNumber: `FELIX_REG_${randomValue}`,
        marketChannelName: 'FELIX',
        petName: faker.animal.petName(),
        email: `felix_${randomValue}@yopmail.com`,
        zipCode: '77433',
        petType: 2,
        breed: 'American Curl',
        petAge: 2,
        ...overrides
    };
    return createMcleadRegistrationViaApi(internalApi, payload);
}

/**
 * Creates a mclead registration via API, resolving breedId by breed name.
 * @param internalApi InternalApiClient fixture
 * @param randomValue Unique random value for test data
 * @param macleadData Object containing registrationNumber, petName, email, zipCode, breedName, and other overrides
 * @returns Promise<any> API response
 */
export async function createMcleadRegistrationViaApi(
    internalApi: InternalApiClient,
    macleadData: CreateMcleadTestParams,
): Promise<any> {
    logger.info(`[api-mclead-helper.createMcleadRegistrationViaApi] - Starting registration for ${macleadData.registrationNumber}`);
    const randomValue = getRandomValue();
    const stateCode = await QuoteDataHelper.getStateCodeByZip(internalApi, macleadData.zipCode);
    const marketChannelId = await QuoteDataHelper.getMarketChannelId(macleadData.marketChannelName);
    const breedId = await QuoteDataHelper.getBreedId(internalApi, macleadData.petType, macleadData.breed, stateCode, marketChannelId);

    const payload = McleadRegistrationBuilder.create(randomValue)
        .withPayload({
            registrationNumber: macleadData.registrationNumber,
            marketChannelId,
            name: macleadData.petName,
            breedDescription: macleadData.breed,
            breedId,
            whelpDate: macleadData.petAge,
        })
        .withOwner(1, {
            email: macleadData.email,
        })
        .withAddressForOwner(1, {
            zip: macleadData.zipCode,
        })
        .build();
    const response = await internalApi.post(PetEndpoints.SEND_REGISTRATION, payload);
    logger.info(`[api-mclead-helper.createMcleadRegistrationViaApi] - Registration complete for ${macleadData.registrationNumber} and zipCode ${macleadData.zipCode}`);
    return {
        response,
        registrationNumber: macleadData.registrationNumber,
        zipCode: macleadData.zipCode
    };
}
