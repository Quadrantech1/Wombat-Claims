import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { TabsPolicyDetailSection } from '@pages/orca/policy/tabs-policy-detail-section';
import { PolicyDetailPage } from '@pages/orca/policy/policy-detail-page';

export class GroupCertificateDetailPage extends PolicyDetailPage {
    certificateNoLabel = new Label(this.page, "//strong[contains(.,'Certificate No')]/../..//div[@class='controls']");
    groupNameLabel = new Label(this.page, this.page.locator("xpath=//strong[contains(.,'Group Name')]/../..//div[@class='controls']").first());
    deliveryTypeDropDown = new Select(this.page, "//select[@id='DeliveryTypeId']");

    customerDetailsTable = new Table(this.page, '//table[@id="customers-table"]');
    iconLink = new Link(this.page, '//i[@class="icon-white icon-info-sign"]');
    noteCheckbox = new Checkbox(this.page, '//input[@id="Employee_IsNoteImportant"]');
    noteTextbox = new TextBox(this.page, '//textarea[@id="Employee_PriorityNote"]');

    demoUpdateRecCheckbox = new Checkbox(this.page, "//div[text()='Demographic Update Received']/following-sibling::div//p/input[@type='checkbox']");
    demoUpdateRecTimeStamp = new Label(this.page, "//div[text()='Demographic Update Received']/following-sibling::div//p[1]");

    alertBannerLabel = new Label(this.page, "//div[@class='alert alert-info']/center");
    figoAlertMassage = new Label(this.page, "#Group_Figo_Info");

    // tab
    tabsCertificateDetailSection = new TabsPolicyDetailSection(this.page);
}
