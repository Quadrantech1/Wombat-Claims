import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { getDefaultPolicySearchData, PolicySearchData } from '../../../data/orca/policy/policy-search-data';


export class PolicyDashboardPage extends BasePage {


    policyNumberTextBox = new TextBox(this.page, "#SearchCriteria_PolicyNo");
    marketchannelSelect = new Select(this.page, "#selected-market-channel");
    runSearchButton = new Button(this.page, "//button[contains(.,'Run Search')]");
    searchResultTable = new Table(this.page, "//table[@id='search-results']");
    postalCodeTextBox = new TextBox(this.page, "#SearchCriteria_PostalCode");
    clearButton = new Button(this.page, "//a[@class='clear-form pull-left btn btn-default']");
    lastNameTextBox = new TextBox(this.page, "#SearchCriteria_CustomerName");
    emailAddressTextBox = new TextBox(this.page, "#SearchCriteria_EmailAddress");
    phoneNumberTextBox = new TextBox(this.page, "#SearchCriteria_PhoneNo");
    billingIdTextBox = new TextBox(this.page, "#SearchCriteria_BillingId");
    registrationNumberTextBox = new TextBox(this.page, "#SearchCriteria_RegNo");
    linkedPolicyTextBox = new TextBox(this.page, "#SearchCriteria_LinkedPolicy");
    setLinkedPolicyTextbox = new TextBox(this.page, "#PolicyDetails_Policy_LinkedPolicy");
    petNameTextBox = new TextBox(this.page, "#SearchCriteria_PetName");
    showPetsResultButton = new Button(this.page, "//*[contains(text(),'Show Pet(s)')]");
    petsResult = new Table(this.page, "//div[contains(@class,'accordion-body')]");

    /**
     * Returns a label for pet name search results
     * @param name - The pet name to search for
     * @returns Label element for the specified pet name
     */
    setPetNameResultLabel(name: string): Label {
        return new Label(this.page, `//*[contains(@id,'pet-search-accordion')]//strong[contains(text(),"${name}")]`);
    }

    /**
     * Performs policy search using the provided search criteria
     * @param policySearchData - Optional search criteria to override defaults
     * @returns Promise that resolves when search is completed
     */
    async searchPolicyAction(policySearchData?: Partial<PolicySearchData>): Promise<void> {
        logger.info(`[PolicyDashboardPage.searchPolicySection] - Performing policy search with criteria`);
        const searchData = { ...getDefaultPolicySearchData(), ...policySearchData };

        await this.page.waitForLoadState('networkidle');
        await this.clearButton.waitForVisible();
        await this.clearButton.clickAndWait('load');

        await this.marketchannelSelect.isDisplayed(timeouts.short);
        if (searchData.marketChannel && searchData.marketChannel.trim()) {
            await this.marketchannelSelect.selectOption(searchData.marketChannel);
        }

        if (searchData.policyNumber) await this.policyNumberTextBox.setText(searchData.policyNumber);
        if (searchData.postalCode) await this.postalCodeTextBox.setText(searchData.postalCode);
        if (searchData.lastName) await this.lastNameTextBox.setText(searchData.lastName);
        if (searchData.emailAddress) await this.emailAddressTextBox.setText(searchData.emailAddress);
        if (searchData.phoneNumber) await this.phoneNumberTextBox.setText(searchData.phoneNumber);
        if (searchData.billingId) await this.billingIdTextBox.setText(searchData.billingId);
        if (searchData.registrationNumber) await this.registrationNumberTextBox.setText(searchData.registrationNumber);
        if (searchData.linkedPolicy) await this.linkedPolicyTextBox.setText(searchData.linkedPolicy);
        if (searchData.petName) await this.petNameTextBox.setText(searchData.petName);

        await this.runSearchButton.isDisplayed(timeouts.default);
        await this.runSearchButton.clickAndWait('load');
    }
}