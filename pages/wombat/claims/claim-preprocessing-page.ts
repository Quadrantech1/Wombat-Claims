import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { LoadingCoverBarSection } from '../common/loading-cover-bar-section';

export class ClaimPreprocessingPage extends BasePage {
    selectFileTextBox = new TextBox(this.page, '//form/input');

    enterSearchCriteriaTextBox = new TextBox(this.page, '#customerSearch');
    searchButton = new Button(this.page, '//mat-card-content//button[contains(.,\'Search\')]');

    customerNameLabel = new Label(this.page, '//b[contains(.,\'Customer Name\')]/..');
    petNameLabel = new Label(this.page, '//b[contains(.,\'Pet Name\')]/..');
    accountStatusLabel = new Label(this.page, '//b[contains(.,\'Account Status\')]/..');

    /** dialog */
    typeOfFileSelect = new Select(this.page, '//div[contains(.,\'Type of File\')]/..//mat-select');
    fileDescriptionTextBox = new TextBox(this.page, '//div[contains(.,\'File Description\')]/../mat-form-field//input');
    submitButton = new Button(this.page, '//button[contains(.,\'Submit\')]');
    cancelButton = new Button(this.page, '//div[@class="close"]');
    /**end dialog */

    vetSearchTextBox = new TextBox(this.page, '');
    vetSearchButton = new Button(this.page, '#search_button');
    receivedDateTextBox = new TextBox(this.page, '//div[contains(text(),\'Received Date\')]/..//input');
    dateOfTreatmentTextBox = new TextBox(this.page, '//div[contains(text(),\'Treatment\')]/..//input');
    amountClaimedTextBox = new TextBox(this.page, '//div[contains(text(),\'Amount Claimed\')]/..//input');
    saveDateTreatmentButton = new Button(this.page, '//mat-icon[text()=\'save\']');

    wellnessCheckBox = new Button(this.page, '//label[contains(.,\'Wellness\')]');
    payVetCheckBox = new Button(this.page, '//label[contains(.,\'Pay Vet\')]');
    estimateCheckBox = new Button(this.page, '//label[contains(.,\'Estimate\')]');

    saveClaimButton = new Button(this.page, '//button[contains(.,\'Save Claim\')]');

    submitToMyProcessingQueueRadioButton = new RadioButton(this.page, '//label[contains(.,\'Submit to My Processing Queue\')]');
    submitToGeneralProcessingQueueRadioButton = new RadioButton(this.page, '//label[contains(.,\'Submit To General Processing Queue\')]');

    submitClaimButton = new Button(this.page, '//button[contains(.,\'Submit Claim\')]');
    markAsDuplicateButton = new Button(this.page, '//button[contains(.,\'Mark as Duplicate\')]');
    sendToRecordRequestingButton = new Button(this.page, '//button[contains(.,\'Send to Records Requesting\')]');

    loadingCoverBarSection = new LoadingCoverBarSection(this.page);

    async getClaimIdValue(): Promise<string> {
        logger.info('[ClaimPreprocessingPage.getClaimIdValue] Retrieving claim ID value from the page.');
        const claimIdLabel = new Label(this.page, '//mat-card-title[contains(.,\'Claim ID\')]');
        const text = await claimIdLabel.getText();
        const match = text.match(/\d+/);
        logger.info(`[ClaimPreprocessingPage.getClaimIdValue] Extracted claim ID: ${match ? match[0] : 'Not found'}`);
        return match ? match[0] : '';
    }

    async fillClaimPreprocessingForm(claimData: { dateOfTreatment: string; amountClaimed: string }): Promise<void> {
        logger.info('[ClaimPreprocessingPage.fillClaimPreprocessingForm] Filling claim preprocessing form with data: ' + JSON.stringify(claimData));
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
        await this.dateOfTreatmentTextBox.setText(claimData.dateOfTreatment);
        await this.amountClaimedTextBox.setText(claimData.amountClaimed);
        await this.saveDateTreatmentButton.click();
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
        await this.saveClaimButton.clickAndWait();
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
        await this.submitToGeneralProcessingQueueRadioButton.clickAndWait();
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
        await this.submitClaimButton.clickAndWait();
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
    }

}
