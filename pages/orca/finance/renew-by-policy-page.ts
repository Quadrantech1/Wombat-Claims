import { TextBox } from '@controls/textbox';
import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { BasePage } from '@pages/base-page';
import { AlertSection } from '../common-section/alert-section';

export class RenewByPolicyPage extends BasePage {
    policyNumberTextbox = new TextBox(this.page, "#PolicyNumber");
    searchButton = new Button(this.page, "//fieldset//button[contains(text(),'Search')]");
    policyResultCheckbox = new Checkbox(this.page, "#chkCommit");
    submitButton = new Button(this.page, "//fieldset//button[contains(text(),'Submit')]");

    alertSection = new AlertSection(this.page);
}
