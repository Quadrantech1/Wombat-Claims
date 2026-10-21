import { config } from '@config/env-config';
import { LoginPage } from '@pages/orca/login/login-page';
import { Page } from '@playwright/test';
import { OrcaAuthHelper } from '@test-helpers/orca-auth-helper';
import { Role } from '@utils/user-credentials-util';
import { Brand } from './brand-util';
import { logger } from './logger-util';

/**
 * Logs in to Orca in a Playwright browser context by setting the userInfo cookie and reloading the page.
 *
 * @param {Page} page - The Playwright Page instance to set the cookie and reload.
 * @param {Role} role - The user role for which to log in and set authentication.
 * @param {Brand} brand - The brand for which to set the cookie (default is 'ORCA').
 * @returns {Promise<void>} Resolves when the cookie is set and the page is reloaded as the specified user.
 */
export async function loginToOrcaViaAPI(page: Page, role: Role, brand: Brand = 'ORCA'): Promise<void> {
    logger.info(`[login-orca-util.loginToOrcaViaAPI] - Logging in as ${role}`);
    const cookie = await OrcaAuthHelper.buildUserInfoCookie(role, brand);
    await page.context().addCookies([cookie]);
    await page.reload({ waitUntil: 'load' });
    logger.info(`[login-orca-util.loginToOrcaViaAPI] - Page reloaded as user ${role} for domain: ${cookie.domain}`);
}

/**
 * Logs in to Orca using either API or UI login, depending on MFA configuration.
 *
 * If MFA is enabled in config, logs in via API by setting the userInfo cookie and reloading the page.
 * If MFA is disabled, logs in via UI by interacting with the login form as the specified user.
 *
 * @param {Page} page - The Playwright Page instance to use for login.
 * @param {Role} role - The user role for which to log in and set authentication (default is Admin).
 * @param {Brand} brand - The brand for which to log in (default is 'ORCA').
 * @returns {Promise<void>} Resolves when the user is logged in using the appropriate method for the current configuration.
 */
export async function loginToOrca(page: Page, role: Role = Role.Admin, brand: Brand = 'ORCA'): Promise<void> {
    logger.info(`[login-orca-util.loginToOrca] - Logging in as ${role} (MFA enabled: ${config.IS_ENABLED_ORCA_MFA})`);

    if (config.IS_ENABLED_ORCA_MFA) {
        await loginToOrcaViaAPI(page, role, brand);
    } else {
        const loginPage = new LoginPage(page);
        await loginPage.iAmLoggedUsingRole(role);
    }
}
