import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class SelfServiceChangesTabPanel extends BasePage {

    selfServiceChangesTable = new Table(this.page, '//div[@id="selfServiceChanges"]//table');

}