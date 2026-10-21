import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { BasePage } from '@pages/base-page';
import { AngularAlertSection } from '@pages/orca/common-section/angular-alert-section';

export class IncidentPage extends BasePage {
    incidentTypesLink = new Link(this.page, "//a[contains(text(),'Incident Types')]");
    incidentRulesLink = new Link(this.page, "//a[contains(text(),'Incident Rules')]");

    deleteButton = new Button(this.page, "//button[@class='btn btn-danger ms-auto']");
    saveButton = new Button(this.page, this.page.getByRole('button', { name: 'Save' }));
    cancelButton = new Button(this.page, this.page.getByRole('button', { name: 'Cancel' }));
    createNewButton = new Button(this.page, this.page.getByRole('button', { name: 'Create New' }));
    searchTextBox = new Button(this.page, this.page.getByRole('textbox', { name: 'Search', exact: true }));

    angularAlertSection = new AngularAlertSection(this.page);
}