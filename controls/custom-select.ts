import { Page } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { Label } from './label';
import { Select } from './select';
import { TextBox } from './textbox';

export class CustomSelectSpan extends Select {
  private optionLabel: string;
  private searchTextBox: TextBox;

  constructor(
    page: Page,
    locator: string,
    optionLabel: string,
    locatorSearch: string
  ) {
    super(page, locator);
    this.optionLabel = optionLabel;
    this.searchTextBox = new TextBox(page, locatorSearch);
  }

  public async setAndSelectValue(value: string): Promise<void> {
    logger.info(`[CustomSelectSpan.setAndSelectValue] Setting and selecting value: ${value}`);
    await this.locator.click();
    await this.searchTextBox.setText(value);
    const option = new Label(this.page, `//${this.optionLabel}[text()='${value}']`);
    await option.click();
  }

  public async setAndSelectContainsValue(value: string): Promise<void> {
    logger.info(`[CustomSelectSpan.setAndSelectContainsValue] Setting and selecting contains value: ${value}`);
    await this.locator.click();
    await this.searchTextBox.setText(value);
    const option = new Label(this.page, `//${this.optionLabel}[contains(text(),'${value}')]`);
    await option.click();
  }

  public override async firstValue(): Promise<this> {
    logger.info(`[CustomSelectSpan.firstValue] Selecting first value in custom select span: ${this.locator.toString()}`);
    await this.locator.click();
    const options = await this.page.$$(`//${this.optionLabel}`);
    if (options.length > 2) {
      await options[2].click();
    }
    return this;
  }

  async selectOptionByPartialText(value: string): Promise<void> {
    logger.info(`${this.constructor.name}> Set on [${this.locator}] ${this.constructor.name} the value: [${value}]`);

    await this.click();
    await this.searchTextBox.setText(value);
    await this.page.waitForTimeout(timeouts.polling);

    logger.info(`${this.constructor.name}> Set on [${this.locator}] ${this.constructor.name} the value: [${value}]`);
    const optionLocator = `//${this.optionLabel}[contains(text(),'${value}')]`;
    const option = new Label(this.page, optionLocator);
    await option.click();
    await this.page.waitForTimeout(timeouts.polling);
  }
}