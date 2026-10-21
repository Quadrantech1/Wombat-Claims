import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class BillingInformationSection extends BasePage {
    // billing information
    billingFrequencySelect = new TextBox(this.page, "#billingFrequency");
    billingTypeSelect = new TextBox(this.page, "#billingType");
    nameOrAccountTextBox = new TextBox(this.page, "//div[text()='Name On Account']/../input");
    RoutingNumberTextBox = new TextBox(this.page, "#txtRoutingNumber");
    accountNumberTextBox = new TextBox(this.page, "#txtAccountNumber");
    achddButton = new TextBox(this.page, "#btnClaimReimbursement");
    sendNoCheckLetterButton = new TextBox(this.page, "#btnTriggerNoCheckLetter");
    saveButton = new TextBox(this.page, "#btnSave");
    updateSecureInformationLink = new TextBox(this.page, "#btnUpdate");
    useSameAccountForClaimsReimbursementsCheckBox = new TextBox(this.page, "#selectclaimRembusement");
    cancelButton = new TextBox(this.page, "#btnClose");

}


