import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { RequestMedicalRecordPage } from '@pages/orca/claim/request-medical-record-page';

export class GroupRequestMedicalRecordPage extends RequestMedicalRecordPage {
    requestSearchTextBox = new TextBox(this.page, '//input[@placeholder="Search for Requests"]');

    // Send Request Popup
    selDelMethodDropdown = new Select(this.page, '#delivery-method');
    txtDeliverToTextBox = new TextBox(this.page, '#deliver-to');
    lblMRReqIdLabel = new Label(this.page, '//div[contains(text(),"Request Id")]/following-sibling::div[@class="controls"]');
}
