import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class AllowanceTabSection extends BasePage {
    allowanceTable = new Table(this.page, "//table[@class='table table-striped table-bordered tablesorter']",
        ['Allowance', 'Eligibility', 'Annual Term']);
}
