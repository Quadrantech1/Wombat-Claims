import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class ClaimProcessingPage extends BasePage {
    // unsassignet
    enterSearchCriteriaUnassignedTextBox = new TextBox(this.page, '#unassigned-search-text');
    searchUnassignedButton = new Button(this.page, '#unassigned-search-btn')

    //my queue
    enterSearchCriteriaMyQueueTextBox = new TextBox(this.page, '#my-queue-search-text');
    searchMyQueueButton = new Button(this.page, '#my-queue-search-btn');

    searchResultsMyQueueTable = new Table(this.page, '//table[@class="ClaimSearchTable"]');


    async doubleClickOnClaimIdQueueTable(claimId: string): Promise<void> {
        logger.info(`[ClaimProcessingPage.doubleClickOnClaimId] Attempting to double-click on claim ID: ${claimId}`);
        const claimIdLabel = new Label(this.page, `//div[contains(text(),'${claimId}')]`);
        await claimIdLabel.getLocator().dblclick();
        logger.info(`[ClaimProcessingPage.doubleClickOnClaimId] Successfully double-clicked on claim ID: ${claimId}`);
    }
}

