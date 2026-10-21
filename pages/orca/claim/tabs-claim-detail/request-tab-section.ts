import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class RequestTabSection extends BasePage {
    // Request(s) tab controls
    tblRequests = new Table(this.page, '//div[@id="requests"]//table[@class="table table-striped table-bordered"]');
    actionsLink = new Link(this.page, '//a[@title="View Request"]');
    // Button to open the Request Medical Records dialog
    requestMedicalRecordsButton = new Link(this.page, '//a[@title="Request Medical Records" or contains(.,"Request Medical Records")]');
    medicalRecordTable = new Table(this.page, '//*[@id="requests"]/div/table');
}
