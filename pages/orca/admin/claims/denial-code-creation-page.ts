import { Label } from "@controls/label";
import { Table } from "@controls/table";
import { TextBox } from "@controls/textbox";
import { BasePage } from "@pages/base-page";


export class DenialCodeCreationPage extends BasePage {
    // Labels
    noDataAvailableLabel = new Label(this.page, "//label[contains(text(),'No data available')]");
    // TextBoxes
    searchBarTextBox = new TextBox(this.page, '#search-term');
    // Tables
    denialCodeTable = new Table(this.page, "//table[@class='table table-bordered table-sm']");
}