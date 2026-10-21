import { Locator, Page } from "@playwright/test";
import { timeouts } from "@utils/timeouts-util";
import { ControlBase } from "./control-base";

export class Label extends ControlBase {
    constructor(page: Page, selectorOrLocator: string | Locator) {
        super(page, selectorOrLocator);
    }

    /**
     * Gets the text value of the label
     * @param timeout Optional timeout in milliseconds
     */
    override async getValue(timeout = timeouts.default): Promise<string> {
        return this.getText(timeout);
    }

}
