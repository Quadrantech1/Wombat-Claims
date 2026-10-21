import { Button } from '@controls/button';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class VetSearchDialog extends BasePage {
    searchTextBox = new TextBox(this.page, '#search_text');
    searchButton = new Button(this.page, "//button[contains(.,'Search')]");
    hasNoVetButton = new Button(this.page, "//span[contains(text(),'Has No Vet')]/..");
    saveButton = new Button(this.page, "#save-pet-vet");
    searchVetResultTable = new Table(this.page, "#vetSearchTable");

}
