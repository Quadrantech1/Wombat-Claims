import { Button } from '@controls/button';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class GroupClaimDashboard extends BasePage {
    // Buttons
    claimsTab = new Button(this.page, "//a[text()='Claims']");
    searchForClaimsLink = new Button(this.page, "//a[text()='Search for a Claim']");
    myDashboardButton = new Button(this.page, "//a[text()='My Dashboard']");
    claimsTeamInbox = new Button(this.page, "//a[text()='Claims Team Inbox']");
    issueClaimsButton = new Button(this.page, "//a[text()='Issue Claims']");
    addNewClaimButton = new Button(this.page, "//a[@title='Add Claim']");

    // Tables
    searchResultTable = new Table(this.page, "//*[@id=\"search-results-wrapper\"]/table");
    claimsResultTable = new Table(this.page, "a[class='selector']");
}
