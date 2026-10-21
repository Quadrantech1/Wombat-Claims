import { request } from '@playwright/test';
import { formatHttpLog, logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { BaseApiClient } from './base-api-client';

export class SidneyApiClient extends BaseApiClient {
    /**
     * Creates a new SidneyApiClient instance (no authentication required).
     * @param baseUrl The Sidney API host (e.g. https://aphi.qasites.hartvillegroup.net).
     */
    static async create(baseUrl: string): Promise<SidneyApiClient> {
        const apiContext = await request.newContext({ baseURL: baseUrl });
        return new SidneyApiClient(apiContext, baseUrl, 'sidneyApi');
    }

    async put<T = any>(
        endpoint: string,
        data?: any,
        timeout: number = timeouts.default,
        headers?: Record<string, string>
    ): Promise<{ data: T; response: any; responseCode: number }> {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        const defaultHeaders = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
        const mergedHeaders = { ...defaultHeaders, ...(headers || {}) };
        logger.info(
            formatHttpLog({
                type: 'REQUEST',
                method: 'PUT',
                url: fullUrl,
                headers: mergedHeaders,
                body: data,
                source: `${this.clientName} API Client`,
            })
        );
        const response = await this.apiContext.put(endpoint, {
            data: data ? JSON.stringify(data) : undefined,
            headers: mergedHeaders,
            timeout,
        });
        return this.handleResponse<T>(response, endpoint);
    }
}
