import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { BasePage } from '@pages/base-page';

export class FinanceTabSection extends BasePage {
    // Finance sub-tab controls
    voidCheckButton = new Button(this.page, '//a[@title="Void Check"]');
    voidCheckLabel = new Label(this.page, '//h3[text()="Void Check"]');
    reissueCheckCheckbox = new Checkbox(this.page, '//input[@id="IsReissuing"]');
    voidCheckPopUpSaveButton = new Button(this.page, '//div[@class="modal-footer btn-block"]/button[@type="submit"]');
    checkReissuedMessageLabel = new Label(this.page, '//div[contains(text(),"has been reissued on")]');
    checkNumberOnPopupLabel = new Label(this.page, '//input[@id="ClaimCheck_CheckNo"]/parent::div');
    policyNumberLink = new Link(this.page, '//input[@id="ClaimDto_PolicyId"]/parent::div/a');
}
