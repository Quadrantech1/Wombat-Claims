import { BasePage } from '@pages/base-page';
import { Label } from '@controls/label';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';

export class ViewClaimRulesPage extends BasePage {
  noDataAvailableLabel = new Label(this.page, "//label[contains(text(),'No data available')]");
  searchBarTextBox = new TextBox(this.page, "//input[@id='search-term']");
  denialCodeTable = new Table(this.page, "//table[@class='table table-bordered']");
  claimRuleTable = new Table(this.page, "//table[@class='table table-bordered']");
}
