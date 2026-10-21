import { APIRequestContext } from '@playwright/test';
import { formatHttpLog, logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export abstract class BaseApiClient {
    protected apiContext: APIRequestContext;
    protected baseUrl: string;
    protected clientName: string;

    protected constructor(apiContext: APIRequestContext, baseUrl: string, clientName: string) {
        this.apiContext = apiContext;
        this.baseUrl = baseUrl;
        this.clientName = clientName;
    }

    async dispose(): Promise<void> {
        await this.apiContext.dispose();
    }

    /**
     * Handles the API response, logs it, and parses the response body.
     * @template T The expected type of the response data.
     * @param response The Playwright response object.
     * @param url The endpoint URL (relative to baseUrl).
     * @returns An object containing the parsed data, the original response, and the response code.
     */
    protected async handleResponse<T>(response: any, url: string): Promise<{ data: T; response: any; responseCode: number }> {
        const responseText = await response.text();
        const fullUrl = `${this.baseUrl}${url}`;
        logger.info(
            formatHttpLog({
                type: 'RESPONSE',
                url: fullUrl,
                status: response.status(),
                headers: response.headers(),
                body: responseText,
                source: `${this.clientName} API Client`,
            })
        );

        let data: T;

        if (!responseText) {
            data = {} as T;
        } else {
            const parsed = JSON.parse(responseText);
            data = (parsed && typeof parsed === 'object' && 'data' in parsed) ? parsed.data : parsed;
        }

        return {
            data,
            response,
            responseCode: response.status()
        };
    }

    /**
     * Builds a URL with query parameters.
     * @param endpoint The API endpoint (relative path).
     * @param params Optional query parameters as key-value pairs.
     * @returns The endpoint with query string if params are provided.
     */
    protected buildUrl(endpoint: string, params?: Record<string, any>): string {
        if (!params || Object.keys(params).length === 0) {
            return endpoint;
        }

        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        return queryString ? `${endpoint}?${queryString}` : endpoint;
    }

    /**
     * Sends a GET request to the specified endpoint.
     * @template T The expected type of the response data.
     * @param endpoint The API endpoint (relative path).
     * @param params Optional query parameters as key-value pairs.
     * @param headers Optional headers to include in the request.
     * @returns An object containing the parsed data, the original response, and the response code.
     */
    async get<T = any>(
        endpoint: string,
        params?: Record<string, any>,
        timeout: number = timeouts.default,
        headers?: Record<string, string>
    ): Promise<{ data: T; response: any; responseCode: number }> {
        const url = this.buildUrl(endpoint, params);
        const fullUrl = `${this.baseUrl}${url}`;
        const defaultHeaders = { 'Accept': 'application/json' };
        const mergedHeaders = { ...defaultHeaders, ...(headers || {}) };
        logger.info(
            formatHttpLog({
                type: 'REQUEST',
                method: 'GET',
                url: fullUrl,
                headers: mergedHeaders,
                source: `${this.clientName} API Client`
            })
        );
        const response = await this.apiContext.get(url, { headers: mergedHeaders, timeout });
        return this.handleResponse<T>(response, url);
    }

    /**
     * Sends a POST request to the specified endpoint.
     * @template T The expected type of the response data.
     * @param endpoint The API endpoint (relative path).
     * @param data Optional request body data.
     * @param headers Optional headers to include in the request.
     * @returns An object containing the parsed data, the original response, and the response code.
     */
    async post<T = any>(
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
                method: 'POST',
                url: fullUrl,
                headers: mergedHeaders,
                body: data,
                source: `${this.clientName} API Client`,
            })
        );
        const response = await this.apiContext.post(endpoint, {
            data: data ? JSON.stringify(data) : undefined,
            headers: mergedHeaders,
            timeout
        });
        return this.handleResponse<T>(response, endpoint);
    }

    /**
     * Sends a DELETE request to the specified endpoint.
     * @template T The expected type of the response data.
     * @param endpoint The API endpoint (relative path).
     * @param headers Optional headers to include in the request.
     * @returns An object containing the parsed data, the original response, and the response code.
     */
    async delete<T = any>(
        endpoint: string,
        timeout: number = timeouts.default,
        headers?: Record<string, string>
    ): Promise<{ data: T; response: any; responseCode: number }> {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        const defaultHeaders = { 'Accept': 'application/json' };
        const mergedHeaders = { ...defaultHeaders, ...(headers || {}) };
        logger.info(
            formatHttpLog({
                type: 'REQUEST',
                method: 'DELETE',
                url: fullUrl,
                headers: mergedHeaders,
                source: `${this.clientName} API Client`
            })
        );
        const response = await this.apiContext.delete(endpoint, { headers: mergedHeaders, timeout });
        return this.handleResponse<T>(response, endpoint);
    }
}
