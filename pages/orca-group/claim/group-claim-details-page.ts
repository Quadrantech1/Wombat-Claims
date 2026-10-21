import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Select } from '@controls/select';

import { ClaimDetailPage } from '@pages/orca/claim/claim-detail-page';
import { logger } from '@utils/logger-util';

export class GroupClaimDetailsPage extends ClaimDetailPage {
    // Buttons
    returnToCertificateButton = new Button(this.page, "//div[@class='row-fluid'][1]//*[contains(text(),'Return to Certificate')]");

    // Selects
    prioritySelect = new Select(this.page, "#claim-priority");

    async clickClaim(claimNumber: string): Promise<void> {
        logger.info(`[GroupClaimDetailsPage.clickClaim] - Clicking claim with number: ${claimNumber}`);
        await new Link(this.page, `//a[contains(@href,'${claimNumber}') and @title='View Claim']`).clickAndWait();
    }
}