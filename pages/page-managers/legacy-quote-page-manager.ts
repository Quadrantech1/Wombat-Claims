import { CompleteEnrollmentPage } from '@pages/market-channels/legacy-quote/complete-enrollment-page';
import { CongratulationsEnrollmentPage } from '@pages/market-channels/legacy-quote/congratulations-enrollment-page';
import { CoveragePage } from '@pages/market-channels/legacy-quote/coverage-page';
import { GetQuotePage } from '@pages/market-channels/legacy-quote/get-quote-page';
import { MainPage } from '@pages/market-channels/legacy-quote/main-page';
import { Page } from '@playwright/test';
import { BasePageManager } from './base-page-manager';

export class LegacyQuotePageManager extends BasePageManager {
    readonly mainPage: MainPage;
    readonly getQuotePage: GetQuotePage;
    readonly coveragePage: CoveragePage;
    readonly completeEnrollmentPage: CompleteEnrollmentPage;
    readonly congratulationsEnrollmentPage: CongratulationsEnrollmentPage;

    constructor(page: Page) {
        super(page);
        this.mainPage = new MainPage(page);
        this.getQuotePage = new GetQuotePage(page);
        this.coveragePage = new CoveragePage(page);
        this.completeEnrollmentPage = new CompleteEnrollmentPage(page);
        this.congratulationsEnrollmentPage = new CongratulationsEnrollmentPage(page);
    }

    /**
     * Create a new manager for a different page (e.g., new tab)
     * @param newPage - The new page instance
     * @returns New LegacyQuotePageManager instance
     */
    forPage(newPage: Page): LegacyQuotePageManager {
        return new LegacyQuotePageManager(newPage);
    }
}