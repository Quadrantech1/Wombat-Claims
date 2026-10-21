import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class PolicyStatusHistoryTabSection extends BasePage {
    petStatus = new Link(this.page, "//a[contains(@href,'coverages')]");

    policyStatusHistoryTable = new Table(
        this.page,
        "//div[@id='policy-status-history']//table"
    );
}
