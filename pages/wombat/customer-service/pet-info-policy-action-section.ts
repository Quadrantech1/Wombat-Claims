import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Select } from '@controls/select';
import { BasePage } from '@pages/base-page';
import { timeouts } from '@utils/timeouts-util';

export class PetInfoPolicyActionSection extends BasePage {

    addSummaryButton = new Button(this.page, "//div[@id='policy-options']//button[contains(.,'Summary')]");

    cancelRewriteRadioButton = new Button(this.page, "//span[text()=' Cancel Rewrite ']");
    // upgrades

    // accident only coverage
    accidentOnlyCoverageCheckBox = new Checkbox(this.page, "//span[contains(text(),'Accident Only Coverage')]/..");
    annualLimitAccidentOnlySelect = new Select(this.page, "//span[contains(text(),'Accident Only Coverage')]/../../../..//div[contains(text(),'Annual Limit')]/..//mat-select");
    reimbursmentAccidentOnlySelect = new Select(this.page, "//span[contains(text(),'Accident Only Coverage')]/../../../..//div[contains(text(),'Reimbursment')]/..//mat-select");
    deductibleAccidentOnlySelect = new Select(this.page, "//span[contains(text(),'Accident Only Coverage')]/../../../..//div[contains(text(),'Deductible')]/..//mat-select");
    wellnessAccidentOnlySelect = new Select(this.page, "//span[contains(text(),'Accident Only Coverage')]/../../../..//div[contains(text(),'Wellness')]/..//mat-select");

    // complete coverage
    completeCoverageCheckBox = new Checkbox(this.page, "//span[contains(text(),'Complete Coverage')]/..");
    annualLimitCompleteCoverageSelect = new Select(this.page, "//span[contains(text(),'Complete Coverage')]/../../../..//div[contains(text(),'Annual Limit')]/..//mat-select");
    reimbursmentCompleteCoverageSelect = new Select(this.page, "//span[contains(text(),'Complete Coverage')]/../../../..//div[contains(text(),'Reimbursment')]/..//mat-select");
    deductibleCompleteCoverageSelect = new Select(this.page, "//span[contains(text(),'Complete Coverage')]/../../../..//div[contains(text(),'Deductible')]/..//mat-select");
    wellnessCompleteCoverageSelect = new Select(this.page, "//span[contains(text(),'Complete Coverage')]/../../../..//div[contains(text(),'Wellness')]/..//mat-select");

    // summary section
    logQuoteButton = new Button(this.page, "//button[contains(.,'Log Quote')]");


    async selectAccidentOnlyCoverageCheckBox(): Promise<void> {
        let inputHiddenCheckBox = new Checkbox(this.page, "//span[contains(text(),'Accident Only Coverage')]/..//input[@aria-checked='false']");
        if (await inputHiddenCheckBox.waitForExistInDom(timeouts.veryShort)) {
            await this.accidentOnlyCoverageCheckBox.click();
            inputHiddenCheckBox = new Checkbox(this.page, "//span[contains(text(),'Accident Only Coverage')]/..//input[@aria-checked='true']");
            await inputHiddenCheckBox.waitForExistInDom(timeouts.veryShort);
        }
    }

    async selectCompleteCoverageCheckBox(): Promise<void> {
        let inputHiddenCheckBox = new Checkbox(this.page, "//span[contains(text(),'Complete Coverage')]/..//input[@aria-checked='false']");
        if (await inputHiddenCheckBox.waitForExistInDom(timeouts.veryShort)) {
            await this.completeCoverageCheckBox.click();
            inputHiddenCheckBox = new Checkbox(this.page, "//span[contains(text(),'Complete Coverage')]/..//input[@aria-checked='true']");
            await inputHiddenCheckBox.waitForExistInDom(timeouts.veryShort);
        }
    }


    async selectPetNameCheckBox(petName: string): Promise<void> {
        let petNameCheckBox = new Button(this.page, `//strong[contains(text(),'${petName}')]/..//label`);
        await petNameCheckBox.check();
    }

    async selectPolicyAction(policyAction: string): Promise<void> {
        let policyActionRadioButton = new Button(this.page, `//div[text()='Policy Actions ']/..//input[@value="${policyAction}"]`);
        await policyActionRadioButton.clickAndWait();
    }

}
