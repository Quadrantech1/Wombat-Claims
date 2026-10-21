import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class CustomerTabSection extends BasePage {

    viewCustomerIconInActionsLink = new Link(this.page, "//a[@title='View Customer']");
    addCustomerButton = new Button(this.page, "//a[@title='Add Customer']");
    customerTable = new Table(this.page, "#customers-table");

    /**
     * Checks if customer email is displayed in the customer table
     * @param email Customer email to check for
     * @returns True if email is displayed, false otherwise
     */
    async emailCustomer(email: string): Promise<boolean> {
        logger.info(`[CustomerTabSection.emailCustomer] - Checking if email '${email}' is displayed`);
        return await new Label(this.page, `//*[contains(@id,'customers')]//a[contains(text(),'${email}')]`).isDisplayed();
    }

    /**
     * Clicks on the delete icon for a specific customer by name
     * @param expectedCustomerName Name of the customer to delete
     */
    async clickOnDeleteIcon(expectedCustomerName: string): Promise<void> {
        logger.info(`[CustomerTabSection.clickOnDeleteIcon] - Clicking delete icon for customer '${expectedCustomerName}'`);

        const rowCount = await this.customerTable.getLocator().locator('tbody tr').count();

        for (let i = 1; i <= rowCount; i++) {
            const customerNameText = await new Label(this.page, `//table[@id='customers-table']//tbody/tr[${i}]/td[1]`).getText();

            if (customerNameText.trim().includes(expectedCustomerName)) {
                await new Link(this.page, `//table[@id='customers-table']//tbody/tr[${i}]//a[@title='Remove Customer']`).click();
                logger.info(`[CustomerTabSection.clickOnDeleteIcon] - Successfully clicked delete icon for customer '${expectedCustomerName}' in row ${i}`);
                break;
            }
        }
    }
}