import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class PaymentInfoSection extends BasePage {
    // pet info
    invoiceHistoryTable = new Table(this.page, "//div[contains(@class,'invoice-history')]/table");
    invoiceItemTable = new Table(this.page, "#tblinvoiceitems");
    adjustmentsTable = new Table(this.page, "#tbladjustments");
    billingDetailLink = new Link(this.page, "//a[text()='Billing Detail']");


}


