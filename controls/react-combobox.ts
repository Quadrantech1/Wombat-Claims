import { Locator, Page } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { ControlBase } from './control-base';

/**
 * Control for the ARIA combobox pattern used by React sites (ASPCA/Sidney): a `role="combobox"`
 * trigger that toggles `aria-expanded` and opens a `role="listbox"` popup of `role="option"` items.
 * Some instances (e.g. Breed) additionally render an editable search input inside the trigger for
 * typeahead filtering, but only once the popup is open — others (e.g. Age) never render one and are
 * a static, non-editable list. Use `selectByTyping()` for typeahead variants and `select()` for
 * static variants; the caller must know which one a given field is (see method docs below) rather
 * than relying on a runtime DOM check, which is racy right after `open()`.
 */
export class ReactCombobox extends ControlBase {
    private listbox: Locator;

    constructor(page: Page, selectorOrLocator: string | Locator) {
        super(page, selectorOrLocator);
        this.listbox = page.getByRole('listbox');
    }

    /**
     * Returns the option locator scoped to the currently open listbox.
     * @param name Exact accessible option name (e.g. 'Under 8 weeks', 'Labrador Retriever')
     */
    private getOption(name: string): Locator {
        return this.listbox.getByRole('option', { name, exact: true });
    }

    /**
     * Opens the popup by clicking the trigger, unless it is already expanded.
     */
    async open(): Promise<this> {
        const isExpanded = await this.locator.getAttribute('aria-expanded');
        if (isExpanded !== 'true') {
            try {
                logger.info(`[ReactCombobox.open] - Opening combobox: ${this.locator.toString()}`);
                await this.locator.click();
                await this.listbox.waitFor({ state: 'visible', timeout: timeouts.polling });
            } catch (error) {
                logger.warning(`[ReactCombobox.open] - Failed to open combobox on first attempt: ${this.locator.toString()}`);
                await this.locator.click();
                await this.listbox.waitFor({ state: 'visible', timeout: timeouts.polling });
            }
        }
        return this;
    }

    /**
     * The trigger's embedded typeahead input — only present on typeahead variants (e.g. Breed), not
     * static variants (e.g. Age).
     */
    private get searchInput(): Locator {
        return this.locator.locator('input');
    }

    /**
     * Opens the popup (if needed) and selects an option by its exact accessible name, without typing.
     * Use for static-list variants that never render an embedded search input (e.g. Age, Filter by).
     * @param name Exact option text
     */
    async select(name: string): Promise<this> {
        logger.info(`[ReactCombobox.select] - Selecting option: ${name} in: ${this.locator.toString()}`);
        await this.open();
        const option = this.getOption(name);
        await option.waitFor({ state: 'visible', timeout: timeouts.veryShort });
        await option.click();
        return this;
    }

    /**
     * Opens the popup (if needed), types into the embedded search input to filter the list, then
     * selects the matching option by its exact accessible name. Use for typeahead variants only (e.g.
     * Breed) — the search input is only rendered once the popup is open, so it can't be reliably
     * @param name Exact option text
     */
    async selectByTyping(name: string): Promise<this> {
        logger.info(`[ReactCombobox.selectByTyping] - Selecting option: ${name} in: ${this.locator.toString()}`);
        await this.open();
        await this.searchInput.clear();
        await this.searchInput.pressSequentially(name);
        const option = this.getOption(name);
        await option.waitFor({ state: 'visible', timeout: timeouts.veryShort });
        await option.click();
        return this;
    }

    /**
     * Gets the currently displayed/selected text of the combobox trigger.
     */
    async getSelectedText(): Promise<string> {
        const text = await this.locator.innerText();
        logger.info(`[ReactCombobox.getSelectedText] - Selected text: ${text} in: ${this.locator.toString()}`);
        return text.trim();
    }
}
