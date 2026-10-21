import { Button } from '@controls/button';
import { BasePage } from '@pages/base-page';


export class EditVetModal extends BasePage {
    editButton = new Button(this.page, "//tr[1]//a[text()=' Edit']");
}