import { ControlBase } from '@controls/control-base';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { Page } from 'playwright';

export abstract class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Wait for element to become visible
     * @param control - ControlBase instance
     * @param timeout - Optional timeout in milliseconds
     */
    async waitForVisible(control: ControlBase, timeout: number = timeouts.default): Promise<void> {
        try {
            await control.waitForVisible(timeout);
            logger.info(`[BasePage.waitForVisible] Element became visible: ${control.getLocator()}`);
        } catch (error) {
            logger.error(`[BasePage.waitForVisible] Element did not become visible within ${timeout}ms: ${control.getLocator()}`);
            throw error;
        }
    }

    /**
     * Wait for element to disappear (become hidden or detached)
     * @param control - ControlBase instance
     * @param timeout - Optional timeout in milliseconds
     */
    async waitForDisappear(control: ControlBase, timeout: number = timeouts.default): Promise<void> {
        try {
            await control.waitForDisappear(timeout);
            logger.info(`[BasePage.waitForDisappear] Element disappeared: ${control.getLocator()}`);
        } catch (error) {
            logger.error(`[BasePage.waitForDisappear] Element did not disappear within ${timeout}ms: ${control.getLocator()}`);
            throw error;
        }
    }
}