import { Button } from '@controls/button';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class ClaimViewSection extends BasePage {
    // pet info
    claimInfoTable = new Table(this.page, "//div[@class='claimInfo']//table");
    lineItemsButton = new Button(this.page, "//div[text()='Line Items']");
    timeLineButton = new Button(this.page, "//div[text()='Timeline']");
    reimbursementButton = new Button(this.page, "//div[text()='Reimbursements']");
    documentsButton = new Button(this.page, "//div[text()='Documents']");
    incidentsButton = new Button(this.page, "//div[text()='Incidents']");
    recordsRequestButton = new Button(this.page, "//div[text()='Records Request']");
    claimActionsButton = new Button(this.page, "//div[text()='Claim Actions']");



}


