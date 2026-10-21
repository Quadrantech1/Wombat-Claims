import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class McLeadDetailsPage extends BasePage {
    salesforceIdTextBox = new TextBox(this.page, "xpath=//input[@id = 'Pet_SalesforceId' and @type ='text']");
    mcLeadDetailsLabel = new Label(this.page, "xpath=//h3[text()='McLead Details']");
    registrationNo = new TextBox(this.page, "id=Pet_RegNo");
    addRegistrationsButton = new Button(this.page, this.page.getByRole('link', { name: 'Add Registration' }));
    // Owner(s) information
    primaryCustomerLabel = new Label(this.page, "xpath=//td[img[@class='primary-Model']]");

    /**
     * Gets the alternative customer row by name
     * @param name - Customer name to find in the table
     * @returns Label control for the customer row
     */
    getAlternativeCustomer(name: string): Label {
        logger.info(`[McLeadDetailsPage.getAlternativeCustomer] - Getting alternative customer row for: ${name}`);
        return new Label(this.page, `xpath=//table[@id="customers-table"]//td[contains(text(),"${name}")]/parent::*`);
    }

    /**
     * Verifies if an alternative customer is active (does not have 'muted' class)
     * @param name - Customer name to verify
     * @returns Promise<boolean> - true if customer is active, false if inactive
     */
    async isAlternativeCustomerActive(name: string): Promise<boolean> {
        logger.info(`[McLeadDetailsPage.isAlternativeCustomerActive] - Checking if customer ${name} is active`);
        const customerRow = this.getAlternativeCustomer(name);
        const className = await customerRow.getLocator().getAttribute('class');
        const isActive = className !== 'muted';
        logger.info(`[McLeadDetailsPage.isAlternativeCustomerActive] - Customer ${name} active status: ${isActive} (class: ${className})`);
        return isActive;
    }
}
