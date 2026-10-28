import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class RenewPoliciesScreen extends BasePage {
    renewalsToProcessTable = new Table(this.page, "//table[@id='cp-to-invoice']");
}
