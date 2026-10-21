import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

/**
 * Lead Fee Tier Details Page in ORCA Affiliate section
 */
export class LeadFeeTierDetailPage extends BasePage {
    leadFeeTierDetailsTable = new Table(this.page, this.page.locator('table.table'));
    addNewLeadFeeCompensation = new Button(this.page, this.page.getByRole('link', { name: 'Add New Lead Fee Compensation' }));
    leadFeeTiersLink = new Link(this.page, this.page.getByRole('link', { name: 'Lead Fee Tiers' }));

    /**
     * Click on a lead fee tier link by tier name/ID
     * @param tierName - The tier name or ID to click (e.g., '1', '18')
     */
    async selectLeadFeeTierByLink(tierName: string): Promise<void> {
        const link = new Link(this.page, this.page.getByRole('link', { name: tierName, exact: true }));
        await link.click();
    }
}
