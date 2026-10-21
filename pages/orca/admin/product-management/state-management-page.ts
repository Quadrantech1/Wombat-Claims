import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class StateManagementPage extends BasePage {
    stateManagementTable = new Table(this.page, "//table[@class='table table-bordered']");
    fraudWarningLabel = new Label(this.page, "//label[contains(text(),'Fraud Warning')]");
    
    async clickOnStateLink(stateName: string): Promise<void> {
        const stateLink = new Link(this.page, this.page.getByRole('link', { name: stateName }));
        await stateLink.click();
    }

}
