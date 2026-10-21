import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { GroupAttachmentTabSection } from '@pages/orca-group/certificate/group-attachment-tab-section';
import { PetTabSection } from '@pages/orca/policy/tabs-policy-detail/pet-tab-section';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { LoadingSection } from '../common-section/loading-section';
import { AttachmentTabSection } from './tabs-policy-detail/attachment-tab-section';
import { ClaimTabSection } from './tabs-policy-detail/claim-tab-section';
import { CoverageTabSection } from './tabs-policy-detail/coverage-tab-setion';
import { CustomerTabSection } from './tabs-policy-detail/customer-tab-section';
import { FollowsUpTabSection } from './tabs-policy-detail/followups-tab-section';
import { NoteTabSection } from './tabs-policy-detail/note-tab-section';
import { PolicyStatusHistoryTabSection } from './tabs-policy-detail/policy-status-history-tab-section';
import { SelfServiceChangesTabSection } from './tabs-policy-detail/self-service-changes-tab-section';
import { TransactionTabSection } from './tabs-policy-detail/transaction-tab-section';

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

export class TabsPolicyDetailSection extends BasePage {

    coverageTabSection = new CoverageTabSection(this.page);
    claimTabSection = new ClaimTabSection(this.page);
    petTabSection = new PetTabSection(this.page);
    attachmentTabSection = new AttachmentTabSection(this.page);
    selfServiceChangesTabSection = new SelfServiceChangesTabSection(this.page);
    transactionTabSection = new TransactionTabSection(this.page);
    customerTabSection = new CustomerTabSection(this.page);
    noteTabSection = new NoteTabSection(this.page);
    followupsTabSection = new FollowsUpTabSection(this.page);
    policyStatusHistoryTabSection = new PolicyStatusHistoryTabSection(this.page);
    groupAttachmentTabSection = new GroupAttachmentTabSection(this.page);

    loadingSection = new LoadingSection(this.page);

    async clickTabOption(option: TabPolicyOptions): Promise<void> {
        logger.info("[TabsPolicyDetailSection>clickTabOption] tab option: " + option);
        let tabLink = new Label(this.page, `//a[@title="${option}"]`);
        await this.page.waitForLoadState('networkidle');
        await tabLink.click();
        await this.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(timeouts.polling);
    }
}