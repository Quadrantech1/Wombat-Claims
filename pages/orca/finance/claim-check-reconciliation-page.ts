import { Button } from '@controls/button';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class ClaimCheckReconciliationPage extends BasePage {
    bankAccountDropdown = new Select(this.page, "//select[@formcontrolname='bankAccount']");
    checkTypeDropdown = new Select(this.page, "//select[@formcontrolname='checkType']");
    checkStatusDropdown = new Select(this.page, "//label[contains(.,'Check Status')]/..//select");
    startReconciliationButton = new Button(this.page, "//button[text()='Start Reconciliation']");
    outstandingChecksTable = new Table(this.page, "//table[@class='table table-bordered']");
    clearedChecksTable = new Table(this.page, "//table[@class='table table-bordered']");
    submitClearedChecksButton = new Button(this.page, "//button[text()=' Submit Cleared Checks']");
    yesConfirmActionButton = new Button(this.page, "//button[text()='Yes']");
    cancelConfirmActionButton = new Button(this.page, "//button[text()='Cancel']");
}
