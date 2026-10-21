import { ControlBase } from "./control-base";
import { Page, Locator } from "@playwright/test";

export class Link extends ControlBase {
    constructor(page: Page, selectorOrLocator: string | Locator) {
        super(page, selectorOrLocator);
    }

}
