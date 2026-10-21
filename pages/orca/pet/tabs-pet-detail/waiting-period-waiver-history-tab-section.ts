import { Label } from '@controls/label';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class WaitingPeriodWaiverHistoryTabSection extends BasePage {
    waitingPeriodWaiverHistoryTable = new Table(
        this.page,
        "//div[@id='waitingperiodwaiverhistory']/table[@class='table table-striped table-bordered tablesorter']"
    );

    noResultsLabel = new Label(
        this.page,
        "//div[@id='waitingperiodwaiverhistory']/div[contains(text(),'No Results(s)')]"
    );
}
