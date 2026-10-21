import { Locator, Page } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { ControlBase } from "./control-base";

export class TextBox extends ControlBase {
    constructor(page: Page, selectorOrLocator: string | Locator) {
        super(page, selectorOrLocator);
    }

    /**
     * Sets text in the current control (will clear existing text first)
     * @param text Text to set in the control
     * @param timeout Optional timeout in milliseconds
     */
    public async setText(text: string | undefined, timeout = timeouts.default): Promise<this> {
        await this.locator.fill(text!, { timeout });
        logger.info(`[TextBox>setText] Set text in element: ${this.locator.toString()}, value: [${text}]`);
        return this;
    }

    public async setTextTypeDate(text: string): Promise<this> {
        if (!text) throw new Error('[setTextTypeDate] No date provided.');
        const isoDate = this.formatToISO(text);
        await this.locator.evaluate((element, value) => {
            const input = element as HTMLInputElement;
            input.value = value;

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }, isoDate);

        logger.info(`[setTextTypeDate] Set date: ${isoDate} in element: ${this.locator.toString()}`);
        return this;
    }

    private formatToISO(date: string): string {
        const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
        if (!match) throw new Error(`[formatToISO] Invalid format: ${date}. Expected MM/DD/YYYY`);
        const [_, mm, dd, yyyy] = match;
        return `${yyyy}-${mm}-${dd}`;
    }

    /**
     * Checks if the textbox is empty
     * @returns {Promise<boolean>} True if textbox is empty, false otherwise
     */
    async isEmpty(): Promise<boolean> {
        logger.info(`[TextBox>isEmpty] Checking if textbox is empty in element: ${this.locator.toString()}`);
        const value = await this.locator.inputValue();
        return value.length === 0;
    }

    async selectTextOption(initialLetterOption: string, finalOption: string): Promise<void> {
        logger.info(`[TextBox.selectTextOption] Selecting "${finalOption}" with initial text "${initialLetterOption}"`);
        await this.locator.pressSequentially(initialLetterOption);
        await this.page.waitForTimeout(2000);

        const menuItems = this.page.locator(`//li[@class='ui-menu-item']/a`);
        const allTexts = await menuItems.allTextContents();

        // Find the option that contains our search term after " - " or starts with code
        const matchIndex = allTexts.findIndex(text =>
            text.includes(`- ${finalOption}`) ||
            text.startsWith(`${finalOption} -`) ||
            text.trim() === finalOption.trim()
        );

        if (matchIndex === -1) {
            throw new Error(
                `[TextBox.selectTextOption] No match for "${finalOption}". Available: ${allTexts.join(' | ')}`
            );
        }

        logger.info(`[TextBox.selectTextOption] Selected: "${allTexts[matchIndex]}"`);
        await menuItems.nth(matchIndex).click();
    }

    async setTextAndTab(text: string, timeout = timeouts.default): Promise<void> {
        await this.locator.fill(text!, { timeout });
        await this.locator.press('Tab');
        logger.info(`[Set text in element: ${this.locator.toString()} and pressed Tab`);
    }

    async setTextSequentially(text: string, timeout = timeouts.default): Promise<void> {
        await this.locator.pressSequentially(text!, { timeout });
        logger.info(`[Set text in element: ${this.locator.toString()}`);
    }


    /**
     * Clears the text from the textbox.
     * @returns {Promise<void>}
     */
    async clear(): Promise<void> {
        logger.info(`[TextBox>clear] Clearing text in element: ${this.locator.toString()}`);
        await this.locator.clear();
    }

    /**
     * Reads the browser's native HTML5 constraint-validation message (e.g. for an invalid type="email" value).
     * Empty string when the field currently passes native validation.
     * @returns {Promise<string>} The input element's native validationMessage
     */
    async getValidationMessage(): Promise<string> {
        const message = await this.locator.evaluate((el) => (el as HTMLInputElement).validationMessage);
        logger.info(`[TextBox.getValidationMessage] Native validation message for element: ${this.locator.toString()}, value: [${message}]`);
        return message;
    }

}
