import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { LoadingPanel } from '../common-section/loading-section';
import { AllowanceTabPanel } from './tabs-pet-detail/allowance-tab-section';
import { PetAttachmentsTabPanel } from './tabs-pet-detail/attachment-tab-section';
import { BenefitScheduleTabPanel } from './tabs-pet-detail/benefit-schedule-tab-section';
import { PetClaimsTabPanel } from './tabs-pet-detail/claim-tab-section';
import { IncidentTabPanel } from './tabs-pet-detail/incident-tab-section';
import { ReimbursementTrackerHistoryTabPanel } from './tabs-pet-detail/reimbursement-tracker-history-tab-section';
import { WaitingPeriodWaiverHistoryTabPanel } from './tabs-pet-detail/waiting-period-waiver-history-tab-section';

export enum TabPetOptions {
    Incidents = 'Incident(s)',
    Attachments = 'Attachment(s)',
    Claims = 'Claim(s)',
    BenefitSchedule = 'Benefit Schedule',
    Allowances = 'Allowances',
    WaitingPeriodWaiverHistory = 'Waiting Period Waiver History',
    ReimbursementTrackerHistory = 'Reimbursement Tracker History',
}

export class TabsPetDetailPanel extends BasePage {

    // Tab sections
    incidentTabSection = new IncidentTabPanel(this.page);
    attachmentTabSection = new PetAttachmentsTabPanel(this.page);
    claimTabSection = new PetClaimsTabPanel(this.page);
    benefitScheduleTabSection = new BenefitScheduleTabPanel(this.page);
    allowanceTabSection = new AllowanceTabPanel(this.page);
    waitingPeriodWaiverHistoryTabSection = new WaitingPeriodWaiverHistoryTabPanel(this.page);
    reimbursementTrackerHistoryTabSection = new ReimbursementTrackerHistoryTabPanel(this.page);

    // Loading section
    loadingSection = new LoadingPanel(this.page);

    /**
     * Gets the tab link element by tab name
     * @param tabName - The visible text of the tab
     */
    private tabLinkFor(tabName: TabPetOptions): Label {
        return new Label(this.page, `//ul[@class='nav nav-tabs']//a[normalize-space()='${tabName}']`);
    }

    /**
     * Clicks on a tab option and waits for loading to complete
     * @param tabOption - The tab to click on
     */
    async openTab(tabOption: TabPetOptions): Promise<void> {
        logger.info(`[TabsPetDetailSection.clickTabOption] - Clicking tab option: ${tabOption}`);
        await this.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears();

        const tabLink = this.tabLinkFor(tabOption);
        await tabLink.click();

        await this.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears();
    }
}