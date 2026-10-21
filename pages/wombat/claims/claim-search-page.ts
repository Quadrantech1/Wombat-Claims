import { Button } from '@controls/button';
import { TextBox } from '@controls/textbox';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { timeouts } from '@utils/timeouts-util';
import { LoadingCoverBarSection } from '../common/loading-cover-bar-section';
import { logger } from '@utils/logger-util';

export class ClaimSearchPage extends BasePage {
    searchTextBox = new TextBox(this.page, '//input');
    searchButton = new Button(this.page, '//button[@mattooltip="Search"]');
    searchResultsTable = new Table(this.page, '//table[@class="ClaimSearchTable"]');
    loadingCoverBarSection = new LoadingCoverBarSection(this.page);

    async searchClaim(claimNumber: string): Promise<void> {
        logger.info(`[ClaimSearchPage.searchClaim] Searching for claim number: ${claimNumber}`);
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
        await this.searchTextBox.waitForVisible(timeouts.fourMinutes);
        await this.searchTextBox.setText(claimNumber);
        await this.searchButton.clickAndWait();
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
    }
}

