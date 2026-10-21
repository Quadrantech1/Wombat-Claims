import { Page, FrameLocator, Locator } from 'playwright';
import { ControlBase } from './control-base';
import { TextBox } from './textbox';
import { Button } from './button';
import { Select } from './select';
import { logger } from '@utils/logger-util';
/**
 * iframe control for handling interactions with iframes in the page
 * Provides a factory method to create controls scoped to the iframe
 */
export class Iframe {
    private page: Page;
    private frameLocator: FrameLocator;

    /**
     * Creates a new iFrame control
     * @param page The Playwright page
     * @param selector The selector string for the iframe element
     */
    constructor(page: Page, selector: string) {
        this.page = page;
        this.frameLocator = page.frameLocator(selector);
    }

    /**
     * Gets a FrameLocator for the current iframe
     * @returns FrameLocator for this iframe
     */
    public getFrame(): FrameLocator {
        return this.frameLocator;
    }

    /**
     * Creates a control of the given type, scoped to this iframe
     * @param controlConstructor The control class constructor (e.g., TextBox, Button)
     * @param selector The selector for the element inside the iframe
     * @returns An instance of the control, scoped to the iframe
     */
    public createControl<T extends ControlBase>(
        controlConstructor: new (page: Page, selectorOrLocator: string | Locator) => T,
        selector: string
    ): T {
        const locator = this.frameLocator.locator(selector);
        return new controlConstructor(this.page, locator);
    }

    public textBox(selector: string) {
        return this.createControl(TextBox, selector);
    }

    public button(selector: string) {
        return this.createControl(Button, selector);
    }

    public select(selector: string) {
        return this.createControl(Select, selector);
    }
}
