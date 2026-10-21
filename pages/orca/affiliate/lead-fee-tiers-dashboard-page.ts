import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class LeadFeeTiersDashboardPage extends BasePage {
    // Search controls
    searchLeadFeeTierTextBox = new TextBox(this.page, this.page.getByLabel('Search Lead Fee Tier'));
    runSearchButton = new Button(this.page, this.page.getByRole('button', { name: 'Run Search' }));
    clearButton = new Link(this.page, this.page.getByRole('link', { name: 'Clear' }));
    addLeadFeeTierLink = new Link(this.page, this.page.getByRole('link', { name: 'Add Lead Fee Tier' }));

    // Results table
    leadFeeTiersTable = new Table(this.page, "#groups-table");

    /**
     * Search for a lead fee tier
     * @param searchTerm - The search term to use
     */
    async searchLeadFeeTier(searchTerm: string): Promise<void> {
        await this.searchLeadFeeTierTextBox.setText(searchTerm);
        await this.runSearchButton.click();
    }

    /**
     * Click on a lead fee tier link by tier ID
     * @param leadFeeTierId - The lead fee tier ID to click
     */
    async clickLeadFeeTierLink(leadFeeTierId: number): Promise<void> {
        const link = new Link(this.page, `//a[@href='/Affiliate/LeadFeeTierDetails?leadFeeTierId=${leadFeeTierId}']`);
        await link.click();
    }
}
