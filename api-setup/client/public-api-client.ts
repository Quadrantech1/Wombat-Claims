import { request } from '@playwright/test';
import { BaseApiClient } from './base-api-client';

export class PublicApiClient extends BaseApiClient {
    /**
     * Creates a new PublicApiClient instance.
     * @param baseUrl The base URL for API requests.
     * @returns A promise resolving to a PublicApiClient instance.
     */
    static async create(baseUrl: string): Promise<PublicApiClient> {
        const apiContext = await request.newContext({
            baseURL: baseUrl,
        });

        return new PublicApiClient(apiContext, baseUrl, 'public');
    }
}
