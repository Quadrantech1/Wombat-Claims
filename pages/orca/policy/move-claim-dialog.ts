import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class MoveClaimDialog extends BasePage {
    policyNoTextBox = new TextBox(this.page, "//input[@id=\"MoveToPolicyId\"]");
    claimsToMoveTable = new Table(this.page, "//table[@class=\"table table-bordered table-striped\"]");
    goButton = new Button(this.page, "//div[@class=\"modal-footer btn-block\"]/button[contains(text(),'Go')]");
    cancelButton = new Button(this.page, "//div[@class=\"modal-footer btn-block\"]/button[contains(text(),'Cancel')]");

    async moveClaim(policyNo: string, claimNumber: string): Promise<void> {
        logger.info(`[MoveClaimDialog.moveClaim] - Moving claim ${claimNumber} to policy ${policyNo}`);
        await this.policyNoTextBox.setText(policyNo);
        const checkBoxSelector = claimNumber !== 'any'
            ? `//table[@class="table table-bordered table-striped"]//td[contains(text(),'${claimNumber}')]/parent::*//input[@type="checkbox"]`
            : `//table[@class="table table-bordered table-striped"]//tr[1]//td[1]/parent::*//input[@type="checkbox"]`;
        await new Checkbox(this.page, checkBoxSelector).click();
        await this.goButton.click();
    }
}
