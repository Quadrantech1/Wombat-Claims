import { Button } from '@controls/button';
import { CustomSelectSpan } from '@controls/custom-select';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { FollowUpDetailData, getDefaultFollowUpDetailData } from '@data/orca/follow-up-detail-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class FollowUpDetailPage extends BasePage {
    assignedToSelect = new CustomSelectSpan(
        this.page,
        "//span[@id='select2-assigned-to-container']",
        "ul[@class='select2-results__options']/li",
        "//input[@class='select2-search__field']"
    );
    followUpTypeSelect = new Select(this.page, '#followup-type');
    complaintTypeSelect = new Select(this.page, '#Followup_ComplaintTypeId');

    receivedOnTextBox = new TextBox(this.page, '#Followup_received_on');
    followUpByTextBox = new TextBox(this.page, '#Followup_followup_by');
    closedOnTextBox = new TextBox(this.page, '#Followup_closed_on');

    summaryTextBox = new TextBox(this.page, '#Followup_Summary');
    resolutionTextBox = new TextBox(this.page, '#Followup_Resolution');

    cancelButton = new Button(this.page, "//a[@title='Cancel']");
    saveButton = new Button(this.page, "//button[contains(.,'Save')]");

    /**
     * Fills the follow-up detail form with provided data or defaults
     * @param data - Optional data object with form fields to override defaults
     */
    async fillFollowUpDetailForm(data?: Partial<FollowUpDetailData>): Promise<void> {
        const defaultData = getDefaultFollowUpDetailData();
        const formData = { ...defaultData, ...data };
        logger.info(`[FollowUpDetailPage.fillFollowUpDetailForm] - Filling follow-up detail form with data: ${JSON.stringify(formData)}`);

        if (formData.assignedTo.toLowerCase() === 'random') {
            await this.assignedToSelect.firstValue();
        } else {
            await this.assignedToSelect.setAndSelectContainsValue(formData.assignedTo);
        }

        await this.followUpTypeSelect.selectOption(formData.followUpType);
        await this.complaintTypeSelect.selectOption(formData.complaintType);
        await this.summaryTextBox.setText(formData.summary);
        await this.resolutionTextBox.setText(formData.resolution);

        logger.info(`[FollowUpDetailPage.fillFollowUpDetailForm] - Follow-up detail form filled successfully`);
    }
}
