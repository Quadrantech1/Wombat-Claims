import { BasePage } from '@pages/base-page';
import { Button } from '@controls/button';
import { TextBox } from '@controls/textbox';
import { Table } from '@controls/table';
import { Select } from '@controls/select';

export class UserManagementPage extends BasePage {
    clearButton = new Button(this.page, "//a[contains(text(),'Clear')]");
    runSearchButton = new Button(this.page, "#btn-run-search");
    addNewButton = new Button(this.page, "//a[contains(text(),' Add New')]");
    searchResultTable = new Table(this.page, "#search-results");

    syUserIdTextBox = new TextBox(this.page, "#SearchCriteria_SysuserId");
    userNameTextBox = new TextBox(this.page, "#SearchCriteria_UserName");
    firstNameTextBox = new TextBox(this.page, "#SearchCriteria_FirstName");
    lastNameTextBox = new TextBox(this.page, "#SearchCriteria_LastName");
    emailAddressTextBox = new TextBox(this.page, "#SearchCriteria_EmailAddress");
    brokerIdTextBox = new TextBox(this.page, "#SearchCriteria_BrokerId");
    registerButton = new Button(this.page, "//table[@id='search-results']//td/a[@class='ajax-post btn btn-primary btn-mini']");
    viewButton = new Button(this.page, "//table[@id='search-results']//td/a[@class='btn btn-info btn-mini']");

    syuserIdSortButton = new Button(this.page, "//th[text()='Sysuser Id']");
    userSortButton = new Button(this.page, "//th[text()='User']");
    actionButton = new Button(this.page, "//th[text()='Actions']");
    brokerButton = new Button(this.page, "//th[text()='Broker']");

    syUserIdResultLabel = new Table(this.page, "//*[@id='search-results']//tr//td[1]");
    userResultTable = new Table(this.page, "//*[@id='search-results']//tr//td[2]");
    paginationPropertyDropdown = new Select(this.page, "//*[@id='pager']/form/select");
}
