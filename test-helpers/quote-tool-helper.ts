import { CompleteEnrollmentData } from '@data/quote-tool/complete-enrollment-data';
import { CoverageData, UpgradeData } from '@data/quote-tool/coverage-data';
import { GetQuoteData } from '@data/quote-tool/get-quote-data';
import { LegacyQuotePageManager } from '@pages/page-managers/legacy-quote-page-manager';
import { PortalPageManager } from '@pages/page-managers/portal-page-manager';
import { Page, expect } from '@playwright/test';
import { MailosaurService } from '@services/mailosaur-service';
import { Brand, BrandUrl } from '@utils/brand-util';
import { timeouts } from '@utils/timeouts-util';

type CreatePolicyData = Partial<GetQuoteData> & Partial<CoverageData> & Partial<UpgradeData> & Partial<CompleteEnrollmentData>;
export class QuoteToolHelper {
    constructor(private page: Page) { }

    /**
     * Creates a legacy policy through the quote tool workflow.
     * This method navigates through the complete policy creation process including:
     * @param brand - The insurance brand to create the policy for (e.g., 'AKC')
     * @param policyParams - Combined data object containing quote, coverage, upgrade, and enrollment information
     * @returns Promise that resolves to the policy number string of the created policy
     * @throws Will throw an error if any step in the policy creation process fails
     */
    async createLegacyPolicy(
        brand: Brand,
        policyParams: CreatePolicyData
    ): Promise<string> {
        const quote = new LegacyQuotePageManager(this.page);
        const baseUrl = BrandUrl[brand];
        await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await quote.getQuotePage.fillGetQuote(policyParams);
        await this.page.waitForTimeout(timeouts.polling);
        await quote.getQuotePage.clickChooseCoverage();
        const petAgeNumber = Number(policyParams.petAge);
        if (petAgeNumber <= 8) {
            await quote.coveragePage.selectLimits(policyParams);
            await quote.coveragePage.selectUpgrades(policyParams);
        }
        await quote.coveragePage.addToCartButton.click();
        await quote.coveragePage.addToCartButton.waitForDisappear(timeouts.long);
        await quote.completeEnrollmentPage.fillCompleteEnrollment(policyParams);
        await quote.completeEnrollmentPage.enrollNowButton.click();
        await quote.completeEnrollmentPage.enrollNowButton.waitForDisappear(timeouts.long);
        await expect(quote.congratulationsEnrollmentPage.congratulationsLabel.getLocator()).toBeVisible();
        return quote.congratulationsEnrollmentPage.getPolicyNumber();
    }

    async createAccountAndClaim(
        brand: Brand,
        email: string
    ): Promise<string> {
        const mailosaurService = new MailosaurService();
        const portal = new PortalPageManager(this.page);
        const baseUrl = BrandUrl[brand].replace("/enroll", "") + `/portal/#/create-account`;
        await this.page.waitForLoadState('load');
        await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await portal.portalLoginPage.loginWithPasscode(email, mailosaurService);
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(timeouts.polling);
        await expect(portal.mainPortalPage.showCoverageSummaryButton.getLocator()).toBeVisible();
        await portal.mainPortalPage.claimsMenuButton.clickAndWait('load');
        await expect(portal.claimPage.uploadFileLabel.getLocator()).toBeVisible();
        await portal.claimPage.fillClaim();
        await portal.claimPage.submitClaim();
        return portal.claimPage.getClaimNumber();
    }
}