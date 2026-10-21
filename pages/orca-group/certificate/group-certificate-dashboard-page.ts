import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class GroupCertificateDashboardPage extends BasePage {
    groupNameTextBox = new TextBox(this.page, "#GroupNames");
    certificateNumberTextBox = new TextBox(this.page, "#SearchCriteria_CertificateNo");
    lastNameTextBox = new TextBox(this.page, "#SearchCriteria_LastName");
    emailAddressTextBox = new TextBox(this.page, "#SearchCriteria_EmailAddress");
    phoneNumberTextBox = new TextBox(this.page, "#SearchCriteria_PhoneNumber");
    postalCodeTextBox = new TextBox(this.page, "#SearchCriteria_PostalCode");
    petNameTextBox = new TextBox(this.page, "#SearchCriteria_PetName");
    runSearchButton = new Button(this.page, "#btn-run-search");
    searchResultTable = new Table(this.page, "//table[@id=\"search-results\"]");
    searchResultsLink = new Link(this.page, this.page.getByRole('link', { name: 'Search Result(s)', exact: true }));
    yourFollowUpsLink = new Link(this.page, this.page.getByRole('link', { name: 'Your Follow-up(s)', exact: true }));
}
