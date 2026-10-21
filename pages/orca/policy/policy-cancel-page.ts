import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class PolicyCancelPage extends BasePage {
    cancelPolicyButton = new Button(this.page, "//a[text()=' Cancel Coverage']");
    cancelRequestOnTextBox = new TextBox(this.page, "//input[@id='CancelRequestedOn' and @class]");
    notesTextBox = new TextBox(this.page, '#Notes');
    cancelReasonDropdown = new Select(this.page, '#CancelReasonId');
    petnameTextBox = new TextBox(this.page, "//input[@formcontrolname='petName']");
    cancelNotesTextBox = new TextBox(this.page, '#Notes');
    body = new Button(this.page, '#dialog-content');
    cancelTypeDropdown = new Select(this.page, '#CancelTypeId');
    cancelSourceDropdown = new Select(this.page, '#CancelSourceId');
    saveButton = new Button(this.page, "//div[@class='modal-footer btn-block']//i[@class='icon-white icon-ok-circle']");
    returnPolicyButton = new Button(this.page, "//*[@id=\"quote-actions\"]/a");
    warningLabel = new Label(this.page, "//tr[@class='warning']");
    cancelCoverage = new Label(this.page, "//div[contains(text(),'Test')]");
    submitApprovalButton = new Button(this.page, "//a[text()=' Submit for Approval']");
    approveCancellationButton = new Button(this.page, "//a[text()=' Approve Cancellation']");
    approveChangesButton = new Button(this.page, '#btn-approve-changes');
    previewButton = new Button(this.page, '#preview');
    submitButton = new Button(this.page, '#submit-cancellation');

    async submitCancellation(): Promise<void> {
        logger.info('[PolicyCancelPage.submitCancellation] - Submitting cancellation');
        await this.previewButton.click();
        await this.submitButton.click();
    }

    async fillCancelPolicyForm(reason: string, type: string, source: string, notes: string, date?: string): Promise<void> {
        logger.info('[PolicyCancelPage.cancelPolicy] - Canceling policy');
        await this.cancelReasonDropdown.selectValue(reason);
        await this.cancelTypeDropdown.selectValue(type);
        await this.cancelSourceDropdown.selectValue(source);
        await this.cancelNotesTextBox.setText(notes);
        if (date) {
            await this.cancelRequestOnTextBox.setTextAndTab(date);
        }
        logger.info('[PolicyCancelPage.cancelPolicy] - Cancellation form filled out');
    }
}
