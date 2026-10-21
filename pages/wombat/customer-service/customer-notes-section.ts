import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class CustomerNotesSection extends BasePage {
    searchTextBox = new TextBox(this.page, '//input');
    refreshButton = new Button(this.page, "#refresh");


    async checkNotesValue(value: string): Promise<boolean> {
        logger.info(`[CustomerNotesSection>checkNotesValue] Checking if note value "${value}" is displayed in the notes section.`);
        let noteValueLabel = new Label(this.page, this.page.locator(`//div[@class="customerNote" and contains(text(),'${value}')]`).first());
        let maxTimeOut = 0;
        do {
            logger.info(`[CustomerNotesSection>checkNotesValue] Attempt ${maxTimeOut + 1}: Checking if note value "${value}" is displayed.`);
            await this.page.waitForTimeout(timeouts.ten);
            await this.refreshButton.getLocator().dblclick();
            await this.refreshButton.clickAndWait();
            maxTimeOut = maxTimeOut + 1;
        } while (!await noteValueLabel.isDisplayed() && maxTimeOut < 6); // Repeat until the label is found or max timeout is reached
        return await noteValueLabel.isDisplayed();
    }

}
