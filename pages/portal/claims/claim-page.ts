import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { ClaimData, getDefaultClaimData } from '@data/portal/claim-data';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { BasePage } from '../../base-page';

export class ClaimPage extends BasePage {
    // Select Controls
    selectPetSelect = new Select(this.page, "//*[text()='Pet Name']/parent::select");
    selectPolicySelect = new Select(this.page, "//select[@formcontrolname='policyId']");

    // Radio Buttons
    yesAdditionalInsurance = new RadioButton(this.page, "//label[contains(.,'Yes')]/span");
    noAdditionalInsurance = new RadioButton(this.page, "//label[contains(.,'No')]/span");

    // Checkboxes
    injuryIllnessCheckBox = new Checkbox(this.page, "//label[contains(.,'Injury or Illness')]/span");
    wellnessCheckbox = new Checkbox(this.page, "//label[contains(.,'Wellness')]/span");
    agreeCheckBox = new Checkbox(this.page, "//span[@class='checkbox__checkmark']");

    // Text Inputs
    tellUsTextBox = new TextBox(this.page, "//textarea[@formcontrolname='diagnosis']");
    signCalendar = new TextBox(this.page, "//input[@ng-reflect-name='onsetDate' or @formcontrolname='onsetDate']");
    treatmentCalendar = new TextBox(this.page, "//input[@formcontrolname='treatmentStartDate' or @formcontrolname='treatmentStartDate']");
    uploadFileTextBox = new TextBox(this.page, "//input[@formcontrolname='fileInput']");

    // Buttons
    uploadFileButton = new Button(this.page, "//pp-button[@showicon='upload']/button");
    submitClaimButton = new Button(this.page, "//button[contains(.,'Submit Claim')]");
    cancelButton = new Button(this.page, "//a[contains(.,'Cancel')]");

    // Labels
    uploadFileLabel = new Label(this.page, this.page.getByRole('heading', { name: 'File Upload' }));
    claimNumber = new Label(this.page, "//div[@class=\"claim__number\"]");

    /**
     * Fill the claim form with provided data
     * @param claimData - Partial data containing only the fields to update
     * @returns Promise that resolves when the form is successfully filled
     */
    async fillClaim(claimData?: Partial<ClaimData>): Promise<void> {
        const formData = { ...getDefaultClaimData(), ...claimData };
        logger.info("[ClaimPage>fillClaim] Filling claim form with data: ", formData);
        // todo: Add logging

        // Select policy if specified
        await this.page.waitForLoadState('load');
        if (formData.policyId && formData.policyId !== 'auto-select') {
            await this.selectPolicySelect.waitForVisible(timeouts.default);
            await this.selectPolicySelect.selectValue(formData.policyId);
            await this.page.waitForLoadState('networkidle');
        }

        // Handle additional insurance
        if (formData.hasAdditionalInsurance) {
            await this.yesAdditionalInsurance.clickAndWait('load');
        } else {
            await this.noAdditionalInsurance.clickAndWait('load');
        }

        // Select claim type
        if (formData.claimType === 'injury-illness') {
            await this.injuryIllnessCheckBox.click();
        } else if (formData.claimType === 'wellness') {
            await this.wellnessCheckbox.click();
        }

        // Fill text inputs
        await this.tellUsTextBox.setText(formData.tellUsAboutClaim);
        await this.signCalendar.setText(formData.signDate);
        await this.treatmentCalendar.setText(formData.treatmentDate);

        // Upload file only if path is provided
        if (formData.uploadFilePath) {
            await this.uploadFileTextBox.setInputFiles(formData.uploadFilePath);
        }

        // Agree to terms
        if (formData.agreeToTerms) {
            await this.agreeCheckBox.click();
        }
        logger.info('[ClaimPage.fillClaim] Claim form filled successfully');
    }

    /**
     * Submit the claim form
     * @returns Promise that resolves when the claim is successfully submitted
     */
    async submitClaim(): Promise<void> {
        logger.info('[ClaimPage.submitClaim] Submitting claim form');
        await this.submitClaimButton.click();
        await this.submitClaimButton.waitForDisappear(timeouts.long);
    }

    /**
     * Get the claim number after successful submission
     * @returns Promise that resolves with the claim number as a string
     */
    async getClaimNumber(): Promise<string> {
        logger.info('[ClaimPage.getClaimNumber] Retrieving claim number');
        await this.claimNumber.waitForVisible(timeouts.default);
        const claimNumberText = await this.claimNumber.getText();
        return claimNumberText.replace(/\s+/g, '');
    }
}
