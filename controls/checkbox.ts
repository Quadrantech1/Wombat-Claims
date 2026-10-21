import { Locator, Page } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { ControlBase } from './control-base';

export class Checkbox extends ControlBase {
    constructor(page: Page, selectorOrLocator: string | Locator) {
        super(page, selectorOrLocator);
    }

    /**
     * Returns true if the checkbox is checked, false otherwise
     * @returns Promise<boolean> indicating checked state
     */
    public async isChecked(): Promise<boolean> {
        const checked = await this.locator.isChecked();
        logger.info(`[Checkbox>isChecked]Checkbox checked state: ${checked}`);
        return checked;
    }

    public override async check(timeout = timeouts.default): Promise<this> {
        await this.locator.check({ timeout });
        logger.info(`[Checkbox>check]Checked checkbox element: ${this.locator.toString()}`);
        return this;
    }

    /**
     * Checks the checkbox and accepts the alert dialog if it appears
     * @param timeout - Optional timeout in milliseconds
     * @returns Promise<this>
     */
    public async checkWithAlert(timeout = timeouts.default): Promise<this> {
        const isCurrentlyChecked = await this.isChecked();
        if (!isCurrentlyChecked) {
            this.page.once('dialog', async dialog => {
                logger.info(`[Checkbox>checkWithAlert] Dialog appeared with message: ${dialog.message()}`);
                await dialog.accept();
            });
            await this.locator.check({ timeout });
            logger.info(`[Checkbox>checkWithAlert] Checked checkbox element with alert handling: ${this.locator.toString()}`);
        } else {
            logger.info(`[Checkbox>checkWithAlert] Checkbox already checked, skipping: ${this.locator.toString()}`);
        }
        return this;
    }

    /**
     * Unchecks the checkbox and accepts the alert dialog if it appears
     * @param timeout - Optional timeout in milliseconds
     * @returns Promise<this>
     */
    public async uncheckWithAlert(timeout = timeouts.default): Promise<this> {
        const isCurrentlyChecked = await this.isChecked();
        if (isCurrentlyChecked) {
            this.page.once('dialog', async dialog => {
                logger.info(`[Checkbox>uncheckWithAlert] Dialog appeared with message: ${dialog.message()}`);
                await dialog.accept();
            });
            await this.locator.uncheck({ timeout });
            logger.info(`[Checkbox>uncheckWithAlert] Unchecked checkbox element with alert handling: ${this.locator.toString()}`);
        } else {
            logger.info(`[Checkbox>uncheckWithAlert] Checkbox already unchecked, skipping: ${this.locator.toString()}`);
        }
        return this;
    }
}