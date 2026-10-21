import { Page, Locator } from '@playwright/test';
import { ControlBase } from "./control-base";

export class Button extends ControlBase {
    constructor(page: Page, selectorOrLocator: string | Locator) {
        super(page, selectorOrLocator);
    }
}
