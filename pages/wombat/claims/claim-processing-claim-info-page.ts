import { Button } from '@controls/button';
import { BasePage } from '@pages/base-page';

export class ClaimProcessingClaimInfoPage extends BasePage {
    menuIconButton = new Button(this.page, '//span[contains(.,"menu")]');
    cancelClaimOption = new Button(this.page, '//button/span[contains(.,"Cancel Claim")]');
    runRulesOption = new Button(this.page, '//button/span[contains(.,"Run Rules")]');
    completeClaimOption = new Button(this.page, '//button/span[contains(.,"Complete Claim")]');
    setPendingOption = new Button(this.page, '//button/span[contains(.,"Set Pending")]');
    requestRecordsOption = new Button(this.page, '//button/span[contains(.,"Request Records")]');
    duplicateOption = new Button(this.page, '//button/span[contains(.,"Duplicate")]');
    reassignClaimOption = new Button(this.page, '//button/span[contains(.,"Reassign Claim")]');
    sendBackToQueueOption = new Button(this.page, '//button/span[contains(.,"Send Back to Queue")]');


    /** cancel dialod */
    okButtonCancelDialog = new Button(this.page, '//button[contains(.,"Ok")]');
    cancelButtonCancelDialog = new Button(this.page, this.page.getByRole('button', { name: 'Cancel' }));

    /** end cancel dialog */

}

