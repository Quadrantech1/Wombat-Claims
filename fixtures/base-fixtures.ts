import { ControlBase } from '@controls/control-base';
import { test as base, BrowserContext, Page } from '@playwright/test';
import { Brand, BrandUrl } from '@utils/brand-util';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { Role } from '@utils/user-credentials-util';

class NavigationHelper {
    constructor(private page: Page, private context: BrowserContext) { }

    async openBrandWebPage(url: string, waitUntil: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' = 'load'): Promise<void> {
        try {
            logger.info(`[NavigationHelper.openBrandWebPage] - Opening brand web page at ${url}`);
            await this.page.goto(url, { waitUntil, timeout: timeouts.long });
            logger.info(`[NavigationHelper.openBrandWebPage] - Successfully opened brand web page at ${url}`);
        } catch (error) {
            logger.error(`[NavigationHelper.openBrandWebPage] - Failed to open brand web page at ${url}: ${error}`);
            throw error;
        }
    }

    async openUrlInNewTab(url: string): Promise<Page> {
        logger.info(`[NavigationHelper.openUrlInNewTab] - Opening new tab and navigating to URL: ${url}`);
        const newTab = await this.context.newPage();
        await newTab.goto(url, { waitUntil: 'load' });
        logger.info(`[NavigationHelper.openUrlInNewTab] - Opened new tab and navigated to URL: ${url}`);
        return newTab;
    }

    async openBrandInNewTab(brand: Brand): Promise<Page> {
        const url = BrandUrl[brand];
        logger.info(`[NavigationHelper.openBrandInNewTab] - Opening ${brand} in a new tab at ${url}`);
        return this.openUrlInNewTab(url);
    }

    async clickAndGetNewTab(button: ControlBase, timeout = timeouts.default): Promise<Page> {
        const [newTab] = await Promise.all([
            this.context.waitForEvent('page', { timeout }),
            button.click(),
        ]);
        logger.info(`[NavigationHelper.clickAndGetNewTab] - New tab opened after button click.`);
        return newTab;
    }

    async refreshPage(): Promise<void> {
        logger.info(`[NavigationHelper.refreshPage] - Refreshing current page.`);
        await this.page.reload({ waitUntil: 'load' });
    }

    async clearBrowserStorage(): Promise<void> {
        try {
            logger.info(`[NavigationHelper.clearBrowserStorage] - Clearing cookies and local/session storage.`);
            await this.context.clearCookies();
            await this.page.evaluate(() => {
                window.localStorage.clear();
                window.sessionStorage.clear();
            });
            logger.info(`[NavigationHelper.clearBrowserStorage] - Cleared cookies and local/session storage.`);
        } catch (error) {
            logger.error(`[NavigationHelper.clearBrowserStorage] - Failed to clear browser storage: ${error}`);
            throw error;
        }
    }
}


type TestFixtures = {
    navigation: NavigationHelper;
    loginToOrcaAs: (role: Role) => Promise<void>;
};

export const test = base.extend<TestFixtures>({
    navigation: async ({ page, context }, use) => {
        await use(new NavigationHelper(page, context));
    },
});

export { expect } from '@playwright/test';

