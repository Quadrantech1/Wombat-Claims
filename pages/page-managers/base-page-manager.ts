import { Page } from '@playwright/test';

/**
 * Base class for all page managers providing common functionality
 */
export abstract class BasePageManager {
    constructor(protected readonly page: Page) { }

    /**
     * Bring this page to front
     */
    async bringToFront(): Promise<void> {
        await this.page.bringToFront();
    }

    /**
     * Reload the current page
     */
    async reload(options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }): Promise<void> {
        await this.page.reload(options);
    }
}
