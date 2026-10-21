import { Locator, Page } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { ControlBase } from './control-base';
import { Label } from './label';
export class Select extends ControlBase {

    constructor(page: Page, selectorOrLocator: string | Locator) {
        super(page, selectorOrLocator);
    }

    async selectOption(value: string): Promise<void> {
        const selectElement = this.getLocator();
        logger.info(`[Select>selectOption]Selecting option with value: ${value} in element: ${this.locator.toString()}`);
        await selectElement.selectOption(value);
    }

    async selectOptionByLabel(label: string): Promise<void> {
        logger.info(`[Select.selectOptionByLabel] - Selecting option with label: ${label} in element: ${this.locator.toString()}`);
        await this.locator.selectOption({ label });
    }


    public async getTextOptionSelected(): Promise<string> {
        logger.info(`[Select>getTextOptionSelected]Getting text from element: ${this.locator.toString()}`);
        await this.locator.waitFor({ state: 'visible' });

        // Get the current value of the select element
        const selectedValue = await this.locator.inputValue();

        // Find the option with this value and get its text
        const selectedOption = this.locator.locator(`option[value="${selectedValue}"]`);
        const text = await selectedOption.textContent();

        logger.info(`[Select>getTextOptionSelected]Selected option text: ${text}`);
        return text?.trim() ?? '';
    }

    public async firstValue(): Promise<this> {
        logger.info(`[Select.firstValue] Selecting first value in element: ${this.locator.toString()}`);
        await this.locator.click();

        const options = await this.locator.locator('option').all();
        for (const option of options) {
            const label = await option.textContent();
            const value = await option.getAttribute('value');
            logger.info(`Option => label: "${label}", value: "${value}"`);
        }
        await this.locator.selectOption({ index: 1 });
        return this;
    }

    /**
     * Selects the first value in the dropdown and waits for the page to reach network idle state.
     * @returns A promise that resolves to this control after the selection and network idle.
     */
    public async firstValueAndWait(): Promise<this> {
        logger.info(`[Select.firstValueAndWait] Selecting first value and waiting for network idle: ${this.locator.toString()}`);
        await this.firstValue();
        await this.page.waitForLoadState('networkidle');
        logger.info(`[Select.firstValueAndWait] Network idle reached after selecting first value`);
        return this;
    }

    /**
     * Selects an option by its index (0-based)
     * @param index The index of the option to select
     * @returns This instance for method chaining
     */
    async selectByIndex(index: number): Promise<this> {
        logger.info(`[Select>selectByIndex]Selecting option at index: ${index} on ${this.locator.toString()}`);
        await this.locator.selectOption({ index });
        logger.info(`[Select>selectByIndex]Selected option at index: ${index} on ${this.locator.toString()}`);
        return this;
    }

    /**
     * Gets all option texts from the select element as an array.
     * @returns A promise that resolves to an array of all option texts.
     */
    async getAllOptionsArray(): Promise<string[]> {
        logger.info(`[Select>getAllOptionsArray] Getting all option texts from: ${this.locator.toString()}`);
        const options = this.locator.locator('option');
        const optionTexts = await options.allTextContents();
        const result = optionTexts.map(text => text.trim());
        logger.info(`[Select>getAllOptionsArray] Found ${result.length} options: ${result.join(', ')}`);
        return result;
    }

    async selectOptionSpan(value: string, property?: string): Promise<void> {
        const selectElement = this.getLocator();
        logger.info(`[Select>selectOptionSpan]Selecting option with value: ${value} in element: ${this.locator.toString()}`);
        await selectElement.click();
        await this.page.waitForTimeout(timeouts.halfSecond);
        const optionLabel = property
            ? new Label(this.page, `//span[${property} and contains(text(),'${value}')]`)
            : new Label(this.page, `//span[contains(text(),'${value}')]`);
        await optionLabel.clickAndWait();
        await this.page.waitForTimeout(timeouts.halfSecond);
    }

    async selectOptionLi(value: string, property?: string): Promise<void> {
        const selectElement = this.getLocator();
        logger.info(`[Select>selectOptionLi]Selecting option with value: ${value} in element: ${this.locator.toString()}`);
        await selectElement.click();
        await this.page.waitForTimeout(timeouts.halfSecond);
        const optionLabel = property
            ? new Label(this.page, `//li[${property} and contains(text(),'${value}')]`)
            : new Label(this.page, `//li[contains(text(),'${value}')]`);
        await optionLabel.clickAndWait("load");
        await this.page.waitForTimeout(timeouts.halfSecond);
    }
    async selectEqualOptionSpan(value: string, property?: string): Promise<void> {
        const selectElement = this.getLocator();
        logger.info(`[Select>selectOptionSpan]Selecting option with value: ${value} in element: ${this.locator.toString()}`);
        await selectElement.click();
        let optionLabel: Label;
        if (property) {
            optionLabel = new Label(this.page, `//span[${property} and text()='${value}']`);
        } else {
            optionLabel = new Label(this.page, `//span[text()='${value}']`);
        }
        await optionLabel.clickAndWait();
    }

}
