import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { getDefaultIncidentData, IncidentData } from '@data/orca/incident-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { AlertSection } from '../common-section/alert-section';

export class IncidentModal extends BasePage {

    createANewIncidentButton = new Button(this.page, "//div/a[@title='Add New Incident']");
    cancelButton = new Button(this.page, "//button[contains(.,'Cancel')]");
    saveButton = new Button(this.page, "//div[@id='dialog-content']//button[contains(.,'Save')]");
    incidentTable = new Table(this.page, "//div[@id='dialog-content']//table");

    onsetDateTextBox = new TextBox(this.page, "//input[@id='Incident_OnsetDate']");
    dateOfEligibilityTextBox = new TextBox(this.page, "#Incident_DateOfEligibility");
    incidentTypeTextBox = new TextBox(this.page, "//input[@name='incident_type']");
    petLabel = new Label(this.page, "//div[@class='container-fluid modal-header']//strong[contains(.,'Pet')]/../..//div[@class='controls']");
    incidentClassSelect = new Select(this.page, "//select[@id='incident_class_id']");
    openDiagnosisTextBox = new TextBox(this.page, "//input[@id='Incident_OpenDiagnosis']");
    denialCodeTextBox = new TextBox(this.page, "#DenialCodeText_autocomplete");
    detailsTextBox = new TextBox(this.page, "//textarea[@name='Incident.Details']");

    // Alert
    alertSection = new AlertSection(this.page);

    public async addIncident(rowNumber: number): Promise<void> {
        logger.info(`[IncidentModal.addIncident] Adding incident at row number: ${rowNumber}`);
        await this.incidentTable.clickTableCell(1, rowNumber, 'checkbox');
        await this.saveButton.click();
    }

    public async createIncident(incidentData?: Partial<IncidentData>): Promise<void> {
        const data = { ...getDefaultIncidentData(), ...incidentData };
        logger.info(`[IncidentModal.createIncident] Creating incident with data: ${JSON.stringify(data)}`);
        await this.createANewIncidentButton.waitForVisible();
        await this.page.waitForTimeout(timeouts.polling);
        await this.createANewIncidentButton.clickAndWait();
        await this.page.waitForTimeout(timeouts.polling);
        await this.detailsTextBox.click();

        if (data.onSetDate) {
            await this.onsetDateTextBox.click();
            await this.onsetDateTextBox.setTextAndTab(data.onSetDate);
        }


        if (data.incidentTypeInitial && data.incidentType) {
            await this.incidentTypeTextBox.selectTextOption(
                data.incidentTypeInitial,
                data.incidentType
            );
        }

        if (data.openDiagnosis && data.openDiagnosis.trim() !== '') {
            await this.openDiagnosisTextBox.setText(data.openDiagnosis);
        }
        if (data.denialCodeInitial && data.denialCode) {
            await this.page.waitForLoadState('load');
            await this.detailsTextBox.click();
            await this.page.waitForTimeout(timeouts.polling);
            await this.denialCodeTextBox.selectTextOption(data.denialCodeInitial, data.denialCode);
            await this.denialCodeTextBox.clear();
            await this.denialCodeTextBox.selectTextOption(data.denialCodeInitial, data.denialCode);
        }
        if (data.details && data.details.trim() !== '') {
            await this.detailsTextBox.setText(data.details);
        }

        await this.saveButton.isDisplayed();
        await this.saveButton.clickAndWait();
        await this.saveButton.waitWhileControlDisappears();
    }
}
