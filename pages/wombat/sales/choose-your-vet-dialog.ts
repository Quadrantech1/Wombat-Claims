import { Button } from '@controls/button';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class ChooseYourVetDialog extends BasePage {
    cancelButton = new TextBox(this.page, '//div[@class="close"]');
    hasNoVetButton = new Button(this.page, "//button[contains(.,'Has No Vet')]");
}

