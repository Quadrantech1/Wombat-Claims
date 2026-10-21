import { Button } from '@controls/button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { getDefaultOppPdfDownloadFormData, OppPdfDownloadFormData } from '@data/opp/form-data';

export class OppPdfDownloadPage extends BasePage {

    firstNameTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'First Name*' }));
    lastNameTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Last Name*' }));
    workEmailTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Work Email*' }));
    phoneTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Phone' }));
    companyRoleSelect = new Select(this.page, this.page.getByLabel('Company Role*'));
    jobTitleTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Job Title' }));
    companyNameTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Company Name' }));
    companySizeSelect = new Select(this.page, this.page.getByLabel('Company Size'));
    corporateHqStateSelect = new Select(this.page, this.page.getByLabel('Corporate HQ (State)*'));
    submitButton = new Button(this.page, this.page.locator('#form-target'));

    async fillDownloadForm(formData?: Partial<OppPdfDownloadFormData>): Promise<void> {
        logger.info('[OppPdfDownloadPage.fillDownloadForm] Filling PDF download request form');
        const data = { ...getDefaultOppPdfDownloadFormData(), ...formData };

        await this.firstNameTextBox.setText(data.firstName);
        await this.lastNameTextBox.setText(data.lastName);
        await this.workEmailTextBox.setText(data.workEmail);
        if (data.phone) await this.phoneTextBox.setText(data.phone);
        await this.companyRoleSelect.selectValue(data.companyRole);
        if (data.jobTitle) await this.jobTitleTextBox.setText(data.jobTitle);
        if (data.companyName) await this.companyNameTextBox.setText(data.companyName);
        await this.corporateHqStateSelect.selectValue(data.corporateHqState);

        logger.info('[OppPdfDownloadPage.fillDownloadForm] Form filled successfully');
    }
}
