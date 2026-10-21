import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';


export class AlertSection extends BasePage {
    defaultAlertLabel = new Label(this.page, "//div[contains(@class,'alert alert-') and not(contains(@class,'info'))]");
    successfullyAlertLabel = new Label(this.page, "//div[@class='alert alert-success']");
    errorAlertLabel = new Label(this.page, "//div[@class='alert alert-error']");
    infoTitleAlertLabel = new Label(this.page, "//div[@class='alert alert-info text-center']/h4");
    infoDetailAlertLabel = new Label(this.page, "//div[@class='alert alert-info text-center']/strong");
    centerTitleAlertLabel = new Label(this.page, "//div[@class='alert text-center']/h4");
    centerDetailAlertLabel = new Label(this.page, "//div[@class='alert text-center']");
    closeButtonSuccessfullyAlert = new Button(this.page, "//div[@class='alert alert-success']/button[@class='close' and not (@id)]");
    yesRemoveDialogButton = new Button(this.page, '//*[@id="remove-dialog"]//a[text()="Yes"]');
    warningLabel = new Label(this.page, "//h3[@class='error']");
    petIconLoading = new Label(this.page, "//div[@class='loading__container']");



    async verifySuccessAlertText(expectedText: string, timeout = timeouts.long): Promise<void> {
        logger.info(`[AlertSection.verifySuccessAlertText] Verifying success alert text: ${expectedText}`);
        await this.successfullyAlertLabel.waitForVisible(timeout);
        const actualResult = await this.successfullyAlertLabel.getText(timeout);
        logger.info(`[AlertSection.verifySuccessAlertText] Actual result: ${actualResult}`);
        expect(actualResult).toContain(expectedText);
        if (await this.closeButtonSuccessfullyAlert.isDisplayed(timeouts.short)) {
            await this.closeButtonSuccessfullyAlert.waitForVisible();
            await this.closeButtonSuccessfullyAlert.clickAndWait('load');
        }
    }
    async verifyWarningAlertText(expectedText: string, timeout = timeouts.long): Promise<void> {
        logger.info(`[AlertSection.verifyWarningAlertText] Verifying warning alert text: ${expectedText}`);
        await this.warningLabel.waitForVisible(timeout);
        const actualResult = await this.warningLabel.getText(timeout);
        logger.info(`[AlertSection.verifyWarningAlertText] Actual result: ${actualResult}`);
        expect(actualResult).toContain(expectedText);
    }

    async getClaimNumberFromSuccessAlert(timeout = timeouts.long): Promise<string> {
        logger.info('[AlertSection.getClaimNumberFromSuccessAlert] - Getting claim number from success alert');
        await this.successfullyAlertLabel.waitForVisible(timeout);
        const currentMessageText = await this.successfullyAlertLabel.getText(timeout);
        logger.info(`[AlertSection.getClaimNumberFromSuccessAlert] - Alert text: ${currentMessageText}`);

        const pattern = /Successfully assigned claim (.*) to (.*)/;
        const match = currentMessageText.match(pattern);

        if (match && match[1]) {
            const claimNumber = match[1];
            logger.info(`[AlertSection.getClaimNumberFromSuccessAlert] - Extracted claim number: ${claimNumber}`);
            return claimNumber;
        } else {
            const errorMessage = `[AlertSection.getClaimNumberFromSuccessAlert] - The claim number is not displayed, actual: ${currentMessageText}`;
            logger.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

}