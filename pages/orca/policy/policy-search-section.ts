import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class PolicySearchSection extends BasePage {
    policyNumberTextBox = new TextBox(this.page, '#SearchCriteria_PolicyNo');
    marketchannelSelect = new Select(this.page, '#selected-market-channel');
    runSearchButton = new Button(this.page, "//button[contains(.,'Run Search')]");
    searchResultTable = new Table(this.page, "//table[@id='search-results']",
        ["Policy Details", "Customer Details", "Location"]);
    postalCodeTextBox = new TextBox(this.page, '#SearchCriteria_PostalCode');
    clearButton = new Button(this.page, "//a[@class='clear-form pull-left btn btn-default']");
    lastNameTextBox = new TextBox(this.page, '#SearchCriteria_CustomerName');
    emailAddressTextBox = new TextBox(this.page, '#SearchCriteria_EmailAddress');
    phoneNumberTextBox = new TextBox(this.page, '#SearchCriteria_PhoneNo');
    billingIdTextBox = new TextBox(this.page, '#SearchCriteria_BillingId');
    registrationNumberTextBox = new TextBox(this.page, '#SearchCriteria_RegNo');
    linkedPolicyTextBox = new TextBox(this.page, '#SearchCriteria_LinkedPolicy');
    setLinkedPolicyTextbox = new TextBox(this.page, '#PolicyDetails_Policy_LinkedPolicy');
    petNameTextBox = new TextBox(this.page, '#SearchCriteria_PetName');
    showPetsResultButton = new Button(this.page, "//*[contains(text(),'Show Pet(s)')]");
    petsResult = new Table(this.page, "//div[contains(@class,'accordion-body')]");
    cancelButton = new Button(this.page, this.page.locator('#coverage-detail-form').getByText('Cancel'));

    getPetNameResultLabel(name: string): Label {
        return new Label(this.page, `//*[contains(@id,'pet-search-accordion')]//strong[contains(text(),"${name}")]`);
    }
    // Get pet's count from search results table
    async getPetsCount(): Promise<number> {
        logger.info('[PolicySearchSection.getPetsCount] - Getting pets count from search results');
        await this.petsResult.waitForVisible();
        const childCount = await this.petsResult.getLocator().evaluate(el => el.childElementCount);
        logger.info(`[PolicySearchSection.getPetsCount] - Pets count: ${childCount}`);
        return childCount;
    }

    async searchPolicySection(data: {
        marketChannel?: string;
        policyNumber?: string;
        postalCode?: string;
        lastName?: string;
        emailAddress?: string;
        phoneNumber?: string;
        billingId?: string;
        registrationNumber?: string;
        linkedPolicy?: string;
        petName?: string;
    }): Promise<void> {
        logger.info('[PolicySearchSection.searchPolicySection] - Searching policies with: ' + JSON.stringify(data));
        await this.marketchannelSelect.waitForVisible();
        // Assuming marketChannel corresponds to option 'value'; adjust if partial text match needed later
        if (data.marketChannel) await this.marketchannelSelect.selectOption(data.marketChannel);
        if (data.policyNumber) await this.policyNumberTextBox.setText(data.policyNumber);
        if (data.postalCode) await this.postalCodeTextBox.setText(data.postalCode);
        if (data.lastName) await this.lastNameTextBox.setText(data.lastName);
        if (data.emailAddress) await this.emailAddressTextBox.setText(data.emailAddress);
        if (data.phoneNumber) await this.phoneNumberTextBox.setText(data.phoneNumber);
        if (data.billingId) await this.billingIdTextBox.setText(data.billingId);
        if (data.registrationNumber) await this.registrationNumberTextBox.setText(data.registrationNumber);
        if (data.linkedPolicy) await this.linkedPolicyTextBox.setText(data.linkedPolicy);
        if (data.petName) await this.petNameTextBox.setText(data.petName);
        await this.runSearchButton.waitForVisible();
        await this.runSearchButton.clickAndWait();
    }

    /**
     * Clicks on the policy link in search results that matches the provided policy number.
     * Example link text: "Policy No: 7164999"
     * @param policyNumber - Policy number to click
     */
    async clickPolicyLink(policyNumber: string): Promise<void> {
        logger.info('[PolicySearchSection.clickPolicyLink] - Clicking policy link for: ' + policyNumber);
        const link = new Link(this.page, `//a[contains(normalize-space(.),'Policy No: ${policyNumber}')]`);
        await link.waitForVisible();
        await link.clickAndWait();
    }
}
