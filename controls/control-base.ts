import { Locator, Page } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class ControlBase {
    protected locator: Locator;
    public page: Page;

    constructor(page: Page, selectorOrLocator: string | Locator) {
        this.page = page;
        this.locator = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator) : selectorOrLocator;
    }

    /**
     * Clicks the element and waits for the following conditions before and after the click:
     * - The element is attached to the DOM, visible, enabled, and stable (not animating).
     * - Performs the click action.
     * - Waits for any scheduled navigations (such as page loads or redirects) triggered by the click to finish.
     * @param timeout Optional timeout in milliseconds for the entire operation (default: Timeouts.default).
     * @returns A promise that resolves to this control after the click and any navigation is complete.
     */
    public async click(timeout = timeouts.default): Promise<this> {
        logger.info(`[ControlBase>click] Clicking element: ${this.locator.toString()}`);
        await this.locator.click({ timeout });
        return this;
    }

    /**
     * Clicks the element and waits for the page to reach a specific load state.
     * @param waitFor The load state to wait for after clicking: 'networkidle' (default) or 'load'.
     * @param timeout Optional timeout in milliseconds for the entire operation (default: Timeouts.default).
     * @returns A promise that resolves to this control after the click and the specified load state is reached.
     */
    public async clickAndWait(waitFor: 'networkidle' | 'load' = 'networkidle', timeout = timeouts.default): Promise<this> {
        logger.info(`[ControlBase.clickAndWait] Clicking element and waiting for ${waitFor}: ${this.locator.toString()}`);
        await this.locator.click({ timeout });
        await this.page.waitForLoadState(waitFor, { timeout });
        logger.info(`[ControlBase.clickAndWait] ${waitFor} state reached after click`);
        return this;
    }

    /**
     * Selects an option in the element
     * For Select elements with option list: <option value="red">Red</option>
     * @param value The value of the option to select
     */
    public async selectValue(value: string | undefined): Promise<this> {
        logger.info(`[ControlBase>selectValue] Selecting option: ${value} in element: ${this.locator.toString()}`);
        await this.locator.selectOption(value!);
        return this;
    }

    /**
     * Checks if the element is visible, use only for checking visibility in if statements
     * only checks if the element is in the DOM and visible
     * Use waitForVisible() for waiting
     * use expect(locator).toBeVisible() for assertion
     * @param timeout Optional timeout in milliseconds
     */
    public async isDisplayed(timeout = timeouts.polling): Promise<boolean> {
        try {
            await this.locator.waitFor({ timeout });
            const isVisible = await this.locator.isVisible();
            logger.info(`[ControlBase>isDisplayed] Element is displayed: ${isVisible} - ${this.locator.toString()}`);
            return isVisible;
        } catch {
            logger.info(`[ControlBase>isDisplayed] Element is NOT displayed: ${this.locator.toString()}`);
            return false;
        }
    }

    /**
     * Gets the text content of the element
     * @param timeout Optional timeout in milliseconds
     */
    public async getText(timeout = timeouts.default): Promise<string> {
        const text = await this.locator.innerText({ timeout });
        logger.info(`[ControlBase>getText] Got text from element: ${this.locator.toString()}, value: [${text}]`);
        return text;
    }

    /**
     * Waits for the element to become visible
     * @param timeout Optional timeout in milliseconds
     */
    public async waitForVisible(timeout = timeouts.default): Promise<this> {
        await this.locator.waitFor({ state: 'visible', timeout });
        logger.info(`[ControlBase>waitForVisible] Element is visible: ${this.locator.toString()}`);
        return this;
    }

    public async waitForExistInDom(timeout = timeouts.default): Promise<this> {
        await this.locator.waitFor({ state: 'attached', timeout });
        logger.info(`[ControlBase.waitForExistInDom] Element exists in the DOM: ${this.locator.toString()}`);
        return this;
    }


    /**
     * Hovers over the element
     * @param timeout Optional timeout in milliseconds
     */
    public async hover(timeout = timeouts.default): Promise<this> {
        logger.info(`[ControlBase>hover] Hovering over element: ${this.locator.toString()}`);
        await this.locator.hover({ timeout });
        return this;
    }


    public async hoverAndWait(waitFor: 'networkidle' | 'load' = 'networkidle', timeout = timeouts.default): Promise<this> {
        logger.info(`[ControlBase>hoverAndWait] Hovering over element: ${this.locator.toString()}`);
        await this.locator.evaluate((el: HTMLElement) => {
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        });
        await this.page.waitForLoadState(waitFor, { timeout });
        logger.info(`[ControlBase.hoverAndWait] ${waitFor} state reached after hover`);
        return this;
    }

    /**
     * Checks if the element is enabled
     * @param timeout Optional timeout in milliseconds
     */
    public async isEnabled(timeout = timeouts.default): Promise<boolean> {
        const enabled = await this.locator.isEnabled({ timeout });
        logger.info(`[ControlBase>isEnabled] Element is enabled: ${enabled} - ${this.locator.toString()}`);
        return enabled;
    }

    /**
     * Checks if the element is disabled
     * @param timeout Optional timeout in milliseconds
     */
    public async isDisabled(timeout = timeouts.default): Promise<boolean> {
        const disabled = await this.locator.isDisabled({ timeout });
        logger.info(`[ControlBase>isDisabled] Element is disabled: ${disabled} - ${this.locator.toString()}`);
        return disabled;
    }

    /**
     * Gets the number of matching elements
     */
    public async getElementCount(): Promise<number> {
        const count = await this.locator.count();
        logger.info(`[ControlBase>getElementCount] Element count: ${count} - ${this.locator.toString()}`);
        return count;
    }

    /**
     * Returns the Playwright locator for this control
     */
    public getLocator(): Locator {
        return this.locator;
    }

    /**
     * Waits for a control to disappear from the DOM or become hidden
     * @param timeout Optional timeout in milliseconds
     */
    public async waitForDisappear(timeout = timeouts.default): Promise<this> {
        await this.locator.waitFor({ state: 'hidden', timeout });
        logger.info(`[ControlBase>waitForDisappear] Element has disappeared: ${this.locator.toString()}`);
        return this;
    }

    public async waitWhileControlDisappears(timeout: number = timeouts.default): Promise<this> {
        logger.info(`[ControlBase>waitWhileControlDisappears] Waiting for element to disappear: ${this.locator.toString()}`);
        await this.locator.waitFor({ state: 'detached', timeout });
        return this;
    }



    /**
     * Types text in the current control (simulates actual typing by pressing keys sequentially)
     * @param text Text to type in the control
     * @returns A promise that resolves to this control after typing is complete
     */
    public async typeText(text: string): Promise<this> {
        logger.info(`Typing text in element: ${this.locator.toString()}, value: [${text}]`);
        await this.locator.pressSequentially(text);
        return this;
    }

    /**
     * Presses a keyboard key on the element
     * @param key The key to press (e.g., 'Enter', 'Tab', 'ArrowDown')
     * @param timeout Optional timeout in milliseconds
     */
    public async press(key: string, timeout = timeouts.default): Promise<this> {
        await this.locator.press(key, { timeout });
        return this;
    }

    /**
     * Sets file(s) for an <input type="file"> element
     * @param files Path(s) to the file(s) to upload
     * @param timeout Optional timeout in milliseconds
     */
    public async setInputFiles(files: string | string[], timeout = timeouts.default): Promise<this> {
        await this.locator.setInputFiles(files, { timeout });
        return this;
    }


    public async getAttribute(attributeName: string, timeout = timeouts.default): Promise<string | null> {
        try {
            const attributeValue = await this.locator.getAttribute(attributeName, { timeout });
            logger.info(`Got attribute ${attributeName} from element: ${this.locator.toString()}, value: [${attributeValue}]`);
            return attributeValue;
        } catch (error) {
            logger.error(`Failed to get attribute ${attributeName} from element: ${this.locator.toString()}`, error);
            return null;
        }
    }

    async getValue(): Promise<string> {
        const value = await this.locator.inputValue();
        logger.info(`[TextBox>getValue] Got value from element: ${this.locator.toString()}, value: [${value}]`);
        return value;
    }

    
    public async check(timeout = timeouts.default): Promise<this> {
        await this.locator.check({ timeout });
        logger.info(`[Checkbox>check]Checked checkbox element: ${this.locator.toString()}`);
        return this;
    }
    /**
    * Robustly checks the checkbox, with scroll, waits, and direct evaluate fallback for mobile.
    * @param timeout - Optional timeout in milliseconds for waiting actions (default: Timeouts.short).
    * @returns Promise<void>
    */
    public async checkMobile(timeout = timeouts.short): Promise<void> {
        logger.info(`[Checkbox>checkMobile] Robustly checking checkbox: ${this.locator.toString()}`);
        await this.locator.scrollIntoViewIfNeeded();
        await this.locator.waitFor({ state: 'visible', timeout });
        await this.locator.waitFor({ state: 'attached', timeout });
        await this.page.waitForTimeout(timeouts.polling);
        try {
            await this.check(timeout);
        } catch (e) {
            await this.page.waitForTimeout(timeouts.polling);
            await this.locator.evaluate((checkbox: HTMLInputElement) => {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('input', { bubbles: true }));
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
            logger.warning(`[Checkbox>checkMobile] Fallback: checked via evaluate for element: ${this.locator.toString()}`);
        }
    }
}