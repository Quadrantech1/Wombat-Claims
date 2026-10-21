import { Button } from '@controls/button';
import { TextBox } from '@controls/textbox';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';

export class ClaimDetailPage extends BasePage {
    petAndClaimInfoTab = new Button(this.page, '//div[text()="Pet & Claim Info"]');
    healthHistoryTab = new Button(this.page, '//div[text()="Health History"]');
    notesAndFilesTab = new Button(this.page, '//div[text()="Notes & Files"]');
    foodAndWellnessTab = new Button(this.page, '//div[text()="Food & Wellness"]');
    appealHistoryTab = new Button(this.page, '//div[text()="Appeal History"]');

    takeOwnershipButton = new Button(this.page, '//h4//button[contains(.,"Take Ownership")]');

    // claims history
    claimHistoryTable = new Table(this.page, '//table[contains(@class,"insert")]');



}

