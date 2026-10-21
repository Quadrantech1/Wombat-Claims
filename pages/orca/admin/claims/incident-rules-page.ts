import { Checkbox } from '@controls/checkbox';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { getDefaultIncidentRulesData, IncidentRulesEntity } from '@data/orca/incident-rules-data';
import { logger } from '@utils/logger-util';
import { IncidentPage } from './incident-page';

export class IncidentRulesPage extends IncidentPage {
    // Table
    incidentRulesTable = new Table(this.page, this.page.getByLabel('Incident Rules').locator('table'));

    // Form Controls - Select Dropdowns
    incidentTypeSelect = new Select(this.page, "//select[@formcontrolname='incidentTypeId']");
    documentVersionSelect = new Select(this.page, "//select[@formcontrolname='documentVersionId']");
    denialCodeSelect = new Select(this.page, "//select[@formcontrolname='denialCode']");
    limitFrequencySelect = new Select(this.page, "//select[@formcontrolname='limitFrequency']");
    individualProductTypeSelect = new Select(this.page, "//select[@formcontrolname='individualProductTypeId']");
    groupProductTypeSelect = new Select(this.page, "//select[@formcontrolname='groupProductTypeId']");

    // Form Controls - Text Inputs
    denialReasonTextBox = new TextBox(this.page, "//input[@id='denialReasonNote']");
    incidentLimitValueTextBox = new TextBox(this.page, "//input[@id='incidentLimitValue']");

    // Form Controls - Checkboxes
    hasDeductibleCheckbox = new Checkbox(this.page, "//input[@id='hasDeductible']");
    hasCoinsuranceCheckbox = new Checkbox(this.page, "//input[@id='hasCoinsurance']");

    /**
     * Fills out the Incident Rules form
     */
    async fillIncidentRulesForm(incidentRulesData?: Partial<IncidentRulesEntity>): Promise<void> {
        const defaultData = getDefaultIncidentRulesData();
        const data = { ...defaultData, ...incidentRulesData };

        logger.info(`[IncidentRulesPage.fillIncidentRulesForm] - Filling incident rules form`);

        await this.incidentTypeSelect.selectOption(data.incidentType);
        await this.denialReasonTextBox.setText(data.denialReason);
        await this.documentVersionSelect.selectOption(data.documentVersion);
        await this.denialCodeSelect.selectOption(data.denialCode);
        await this.incidentLimitValueTextBox.setText(data.incidentLimitValue);
        await this.limitFrequencySelect.selectOption(data.limitFrequency);
        await this.individualProductTypeSelect.selectOption(data.individualProductType);
        await this.groupProductTypeSelect.selectOption(data.groupProductType);

        if (data.hasCoinsurance) {
            await this.hasCoinsuranceCheckbox.check();
        }

        if (data.hasDeductible) {
            await this.hasDeductibleCheckbox.check();
        }
    }
}