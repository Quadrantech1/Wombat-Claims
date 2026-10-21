import { BasePage } from '@pages/base-page';
import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';

export class ProcedureCodePage extends BasePage {
  createNewProcedureCodeButton = new Button(this.page, "//button[contains(text(),'Create New Procedure Code')]");
  procedureCodeTable = new Table(this.page, "//table[@class='table table-bordered']");
  statusHistoryLink = new Link(this.page, "//a[contains(text(),'Version History')]");
  denialCodeCreationButton = new Button(this.page, "//button[contains(text(),'Denial Code Creation')]");
  searchBarTextBox = new TextBox(this.page, "//input[@id='search-term']");
  denialCodeTable = new Table(this.page, "//table[@class='table table-bordered']");
}
