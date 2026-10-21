
import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base-api-client';
import { logger, formatHttpLog } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

/**
 * [MvcApiClient] - General-purpose API client for MVC endpoints.
 */
export class MvcApiClient extends BaseApiClient {
    constructor(apiContext: APIRequestContext, baseUrl: string) {
        super(apiContext, baseUrl, 'mvc');
    }

    /**
     * [MvcApiClient.postForm] - Sends a POST request to any MVC endpoint with form-url-encoded body.
     * @param endpoint - The endpoint to post to (e.g., '/Finance/RunTransactions')
     * @param formBody - Key-value object for form fields
     */
    async postForm(endpoint: string, formBody: Record<string, string>, timeout: number = timeouts.default): Promise<{ status: number; body: string }> {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
        };
        // Encode formBody as x-www-form-urlencoded
        const encodedBody = Object.entries(formBody)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        const fullUrl = `${this.baseUrl}${endpoint}`;
        logger.info(formatHttpLog({
            type: 'REQUEST',
            method: 'POST',
            url: fullUrl,
            headers,
            body: encodedBody,
            source: 'MvcApiClient'
        }));
        const response = await this.apiContext.post(endpoint, {
            headers,
            data: encodedBody,
            timeout
        });
        const responseBody = await response.text();
        logger.info(formatHttpLog({
            type: 'RESPONSE',
            method: 'POST',
            url: fullUrl,
            headers: response.headers(),
            status: response.status(),
            source: 'MvcApiClient'
        }));
        return {
            status: response.status(),
            body: responseBody
        };
    }
}
