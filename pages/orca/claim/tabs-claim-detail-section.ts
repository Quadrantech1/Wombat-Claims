import { AttachmentTabSection } from './tabs-claim-detail/attachment-tab-section';
import { FinanceTabSection } from './tabs-claim-detail/finance-tab-section';
import { NoteTabSection } from './tabs-claim-detail/note-tab-section';
import { ProcessingTabSection } from './tabs-claim-detail/processing-tab-section';
import { RequestTabSection } from './tabs-claim-detail/request-tab-section';

import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { LoadingSection } from '../common-section/loading-section';

export enum TabClaimOptions {
    processingTab = 'processingTab',
    attachmentTab = 'attachmentTab',
    financeTab = 'financeTab',
    noteTab = 'noteTab',
    historyTab = 'historyTab',
    auditReturnHistoryTab = 'auditReturnHistoryTab',
    requestTab = 'requestTab',
    claimTab = 'claimTab',
    followUpTab = 'followUpTab',

}

export class TabsClaimDetailSection extends BasePage {

    processingTab = new Label(this.page, "#processing-link");
    attachmentTab = new Label(this.page, "//a[@title='Attachments(s)' or @title='Attachment(s)']");
    financeTab = new Label(this.page, "#checks-link");
    noteTab = new Label(this.page, "//a[@id='notes-link' or @title='Notes(s)']");
    historyTab = new Label(this.page, "#history-link");
    auditReturnHistoryTab = new Label(this.page, "#audit-return-history-link");
    requestTab = new Label(this.page, "//a[text()='Request(s)']");
    claimTab = new Label(this.page, '//a[@title="Claim(s)"]');
    followUpTab = new Label(this.page, "//a[@title='Follow-up(s)']");
    loadingSection = new LoadingSection(this.page);
    // sections
    processingTabSection = new ProcessingTabSection(this.page);
    attachmentTabSection = new AttachmentTabSection(this.page);
    financeTabSection = new FinanceTabSection(this.page);
    noteTabSection = new NoteTabSection(this.page);
    requestTabSection = new RequestTabSection(this.page);

    async clickTabOption(option: TabClaimOptions): Promise<void> {
        logger.info("[TabsClaimDetailSection>clickTabOption] tab option: " + option);
        await this.page.waitForLoadState('networkidle', { timeout: timeouts.short });
        await this.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears();
        await this.page.waitForTimeout(timeouts.polling);
        switch (option) {
            case TabClaimOptions.processingTab:
                await this.processingTab.click();
                break;
            case TabClaimOptions.attachmentTab:
                await this.attachmentTab.click();
                break;
            case TabClaimOptions.financeTab:
                await this.financeTab.click();
                break;
            case TabClaimOptions.noteTab:
                await this.noteTab.click();
                break;
            case TabClaimOptions.historyTab:
                await this.historyTab.click();
                break;
            case TabClaimOptions.auditReturnHistoryTab:
                await this.auditReturnHistoryTab.click();
                break;
            case TabClaimOptions.requestTab:
                await this.requestTab.click();
                break;
            case TabClaimOptions.followUpTab:
                await this.followUpTab.click();
                break;
            case TabClaimOptions.claimTab:
                await this.claimTab.click();
                break;
            default:
                throw new Error(`Tab option not recognized: ${option}`);
        }
        await this.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears();
        await this.page.waitForLoadState('networkidle', { timeout: timeouts.default });
    }

}