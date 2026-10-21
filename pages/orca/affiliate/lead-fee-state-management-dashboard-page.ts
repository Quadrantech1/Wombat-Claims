import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class LeadFeeStateManagementDashboardPage extends BasePage {
    // Search controls
    searchLeadFeeTierTextBox = new TextBox(this.page, this.page.getByLabel('Search Lead Fee Tier'));
    runSearchButton = new Button(this.page, this.page.getByRole('button', { name: 'Run Search' }));
    clearButton = new Link(this.page, this.page.getByRole('link', { name: 'Clear' }));

    // Results table
    leadFeeStateRulesTable = new Table(this.page, "#groups-table");
}
