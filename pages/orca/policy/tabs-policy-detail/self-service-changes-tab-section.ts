import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class SelfServiceChangesTabSection extends BasePage {

    selfServiceChangesTable = new Table(this.page, '//div[@id="selfServiceChanges"]//table');

}