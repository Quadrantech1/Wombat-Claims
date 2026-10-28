import { Button } from '@controls/button';
import { BasePage } from '@pages/base-page';

export class PetAttachmentsTabPanel extends BasePage {
    addNewButton = new Button(this.page, "//a[@title='Add Attachment']");
}
