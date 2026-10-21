import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { logger } from '@utils/logger-util';
import { ChooseYourVetDialog } from './choose-your-vet-dialog';
import { SalesOwnerTabSection } from './sales-owner-tab-section';

export class SalesEnrollmentTabSection extends SalesOwnerTabSection {

    // Payment Information
    creditCardRadioButton = new RadioButton(this.page, '//label[contains(.,"Credit Card")]');
    achRadioButton = new RadioButton(this.page, '//label[contains(.,"ACH")]');
    enrollForClaimACHCheckBox = new Checkbox(this.page, '//div[contains(.,"Enroll for claim ACH")]/mat-checkbox/label');

    // creditCard
    beginSecurePaymentButton = new Button(this.page, '#');
    creditCardTypeSelect = new Select(this.page, '#creditype');
    cardNumberTextBox = new TextBox(this.page, '//div[contains(.,\'Card Number is required\')]/input');
    nameOrCardTextBox = new TextBox(this.page, '#txtnameOnAccount');
    expirationDateTextBox = new TextBox(this.page, '#txtexpirationDate')

    chooseVetButton = new Button(this.page, '//button[contains(.,\'Choose Vet\')]');
    chooseYourVetDialog = new ChooseYourVetDialog(this.page);

    //ACH
    nameOnAccountTextBox = new TextBox(this.page, '#txtNameOnAccount');
    routingNumberTextBox = new TextBox(this.page, '#txtRoutingNumber');
    accountNumberTextBox = new TextBox(this.page, '#txtAccountNumber')

    quoteSummaryButton = new Button(this.page, '#save-customer');


    // add method to fill the form with data


    async fillPaymentInformationForACH(data: { nameOnAccount?: string; routingNumber?: string; accountNumber?: string }) {
        logger.info("Filling payment information for ACH, account number: " + data.accountNumber + ", routing number: " + data.routingNumber + ", name on account: " + data.nameOnAccount);
        await this.achRadioButton.clickAndWait();

        if (data.nameOnAccount) {
            await this.nameOnAccountTextBox.setText(data.nameOnAccount);
        }
        if (data.routingNumber) {
            await this.routingNumberTextBox.setText(data.routingNumber);
        }
        if (data.accountNumber) {
            await this.accountNumberTextBox.setText(data.accountNumber);
        }
    }

}

