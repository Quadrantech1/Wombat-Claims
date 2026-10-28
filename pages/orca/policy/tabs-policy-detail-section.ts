import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { GroupAttachmentsTabPanel } from '@pages/orca-group/certificate/group-attachment-tab-section';
import { PetTabPanel } from '@pages/orca/policy/tabs-policy-detail/pet-tab-section';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { LoadingPanel } from '../common-section/loading-section';
import { PolicyAttachmentsTabPanel } from './tabs-policy-detail/attachment-tab-section';
import { PolicyClaimsTabPanel } from './tabs-policy-detail/claim-tab-section';
import { CoverageTabPanel } from './tabs-policy-detail/coverage-tab-setion';
import { CustomerTabPanel } from './tabs-policy-detail/customer-tab-section';
import { FollowUpsTabPanel } from './tabs-policy-detail/followups-tab-section';
import { PolicyNotesTabPanel } from './tabs-policy-detail/note-tab-section';
import { PolicyStatusHistoryTabPanel } from './tabs-policy-detail/policy-status-history-tab-section';
import { SelfServiceChangesTabPanel } from './tabs-policy-detail/self-service-changes-tab-section';
import { TransactionTabPanel } from './tabs-policy-detail/transaction-tab-section';

export enum TabPolicyOptions {
    coverageTab = 'Coverage(s)',
    customerTab = 'Customer(s)',
    attachmentTab = 'Attachment(s)',
    petTab = 'Pet(s)',
    claimTab = 'Claim(s)',
    noteTab = 'Notes(s)',
    transactionTab = 'Transaction(s)',
    followUpTab = 'Follow-up(s)',
    policyStatusHistoryTab = 'Policy Status History',
    selfServiceChangesTab = 'Self Service Changes',
    employeeTab = 'Employee(s)',
    priorCoverageCreditTab = 'Prior Coverage Credit',
}

export class TabsPolicyDetailPanel extends BasePage {

    coverageTabSection = new CoverageTabPanel(this.page);
    claimTabSection = new PolicyClaimsTabPanel(this.page);
    petTabSection = new PetTabPanel(this.page);
    attachmentTabSection = new PolicyAttachmentsTabPanel(this.page);
    selfServiceChangesTabSection = new SelfServiceChangesTabPanel(this.page);
    transactionTabSection = new TransactionTabPanel(this.page);
    customerTabSection = new CustomerTabPanel(this.page);
    noteTabSection = new PolicyNotesTabPanel(this.page);
    followupsTabSection = new FollowUpsTabPanel(this.page);
    policyStatusHistoryTabSection = new PolicyStatusHistoryTabPanel(this.page);
    groupAttachmentTabSection = new GroupAttachmentsTabPanel(this.page);

    loadingSection = new LoadingPanel(this.page);

    async openTab(option: TabPolicyOptions): Promise<void> {
        logger.info("[TabsPolicyDetailSection>clickTabOption] tab option: " + option);
        let tabLink = new Label(this.page, `//a[@title="${option}"]`);
        await this.page.waitForLoadState('networkidle');
        await tabLink.click();
        await this.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(timeouts.polling);
    }
}