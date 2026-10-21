import { Button } from '@controls/button';
import { CustomSelectSpan } from '@controls/custom-select';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { GroupFollowupData, getDefaultGroupFollowupData } from '@data/orca-group/group-followup-data';
import { BasePage } from '@pages/base-page';
import { AlertSection } from '@pages/orca/common-section/alert-section';
import { logger } from '@utils/logger-util';

export class GroupFollowupDetailPage extends BasePage {
    assignedToSelect = new CustomSelectSpan(this.page, "//span[@id='select2-assigned-to-container']", "ul[@class='select2-results__options']/li", "//input[@class='select2-search__field']");
    followUpTypeSelect = new Select(this.page, "//select[@id='followup-type']");
    complaintTypeSelect = new Select(this.page, "//select[@id='GroupFollowup_ComplaintTypeId']");
    receivedOnTextBox = new TextBox(this.page, "#GroupFollowup_ReceivedOn");
    followUpByTextBox = new TextBox(this.page, "#GroupFollowup_FollowupBy");
    closedOnTextBox = new TextBox(this.page, "#GroupFollowup_ClosedOn");

    summaryTextBox = new TextBox(this.page, "#GroupFollowup_Summary");
    resolutionTextBox = new TextBox(this.page, "#GroupFollowup_Resolution");

    cancelButton = new Button(this.page, "//a[@title='Cancel']");
    saveButton = new Button(this.page, "//button[contains(.,'Save')]");

    alertSection = new AlertSection(this.page);

    async fillFollowupDetailPage(followUpData?: Partial<GroupFollowupData>): Promise<void> {
        logger.info('[GroupFollowupDetailPage.fillFollowupDetailPage] - Filling follow up detail page');

        const data = { ...getDefaultGroupFollowupData(), ...followUpData };

        if ((data.assignedTo ?? '').includes('random')) {
            await this.assignedToSelect.firstValue();
        } else if (data.assignedTo) {
            await this.assignedToSelect.setAndSelectContainsValue(data.assignedTo);
        }

        if (data.followUpType) await this.followUpTypeSelect.selectOption(data.followUpType);
        if (data.complaintType) await this.complaintTypeSelect.selectOption(data.complaintType);

        if (data.receivedOn) await this.receivedOnTextBox.setTextAndTab(data.receivedOn);
        if (data.followUpBy) await this.followUpByTextBox.setTextAndTab(data.followUpBy);
        if (data.closedOn) await this.closedOnTextBox.setTextAndTab(data.closedOn);

        if (data.summary) await this.summaryTextBox.setText(data.summary);
        if (data.resolution) await this.resolutionTextBox.setText(data.resolution);

        await this.saveButton.click();
    }
}
