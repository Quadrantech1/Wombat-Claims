import { EarnixApiClient } from '@api-setup/client/earnix-api-client';
import { InternalApiClient } from '@api-setup/client/internal-api-client';
import { PublicApiClient } from '@api-setup/client/public-api-client';
import { SidneyApiClient } from '@api-setup/client/sidney-api-client';
import { config } from '@config/env-config';
import { test as base } from '@fixtures/base-fixtures';

export interface ApiFixtures {
    internalApi: InternalApiClient;
    publicApi: PublicApiClient;
    sidneyApi: SidneyApiClient;
    earnixApi: EarnixApiClient;
}

export const test = base.extend<ApiFixtures>({
    internalApi: async ({ }, use) => {
        const client = await InternalApiClient.create(
            config.API_HOST,
            config.USER,
            config.PASSWORD
        );
        await use(client);
        await client.dispose();
    },

    publicApi: async ({ }, use) => {
        const client = await PublicApiClient.create(config.GATEWAY_URL);
        await use(client);
        await client.dispose();
    },

    sidneyApi: async ({ }, use) => {
        const client = await SidneyApiClient.create(config.SIDNEY_URL);
        await use(client);
        await client.dispose();
    },

    earnixApi: async ({ }, use) => {
        const client = await EarnixApiClient.create(config.URL_EARNIX);
        await use(client);
        await client.dispose();
    },
});

export { expect } from '@playwright/test';
