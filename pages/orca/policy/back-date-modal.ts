import { Button } from '@controls/button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { Page } from '@playwright/test';
import { logger } from '@utils/logger-util';

export class BackDateSection extends BasePage {
  newEffectiveDateTextBox= new TextBox(this.page,"//input[@id='newDate']");
  coveragePeriodSelect = new Select(this.page,"//select[@id='mySelect']");
  notesTextBox = new TextBox(this.page,"#Notes");
  saveButton = new Button(this.page,"//div[@id='dialog-content']//button[contains(.,'Save')]");


  constructor(page: Page) {
    super(page);
  }

  public async setEffectiveDateAndCoveragePeriod(effectiveDate: string, coveragePeriod: string): Promise<void> {
    logger.info(`[BackDateSection.setEffectiveDateAndCoveragePeriod] Setting effective date: ${effectiveDate} and coverage period: ${coveragePeriod}`);
    await this.newEffectiveDateTextBox.waitForVisible();
    if (coveragePeriod === 'first') {
            await this.coveragePeriodSelect.firstValue();
    } else {
            await this.coveragePeriodSelect.selectOption(coveragePeriod);
    }

    await this.newEffectiveDateTextBox.click();
    await this.newEffectiveDateTextBox.clear();
    await this.newEffectiveDateTextBox.setTextTypeDate(effectiveDate);
    await this.notesTextBox.setText('Backdate effective date for automation testing');
       
  }

}