import { request } from '@playwright/test';
import { formatHttpLog, logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import * as fs from 'fs';
import { AuthService } from '../auth/auth-service';
import { BaseApiClient } from './base-api-client';

export class InternalApiClient extends BaseApiClient {
    /**
     * Creates a new InternalApiClient instance with authentication.
     * @param baseUrl The base URL for API requests.
     * @param username Username for authentication.
     * @param password Password for authentication.
     * @returns A promise resolving to an InternalApiClient instance.
     */
    static async create(baseUrl: string, username: string, password: string): Promise<InternalApiClient> {
        // Always get a fresh token for each client instance
        const { accessToken } = await AuthService.loginApi(baseUrl, username, password);

        const apiContext = await request.newContext({
            baseURL: baseUrl,
            extraHTTPHeaders: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return new InternalApiClient(apiContext, baseUrl, 'internal');
    }

    /**
     * Sends a PUT request to the specified endpoint.
     * @template T The expected type of the response data.
     * @param endpoint The API endpoint (relative path).
     * @param data Optional request body data.
     * @param headers Optional headers to include in the request.
     * @returns An object containing the parsed data, the original response, and the response code.
     */
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
                source: `${this.clientName} API Client`
            })
        );
        const response = await this.apiContext.put(endpoint, {
            data: data ? JSON.stringify(data) : undefined,
            headers: mergedHeaders,
            timeout
        });
        return this.handleResponse<T>(response, endpoint);
    }

    /**
     * Uploads a DOCX file using multipart/form-data.
     * @template T The expected type of the response data.
     * @param endpoint API endpoint
     * @param filePath Absolute path to the .docx file
     * @returns An object containing the parsed data, the original response, and the response code.
     */
    async postDocument<T = any>(endpoint: string, filePath: string, timeout: number = timeouts.default): Promise<{ data: T; response: any; responseCode: number }> {
        const fullUrl = `${this.baseUrl}${endpoint}`;

        // Use ReadStream for file upload
        const multipart = {
            file: fs.createReadStream(filePath)
        };

        logger.info(
            `[InternalApiClient.postDocument] - ` + formatHttpLog({
                type: 'REQUEST',
                method: 'POST',
                url: fullUrl,
                headers: {},
                body: `[binary file: ${filePath}]`,
                source: `${this.clientName} API Client`
            })
        );
        const response = await this.apiContext.post(endpoint, {
            multipart,
            timeout
        });
        return this.handleResponse<T>(response, endpoint);
    }
}
