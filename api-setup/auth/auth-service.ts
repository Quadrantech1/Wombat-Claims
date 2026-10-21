import { request } from '@playwright/test';
import { CustomerEndpoints } from '../endpoints/customer-endpoints';
import { logger } from '@utils/logger-util';
import { formatHttpLog } from '@utils/logger-util';

export class AuthService {
    /**
     * Logs in a user and retrieves an access token from the API.
     * @param baseUrl The base URL of the API.
     * @param username The username for authentication.
     * @param password The password for authentication.
     * @returns An object containing the access token.
     */
    static async loginApi(
        baseUrl: string,
        username: string,
        password: string
    ): Promise<{ accessToken: string, refreshToken: string }> {
        // Create a temporary API request context with the provided base URL
        const tempContext = await request.newContext({ baseURL: baseUrl });

        try {
            // Prepare the request body and headers for login
            const requestBody = {
                username,
                password,
                application: "orca"
            };
            const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
            const fullUrl = `${baseUrl}${CustomerEndpoints.LOGIN}`;

            // Request logging for debugging
            logger.info(
                formatHttpLog({
                    type: 'REQUEST',
                    method: 'POST',
                    url: fullUrl,
                    headers,
                    body: requestBody,
                    source: 'AuthService.loginApi'
                })
            );

            // Send the POST request to the login endpoint
            const loginResponse = await tempContext.post(CustomerEndpoints.LOGIN, {
                data: JSON.stringify(requestBody),
                headers
            });

            // Log the response details for debugging
            const responseText = await loginResponse.text();

            // Throw an error if authentication failed
            if (!loginResponse.ok()) {
                throw new Error(`[AuthService.loginApi] Authentication failed: ${loginResponse.status()}`);
            }

            // Parse the response and extract the token
            const authData = JSON.parse(responseText);
            const accessToken = authData.accessToken;
            const refreshToken = authData.refreshToken;

            // Ensure a token was returned
            if (!accessToken && !refreshToken) {
                logger.error(`[AuthService.loginApi] Missing token field - available fields, : ${Object.keys(authData).join(', ')}`);
                throw new Error('[AuthService.loginApi] No token found in authentication response');
            }

            logger.info(
                formatHttpLog({
                    type: 'RESPONSE',
                    url: fullUrl,
                    status: loginResponse.status(),
                    headers: loginResponse.headers(),
                    body: { accessToken },
                    source: 'AuthService.loginApi'
                })
            );
            return { accessToken, refreshToken };
        } finally {
            // Dispose of the temporary request context
            await tempContext.dispose();
        }
    }
}
