import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class IncidentDetailPage extends BasePage {
    dateOfEligibilityTextBox = new TextBox(this.page, "#Incident_DateOfEligibility");
    dateOfEligibilityToolTip = new Label(this.page, "//div[@class='tooltip-inner']");
    onsetDateTextBox = new TextBox(this.page, "#Incident_OnsetDate");
    incidentIdLabel = new Label(this.page, "//strong[contains(.,'Incident Id')]/../..//div[@class='controls']");
    petLabel = new Label(this.page, "//strong[contains(.,'Pet')]/../..//div[@class='controls']");
    incidentTypeTextBox = new TextBox(this.page, "#incident_type");
    openDiagnosisTextBox = new TextBox(this.page, "#Incident_OpenDiagnosis");
    denialCodeTextBox = new TextBox(this.page, "#DenialCodeText_autocomplete");
    detailTextBox = new TextBox(this.page, "#Incident_Details");
    incidentLimitLabel = new Label(this.page, "//div/strong[text()='Incident Limit (Onset)']/parent::*/parent::*/div[@class='controls']");

    claimsTable = new Table(this.page, "//table");
    deleteButton = new Button(this.page, "//a[@class='confirm btn btn-danger']");
    yesButton = new Button(this.page, "//div[@id='remove-dialog']//a[@class='btn btn-danger'][normalize-space()='Yes']");
}
