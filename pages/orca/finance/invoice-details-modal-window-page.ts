import { Button } from '@controls/button';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class InvoiceDetailsModalWindowPage extends BasePage {
    invoiceDetailsTable = new Table(this.page, "//div[@class='modal-body']/table[@id='transactions-table']");
    closeButton = new Button(this.page, "//button[contains(.,'Close')]");
}
