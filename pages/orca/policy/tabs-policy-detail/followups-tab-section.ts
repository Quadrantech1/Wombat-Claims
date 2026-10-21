import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class FollowsUpTabSection extends BasePage {
    addNewFollowUpsButton = new Button(this.page, '//div[@id="followups"]//a[@title="Create Followup"]');
    followUpsTable = new Table(this.page, '//table[@id="followups-table"]');
    takeOwnershipLink = new Link(this.page, this.page.getByRole('link', { name: 'Take Ownership' }));
    viewDetailsLink = new Link(this.page, this.page.getByRole('link', { name: 'View Details' }));
}