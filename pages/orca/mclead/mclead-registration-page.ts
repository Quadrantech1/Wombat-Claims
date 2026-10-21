import { BasePage } from '@pages/base-page';
import { 
    McLeadPetData, 
    McLeadCustomerData, 
    McLeadRegistrationData,
    getDefaultMcLeadPetData,
    getDefaultMcLeadCustomerData
} from '@data/orca/mclead-registration-data';
import { Button } from '@controls/button';
import { TextBox } from '@controls/textbox';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { Label } from '@controls/label';
import { logger } from '@utils/logger-util';

export class McLeadRegistrationPage extends BasePage {
    // Pet Details Controls
    registrationNoTextBox = new TextBox(this.page, "//input[@id=\"Pet_reg_no\"]");
    registrationDateTextBox = new TextBox(this.page, "//input[@id=\"Pet_registration_date\"]");
    dateOfBirthTextBox = new TextBox(this.page, "//input[@id=\"Pet_dob\"]");
    colorTextBox = new TextBox(this.page, "//input[@id=\"Pet_pet_color\"]");
    marketChannelSelect = new Select(this.page, "#market-channel");
    partnerSelect = new Select(this.page, "#Pet_partner_id");
    petNameTextBox = new TextBox(this.page, "#Pet_pet_name");
    speciesSelect = new Select(this.page, "#species-select");
    breedSelect = new Select(this.page, "#breed-select");
    genderSelect = new Select(this.page, "#Pet_gender_id");
    soldDateTextBox = new TextBox(this.page, "//input[@id='Pet_sold_date']");
    storeDisplayNameLabel = new Label(this.page, "//div[text()='Store Display Name']");
    storeDisplayName = new Label(this.page, "xpath=//div[@class='control-group'][.//div[text()='Store Display Name']]//div[@class='controls']"
    );

    // Customer Details Controls
    firstNameTextBox = new TextBox(this.page, "//input[@id='Customer_Customer_FirstName']");
    middleNameTextBox = new TextBox(this.page, "//input[@id='Customer_Customer_MiddleName']");
    lastNameTextBox = new TextBox(this.page, "//input[@id='Customer_Customer_LastName']");
    address1TextBox = new TextBox(this.page, "//input[@id='Customer_Customer_Address1']");
    address2TextBox = new TextBox(this.page, "//input[@id='Customer_Customer_Address2']");
    cityTextBox = new TextBox(this.page, "//input[@id='Customer_Customer_City']");
    stateProvinceSelect = new Select(this.page, "//select[@id='state-prov']");
    postalCodeTextBox = new TextBox(this.page, "//input[@id='Customer_Customer_PostalCode']");
    emailTextBox = new TextBox(this.page, "//input[@id='Customer_Customer_Email']");
    phoneTextBox = new TextBox(this.page, "//input[@id='Customer_Customer_PhoneDay']");
    sendEmailSelect = new Select(this.page, '//select[@id="Customer_Customer_SendEmail"]');

    // Action Controls
    addRegistrationButton = new Button(this.page, '//button[text()="Add Registration"]');
    getQuoteMcLeadDetailsButton = new Button(this.page, '//a[text()=" Get Quote"]');

    // Tables
    customerDetailsTable = new Table(this.page, '//table[@id="customers-table"]');

    /**
     * Fills the pet details section with provided data
     * @param petData - Optional partial pet data. Merges with defaults if not provided.
     * @returns Promise that resolves when pet details are successfully filled
     */
    async fillPetDetails(petData?: Partial<McLeadPetData>): Promise<void> {
        const formData = { ...getDefaultMcLeadPetData(), ...petData };
        logger.info(`[McLeadRegistrationPage.fillPetDetails] Filling McLead pet details, data: ${JSON.stringify(formData)}`);
        await this.registrationNoTextBox.setText(formData.registrationNo);
        
        await this.registrationDateTextBox.click();
        await this.registrationDateTextBox.setText(formData.registrationDate);
        await this.page.keyboard.press('Tab');
        
        await this.dateOfBirthTextBox.setText(formData.dateOfBirth);
        await this.page.keyboard.press('Tab');
        
        await this.colorTextBox.setText(formData.color);       
        await this.marketChannelSelect.selectValue(formData.marketChannel);

        if (formData.partner) {
            await this.partnerSelect.selectValue(formData.partner);
        }

        await this.petNameTextBox.setText(formData.petName);
        await this.speciesSelect.selectValue(formData.species);
        await this.breedSelect.selectValue(formData.breed);
        await this.genderSelect.selectValue(formData.gender);
        
        if (formData.soldDate) {
            await this.soldDateTextBox.setText(formData.soldDate);
        }
        logger.info('[McLeadRegistrationPage.fillPetDetails] McLead pet details filled successfully');
    }

    /**
     * Fills the customer details section with provided data
     * @param customerData - Optional partial customer data. Merges with defaults if not provided.
     * @returns Promise that resolves when customer details are successfully filled
     */
    async fillCustomerDetails(customerData?: Partial<McLeadCustomerData>): Promise<void> {
        
        const formData = { ...getDefaultMcLeadCustomerData(), ...customerData };
        logger.info('[McLeadRegistrationPage.fillCustomerDetails] Filling customer details');
        await this.firstNameTextBox.setText(formData.firstName);
        await this.middleNameTextBox.setText(formData.middleName);
        await this.lastNameTextBox.setText(formData.lastName);
        await this.address1TextBox.setText(formData.address1);
        await this.address2TextBox.setText(formData.address2);
        await this.cityTextBox.setText(formData.city);
        await this.stateProvinceSelect.selectValue(formData.stateProvince);
        await this.postalCodeTextBox.setText(formData.postalCode);
        await this.emailTextBox.setText(formData.email);
        await this.phoneTextBox.setText(formData.phone);
        
        await this.sendEmailSelect.selectValue(formData.sendEmail);
        logger.info('[McLeadRegistrationPage.fillCustomerDetails] McLead customer details filled successfully');
    }    
    
    /**
     * Fills the complete registration form with both pet and customer details
     * @param registrationData - Optional partial registration data. Merges with defaults if not provided.
     * @returns Promise that resolves when the complete form is successfully filled
     */
    async fillRegistration(registrationData?: McLeadRegistrationData): Promise<void> {
        logger.info('[McLeadRegistrationPage.fillRegistration] Filling registration');
        // Pass the partial data directly to individual methods - they handle the merging with defaults
        await this.fillPetDetails(registrationData?.petDetails);
        await this.fillCustomerDetails(registrationData?.customerDetails);
        logger.info('[McLeadRegistrationPage.fillRegistration] McLead registration form filled successfully');
    }
}