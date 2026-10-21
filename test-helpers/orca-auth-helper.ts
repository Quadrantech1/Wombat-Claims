import { AuthService } from '@api-setup/auth/auth-service';
import { config } from '@config/env-config';
import { APIRequestContext, request } from '@playwright/test';
import { Brand } from '@utils/brand-util';
import { Databases, runQuery } from '@utils/db-client-util';
import { logger } from '@utils/logger-util';
import { getCredentialsForRole, Role } from '@utils/user-credentials-util';

/**
 * Service for handling Orca authentication operations
 */
export class OrcaAuthHelper {
    /**
     * Builds the `userInfo` cookie object for Orca authentication based on the provided user role.
     *
     * @param {Role} role - The user role for which to generate credentials and authentication tokens.
     * @returns {Promise<object>} Resolves to a cookie object containing authentication tokens and metadata for Orca.
     */
    static async buildUserInfoCookie(role: Role, brand: Brand = 'ORCA'): Promise<any> {
        logger.info(`[OrcaAuthHelper.buildUserInfoCookie] - Building cookie for role: ${role}`);
        let baseUrl;
        if (brand === 'ORCA_GROUP') {
            baseUrl = config.URL_ORCA_GROUP;
        } else {
            baseUrl = config.URL_ORCA;
        }

        const { user, password } = getCredentialsForRole(role);
        const { accessToken, refreshToken } = await AuthService.loginApi(config.API_HOST, user, password);

        let sysId;

        if (config.ENVIRONMENT === 'prod') {
            sysId = '389';
        } else {
            const queryResult = await runQuery(Databases.ORCA, `select sysuser_id from sysuser where email = '${user}'`);
            if (!queryResult || queryResult.length === 0) {
                throw new Error(`[OrcaAuthHelper.buildUserInfoCookie] No sysuser found for email: ${user}`);
            }
            sysId = queryResult[0].sysuser_id;
        }


        logger.info(`[OrcaAuthHelper.buildUserInfoCookie] Retrieved sysuserId: ${sysId}`);

        // Use legacy format for expires to match backend expectation
        const expires_in = 3600;

        return {
            name: 'userInfo',
            value: JSON.stringify({ accessToken, refreshToken, expires_in, username: user, sysuserId: sysId }),
            domain: new URL(baseUrl).hostname,
            path: '/',
            expires_in: 3600,
            httpOnly: true,
            secure: true,
            sameSite: 'Lax'
        };
    }

    /**
     * Creates a Playwright APIRequestContext with the Orca userInfo cookie for the specified role.
     *
     * @param {Role} role - The user role for which to create the API context and authentication cookie.
     * @returns {Promise<APIRequestContext>} Resolves to a Playwright APIRequestContext with the userInfo cookie set for Orca authentication.
     */
    static async createApiContextWithCookie(role: Role, brand: Brand = 'ORCA'): Promise<APIRequestContext> {
        logger.info(`[OrcaAuthHelper.createApiContextWithCookie] - Creating API context for role: ${role}`);

        let baseUrl;
        if (brand === 'ORCA_GROUP') {
            baseUrl = config.URL_ORCA_GROUP;
        } else {
            baseUrl = config.URL_ORCA;
        }
        const cookie = await this.buildUserInfoCookie(role, brand);

        // Add expires timestamp for Playwright API context compatibility
        const expiresTimestamp = Math.floor(Date.now() / 1000) + 3600;
        cookie.expires = expiresTimestamp;
        delete cookie.expires_in;

        return request.newContext({
            baseURL: baseUrl,
            extraHTTPHeaders: {},
            storageState: {
                cookies: [cookie],
                origins: []
            }
        });
    }
}