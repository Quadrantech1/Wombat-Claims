import { request } from '@playwright/test';
import { BaseApiClient } from './base-api-client';

export class EarnixApiClient extends BaseApiClient {
    /**
     * Creates a new EarnixApiClient instance (no authentication required).
     * @param baseUrl The Earnix pricing API host.
     * @returns A promise resolving to an EarnixApiClient instance.
     */
    static async create(baseUrl: string): Promise<EarnixApiClient> {
        const apiContext = await request.newContext({
            baseURL: baseUrl,
        });

        return new EarnixApiClient(apiContext, baseUrl, 'earnixApi');
    }


  
}
