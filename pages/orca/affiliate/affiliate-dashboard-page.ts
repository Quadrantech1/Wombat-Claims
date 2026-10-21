import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class AffiliateDashboardPage extends BasePage {
    // Search controls
    affiliateNameSearchTextBox = new TextBox(this.page, this.page.locator('#affiliate-search-name'));
    runSearchButton = new Button(this.page, "#affiliate-search-submit");
    clearButton = new Link(this.page, this.page.getByRole('link', { name: 'Clear' }));

    // Navigation links
    dashboardLink = new Link(this.page, this.page.getByRole('link', { name: 'Dashboard' }));
    addAffiliateLink = new Link(this.page, this.page.getByRole('link', { name: 'Add Affiliate' , exact: false }));
    leadFeeTiersLink = new Link(this.page, this.page.getByRole('link', { name: 'Lead Fee Tiers' }));
    leadFeeStateManagementLink = new Link(this.page, this.page.getByRole('link', { name: 'Lead Fee State Management' }));

    // Results table
    affiliateResultsTable = new Table(this.page, "#affiliate-results-table");
}
