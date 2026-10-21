import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { AlertSection } from '../common-section/alert-section';
import { ClaimTeamInbox } from './claim-team-inbox';

export class ClaimDashboard extends BasePage {

    startPreparingClaimButton = new Button(this.page, "//a[contains(.,'Start prepping claim')]");
    getClaimButton = new Button(this.page, "//a[contains(.,'Get Claim')]");

    turnAroundTimeAssistantsQueueLink = new Link(this.page, "//a[contains(text(),'Turn Around Time - Assistants queue')]");
    turnAroundTimeInvestigativeQueueLink = new Link(this.page, "//a[contains(text(),'Turn Around Time - Investigative queue')]");
    turnAroundTimeQuickClaimsQueueLink = new Link(this.page, "//a[contains(text(),'Turn Around Time - Quick Claims queue')]");
    receivedLink = new Link(this.page, "//a[contains(text(),'Received')]");
    processingLink = new Link(this.page, "//a[contains(text(),'Processing')]");
    assignedLink = new Link(this.page, "//a[contains(text(),'Assigned')]");

    adjusterProfileButton = new Button(this.page, "//a[text()='Adjuster Profiles']");
    myDashboardButton = new Button(this.page, "//a[text()='My Dashboard']");
    claimTeamInboxButton = new Button(this.page, "//a[text()='Claims Team Inbox']");
    issueClaimButton = new Button(this.page, "//a[text()='Issue Claims']");
    eobNotesButton = new Button(this.page, "//a[text()='EOB Notes']");
    searchForClaimButton = new Button(this.page, "//a[text()='Search for a Claim']");

    // Selects
    selectUserSelect = new Select(this.page, '#selected-sysuser-id');
    selectPageSizeInTable = new Select(this.page, "//select[@class='pagesize']");

    // Tables
    assignedTable = new Table(this.page, "//a[contains(., 'Assigned')]/parent::*/parent::*/parent::*//table[@class='table table-striped table-bordered tablesorter']");
    numberOfRowsDropdown = new Select(this.page, "//select[contains(@class, 'pagesize')]");
    // Buttons
    lastItemsButton = new Button(this.page, "//form/img[@class='last']");
    issueClaimsButton = new Button(this.page, "//button[@id='issue-button']");

    alertSection = new AlertSection(this.page);

    claimTeamInbox = new ClaimTeamInbox(this.page);

    async selectAllRowsInTable(): Promise<void> {
        logger.info(`[ClaimDashboard.selectAllRowsInTable] - Selecting 'All Rows' in the number of rows dropdown if it is displayed`);
        if (await this.numberOfRowsDropdown.isDisplayed()) {
            await this.numberOfRowsDropdown.selectOption('All Rows');
        } else {
            logger.info(`[ClaimDashboard.selectAllRowsInTable] - Number of rows dropdown is not displayed, skipping selection`);
        }
    }
}
