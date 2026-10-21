import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { AffiliateDetails, getDefaultAffiliateDetails } from '@data/orca/affiliate-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { AlertSection } from '../common-section/alert-section';

export class AddAffiliatePage extends BasePage {
    // Overview section
    affiliateNameTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Affiliate Name' }));
    affiliateIdLabel = new TextBox(this.page, "#AffiliateId");
    activeCheckBox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'Active' }));
    requiresValidationCheckBox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'Requires Validation' }));
    parentAffiliateTextBox = new TextBox(this.page, this.page.getByPlaceholder('Search for an Affiliate'));

    // Receivables section
    receivablesNameTextBox = new TextBox(this.page, this.page.getByLabel('Receivables Name'));
    address1TextBox = new TextBox(this.page, this.page.getByLabel('Address1'));
    address2TextBox = new TextBox(this.page, this.page.getByLabel('Address2'));
    cityTextBox = new TextBox(this.page, this.page.getByLabel('City'));
    stateDropdown = new Select(this.page, this.page.getByLabel('State'));
    postalCodeTextBox = new TextBox(this.page, this.page.getByLabel('Postal Code'));

    // Payout Details section
    leadFeeTierDropdown = new Select(this.page, this.page.getByLabel('Lead Fee Tier'));
    newBusinessCommissionTextBox = new TextBox(this.page, this.page.getByLabel('New Business Commission'));
    renewalCommissionTextBox = new TextBox(this.page, this.page.getByLabel('Renewal Commission'));
    qualifiedLeadFeeTextBox = new TextBox(this.page, this.page.getByLabel('Qualified Lead Fee'));
    referrerMarketingPaymentTextBox = new TextBox(this.page, this.page.getByLabel('Referrer Marketing Payment'));

    // License table
    licenseTable = new Table(this.page, "#license-table");

    // Tabs
    earningsReportsTab = new Link(this.page, this.page.getByRole('link', { name: 'Earnings Reports' }));
    paymentsTab = new Link(this.page, this.page.getByRole('link', { name: 'Payments' }));

    // Action buttons
    saveButton = new Button(this.page, this.page.getByRole('button', { name: 'Save' }));
    cancelButton = new Link(this.page, this.page.getByRole('link', { name: 'Cancel' }));
    dashboardLink = new Link(this.page, this.page.getByRole('link', { name: 'Dashboard' }));

    alertSection = new AlertSection(this.page);

    /**
     * Fills out affiliate details form
     * @param affiliateDetails - Partial affiliate details data
     */
    async fillAffiliateDetails(affiliateDetails?: Partial<AffiliateDetails>): Promise<void> {
        const data = { ...getDefaultAffiliateDetails(), ...affiliateDetails };
        logger.info(`[AddAffiliatePage.fillAffiliateDetails] - Filling affiliate details`);

        // Overview section
        await this.affiliateNameTextBox.setText(data.affiliateName);
        await this.activeCheckBox.check();
        await this.requiresValidationCheckBox.check();

        // Receivables section
        await this.receivablesNameTextBox.setText(data.receivablesName);
        await this.address1TextBox.setText(data.address1);
        await this.cityTextBox.setText(data.city);
        await this.stateDropdown.selectOption(data.state);
        await this.postalCodeTextBox.setText(data.postalCode);

        // Payout Details section
        await this.leadFeeTierDropdown.selectOption(data.leadFeeTier);
    }
}
