import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { getDefaultGroupBillingDetails, GroupBillingDetails } from '@data/orca/group-billing-details-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class GroupBillingDetailPage extends BasePage {
    // Overview
    groupNameTextBox = new TextBox(this.page, "#GroupBilling_GroupName");
    groupActiveCheckbox = new Checkbox(this.page, "#GroupBilling_Active");

    // Contact Details
    contactNameTextBox = new TextBox(this.page, "#GroupBilling_ContactName");
    contactEmailTextBox = new TextBox(this.page, "#GroupBilling_ContactEmail");
    contactPhoneTextBox = new TextBox(this.page, "#GroupBilling_ContactPhone");
    contactAddress1TextBox = new TextBox(this.page, "#GroupBilling_Address1");
    contactAddress2TextBox = new TextBox(this.page, "#GroupBilling_Address2");
    cityTextBox = new TextBox(this.page, "#GroupBilling_City");
    stateSelect = new Select(this.page, "#GroupBilling_StateCode");
    postalCodeTextBox = new TextBox(this.page, "#GroupBilling_PostalCode");

    // Invoice Details
    careOfTextBox = new TextBox(this.page, "#GroupBilling_CareOf");
    invoiceEmailTextBox = new TextBox(this.page, "#GroupBilling_InvoiceEmail");
    deliveryTypeSelect = new Select(this.page, "#GroupBilling_DeliveryTypeId");

    saveButton = new Button(this.page, "//button[contains(text(),'Save')]");

    /**
     * Fills group billing detail section
     * @param groupBillingDetails - Partial group billing details data
     */
    async fillGroupBillingDetailSection(groupBillingDetails?: Partial<GroupBillingDetails>): Promise<void> {
        const data = { ...getDefaultGroupBillingDetails(), ...groupBillingDetails };
        logger.info(`[GroupBillingDetailPage.fillGroupBillingDetailSection] - Filling group billing details`);
        await this.groupNameTextBox.setText(data.groupName);
        await this.contactNameTextBox.setText(data.contactName);
        await this.contactEmailTextBox.setText(data.contactEmail);
        await this.contactPhoneTextBox.setText(data.contactPhone);
        await this.contactAddress1TextBox.setText(data.contactAddress1);
        await this.contactAddress2TextBox.setText(data.contactAddress2);
        await this.cityTextBox.setText(data.city);
        await this.stateSelect.selectOption(data.state);
        await this.postalCodeTextBox.setText(data.postalCode);
    }
}
