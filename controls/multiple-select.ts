import { Locator, Page } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { ControlBase } from './control-base';
import { Label } from './label';

/**
 * Control for interacting with multi-select dropdown components (e.g., ng-select)
 */
export class MultipleSelect extends ControlBase {
    constructor(page: Page, selectorOrLocator: string | Locator) {
        super(page, selectorOrLocator);
    }

    /**
     * Selects multiple options from the dropdown
     * @param values - Array of option texts to select
     */
    async selectOption(values: string[]): Promise<void> {
        logger.info(`[MultipleSelect.selectOption] - Selecting options: ${values.join(', ')}`);

        for (const value of values) {
            const stateLabel = new Label(
                this.page,
                `//ng-dropdown-panel[@role='listbox']//div[@role='option']/span[contains(text(),'${value}')]`
            );
            await stateLabel.click();
        }
    }

    /**
     * Gets all values from the state assignment dropdown
     * @returns Array of state names
     */
    async getValuesInStateAssignmentDropDown(): Promise<string[]> {
        logger.info(`[MultipleSelect.getValuesInStateAssignmentDropDown] - Getting all values from dropdown`);

        const elements = await this.locator.all();
        const states: string[] = [];

        for (const element of elements) {
            const text = await element.textContent();
            if (text) {
                states.push(text.trim());
            }
        }

        logger.info(`[MultipleSelect.getValuesInStateAssignmentDropDown] - Found ${states.length} options`);
        return states;
    }
}
