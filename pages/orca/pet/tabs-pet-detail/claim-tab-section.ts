import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class ClaimTabSection extends BasePage {
    claimsTable = new Table(this.page, "//div[@id='claims']/table");
}
