import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { getDefaultBillingInfo, getDefaultCustomerInfo, QuoteApiBillingInfo, QuoteApiCustomerInfo } from '@data/orca/quote-api-billing-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class QuoteApiBillingPage extends BasePage {
    firstNameTextBox = new TextBox(this.page, "//input[@formcontrolname='firstName']");
    lastNameTextBox = new TextBox(this.page, "//input[@formcontrolname='lastName']");
    addressTextBox = new TextBox(this.page, "//input[@formcontrolname='address']");
    cityTextBox = new TextBox(this.page, "//input[@formcontrolname='city']");
    phoneNumberTextBox = new TextBox(this.page, "//input[@formcontrolname='phone']");
    emailTextBox = new TextBox(this.page, "//input[@formcontrolname='email']");
    zipCodeTextBox = new TextBox(this.page, "//input[@formcontrolname='zipCode']");
    stateDropDown = new Select(this.page, "//select[@formcontrolname='state']");
    cardFirstNameTextBox = new TextBox(this.page, "//input[@formcontrolname='firstNameOnCard']");
    cardLastNameTextBox = new TextBox(this.page, "//input[@formcontrolname='lastNameOnCard']");
    cardNumberTextBox = new TextBox(this.page, "//input[@formcontrolname='cardNumber']");
    expiryMonthTextBox = new TextBox(this.page, "//input[@formcontrolname='expMonth']");
    expiryYearTextBox = new TextBox(this.page, "//input[@formcontrolname='expYear']");
    cvcTextBox = new TextBox(this.page, "//input[@formcontrolname='oc']");
    useCustInfoCheckBox = new Checkbox(this.page, "//input[@formcontrolname='useCustomerInfo']");
    billingAddressTextBox = new TextBox(this.page, "//input[@formcontrolname='billingAddress1']");
    billingCityTextBox = new TextBox(this.page, "//input[@formcontrolname='billingCity']");
    billingPostalCodeTextBox = new TextBox(this.page, "//input[@formcontrolname='billingPostalCode']");
    nextButton = new Button(this.page, "//button[text()='Next']");
    populateFieldsButton = new Button(this.page, "//a[@class='btn-secondary']");

    /**
     * Fills out customer information on billing page
     */
    async fillOutCustomerInformationOnBillingPage(customerInfo?: Partial<QuoteApiCustomerInfo>): Promise<void> {
        const defaultData = getDefaultCustomerInfo();
        const data = { ...defaultData, ...customerInfo };
        logger.info(`[QuoteApiBillingPage.fillOutCustomerInformationOnBillingPage] - Filling customer info`);
        await this.firstNameTextBox.setText(data.firstName);
        await this.lastNameTextBox.setText(data.lastName);
        await this.phoneNumberTextBox.setText(data.phoneNumber);
        await this.addressTextBox.setText(data.address);
        await this.cityTextBox.setText(data.city);
        await this.stateDropDown.selectOption(data.state);
    }

    /**
     * Fills out billing information on billing page
     */
    async fillOutBillingInformationOnBillingPage(billingInfo?: Partial<QuoteApiBillingInfo>): Promise<void> {
        const defaultData = getDefaultBillingInfo();
        const data = { ...defaultData, ...billingInfo };
        logger.info(`[QuoteApiBillingPage.fillOutBillingInformationOnBillingPage] - Filling billing info`);
        await this.cardFirstNameTextBox.setText(data.nameOnCard);
        await this.cardLastNameTextBox.setText(data.nameOnCard);
        await this.useCustInfoCheckBox.click();
        await this.cardNumberTextBox.setText(data.cardNumber);
        await this.expiryMonthTextBox.setText(data.expiryMM);
        await this.expiryYearTextBox.setText(data.expiryYY);
        await this.cvcTextBox.setText(data.expiryCVC);
    }
}
