import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class SalesSummaryTabSection extends BasePage {

    enrollQuoteButton = new Button(this.page, "//button[contains(.,'Enroll Quote')]");

    premiumValueLabel = new Label(this.page, "//div[contains(text(),' Premium : ')]/..//span");
    installmentFeeValueLabel = new Label(this.page, "//div[contains(text(),'Installment Fee :')]/..//span");
    firstPaymentValueLabel = new Label(this.page, "//strong[contains(text(),'First Payment')]/../..//span");

    // enrroll dialog
    okEnrollmentDialogButton = new Button(this.page, '//mat-dialog-actions/button');


    async getAccountNumberValueFromEnrollmentDialog(): Promise<string> {
        const accountNumberLabel = new Label(this.page, '//mat-dialog-content');
        const dialogText = await accountNumberLabel.getText();
        const match = dialogText.match(/Account Number is\s+([A-Z0-9]+)/);
        if (!match) {
            throw new Error(`[SalesSummaryTabSection.getAccountNumberValue] - Could not extract account number from: ${dialogText}`);
        }
        logger.info(`[SalesSummaryTabSection.getAccountNumberValue] - Extracted account number: ${match[1]}`);
        return match[1];
    }

}

