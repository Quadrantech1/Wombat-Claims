import { Button } from '@controls/button';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class CustomerServiceDashboardPage extends BasePage {
    searchTextBox = new TextBox(this.page, '#customerSearch');
    searchButton = new Button(this.page, "//button[contains(.,'Search')]");
    customerSearchResultTable = new Table(this.page, "#tblCustomerSearchResults");

    async search(value: string): Promise<void> {
        logger.info('[CustomerServiceDashboardPage.search] Searching for customer: ' + value);
        await this.searchTextBox.setText(value);
        await this.searchButton.clickAndWait();
        await this.customerSearchResultTable.waitForExistInDom();
    }


}
