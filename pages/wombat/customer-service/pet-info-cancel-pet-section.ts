import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class PetInfoCancelPetSection extends BasePage {

    cancellationReasonComboBox = new Select(this.page, "#selectCancellationReasonId");
    callCancelRadioOrigenRadioButton = new RadioButton(this.page, "//span[contains(text(),'Call')]/..//parent::label");
    writtenCancelationOrigenRadioButton = new RadioButton(this.page, "//span[contains(text(),'Written')]/..//input");
    cancelDateTextBox = new TextBox(this.page, "#cancelDate");
    addToSummaryButton = new Button(this.page, "//span[contains(text(),'Add to Summary')]");


    // Cancel Account: Pet Name
    takeMBGCancelDialogButton = new Button(this.page, "//button[contains(.,'Take MBG')]");
    userDateCancelDialogButton = new Button(this.page, "//button[contains(.,'Use')]")

    // Summary Section
    logQuoteButton = new Button(this.page, "//button[contains(.,'Log Quote')]");
    confirmCancelAccountsButton = new Button(this.page, "//button[contains(.,'Confirm Cancel Account(s)')]");
    namePetLabelInSummarySection = new TextBox(this.page, "//div[@class='pet-name']//strong");

    async selectPetCancelCheckBox(namePet: string): Promise<void> {
        const petCancelCheckBox = new Checkbox(this.page, `//div[contains(.,'${namePet}')]/..//mat-checkbox/label`);
        await petCancelCheckBox.check();
    }
}
