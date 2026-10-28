import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class ReimbursementTrackerHistoryTabPanel extends BasePage {
    reimbursementTrackerHistoryTable = new Table(
        this.page,
        "//div[@id='reimbursementTrackerHistory']/table[@class='table table-striped table-bordered']"
    );
}
