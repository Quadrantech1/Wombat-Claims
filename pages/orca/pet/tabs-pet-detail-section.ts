import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { LoadingSection } from '../common-section/loading-section';
import { AllowanceTabSection } from './tabs-pet-detail/allowance-tab-section';
import { AttachmentTabSection } from './tabs-pet-detail/attachment-tab-section';
import { BenefitScheduleTabSection } from './tabs-pet-detail/benefit-schedule-tab-section';
import { ClaimTabSection } from './tabs-pet-detail/claim-tab-section';
import { IncidentTabSection } from './tabs-pet-detail/incident-tab-section';
import { ReimbursementTrackerHistoryTabSection } from './tabs-pet-detail/reimbursement-tracker-history-tab-section';
import { WaitingPeriodWaiverHistoryTabSection } from './tabs-pet-detail/waiting-period-waiver-history-tab-section';

export enum TabPetOptions {
    Incidents = 'Incident(s)',
    Attachments = 'Attachment(s)',
    Claims = 'Claim(s)',
    BenefitSchedule = 'Benefit Schedule',
    Allowances = 'Allowances',
    WaitingPeriodWaiverHistory = 'Waiting Period Waiver History',
    ReimbursementTrackerHistory = 'Reimbursement Tracker History',
}

export class TabsPetDetailSection extends BasePage {

    // Tab sections
    incidentTabSection = new IncidentTabSection(this.page);
    attachmentTabSection = new AttachmentTabSection(this.page);
    claimTabSection = new ClaimTabSection(this.page);
    benefitScheduleTabSection = new BenefitScheduleTabSection(this.page);
    allowanceTabSection = new AllowanceTabSection(this.page);
    waitingPeriodWaiverHistoryTabSection = new WaitingPeriodWaiverHistoryTabSection(this.page);
    reimbursementTrackerHistoryTabSection = new ReimbursementTrackerHistoryTabSection(this.page);

    // Loading section
    loadingSection = new LoadingSection(this.page);

    /**
     * Gets the tab link element by tab name
     * @param tabName - The visible text of the tab
     */
    private getTabLink(tabName: TabPetOptions): Label {
        return new Label(this.page, `//ul[@class='nav nav-tabs']//a[normalize-space()='${tabName}']`);
    }

    /**
     * Clicks on a tab option and waits for loading to complete
     * @param tabOption - The tab to click on
     */
    async clickTabOption(tabOption: TabPetOptions): Promise<void> {
        logger.info(`[TabsPetDetailSection.clickTabOption] - Clicking tab option: ${tabOption}`);
        await this.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears();

        const tabLink = this.getTabLink(tabOption);
        await tabLink.click();

        await this.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears();
    }
}