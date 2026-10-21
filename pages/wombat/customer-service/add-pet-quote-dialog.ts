import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class AddPetDialog extends BasePage {
    startNewQuoteButton = new Button(this.page, "#start-new-quote");
    cancelButton = new Button(this.page, "//div[@class='close']");

}
