import { Link } from '@controls/link';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

/**
 * AdminDashboardPage
 * Centralized strongly typed locators for the left navigation admin dashboard & related sections.
 * Based on provided markup snapshot. Uses ids where stable; falls back to text when required.
 */
export class AdminDashboardPage extends BasePage {
    // --- Admin Section ---
    userManagementLink = new Link(this.page, '#userManagement');
    petManagementLink = new Link(this.page, '#petManagement');
    featureFlagsLink = new Link(this.page, '#featureFlags');
    errorLogLink = new Link(this.page, '#errorLog');

    /**
     * Returns a Link control for a Functional Area by its visible name (e.g., 'Admin', 'Affiliate').
     * Name must match text exactly as displayed (case sensitive normalization via normalize-space()).
     */
    functionalAreaLink(tabName: string): Link {
        return new Link(this.page, `//a[contains(@href,'functionalAreaId=') and normalize-space()='${tabName}']`);
    }

    /**
     * Returns a Link control for a Role by partial visible text (e.g., 'Administrator', 'Claims Specialist').
     * Performs a contains match to allow flexible role naming.
     */
    roleLink(roleName: string): Link {
        return new Link(this.page, `//a[contains(@href,'roleId=') and contains(normalize-space(),'${roleName}')]`);
    }

    // --- Rating Section ---
    masterRateSheetsLink = new Link(this.page, '#masterRateSheets');
    ratingModelsLink = new Link(this.page, '#ratingModels');
    ratingFormulasLink = new Link(this.page, '#ratingFormulas');
    discountRulesLink = new Link(this.page, '#discountRulesLink');
    quoteApiLink = new Link(this.page, '#quote-api');
    quoteDiagnosticLink = new Link(this.page, '#quoteDiagnosticLink');

    // --- Product Management Section ---
    filingsLink = new Link(this.page, '#filings');
    productManagementLink = new Link(this.page, '#productManagement');
    productPackagesLink = new Link(this.page, '#productPackages');
    enrollmentQuestionLink = new Link(this.page, "#enrollment\\ question");
    stateManagementLink = new Link(this.page, '#stateManagement');
    benefitSchedulesLink = new Link(this.page, '#benefitSchedules');
    affinityGroupsLink = new Link(this.page, '#affinityGroups');
    rmAffinitiesLink = new Link(this.page, '#rmAffinities');

    // --- Claims Section ---
    claimsProcessingLink = new Link(this.page, '#claimsProcessing');
    claimCheckDiagnosticLink = new Link(this.page, '#claimCheckDiagnostic');

    // --- Document Management Section ---
    attachmentTypeLink = new Link(this.page, '#attachmentType');
    documentPackageLink = new Link(this.page, '#documentPackage');
    documentTypeLink = new Link(this.page, '#documentType');
    documentVersionLink = new Link(this.page, '#documentVersion');
    documentLibraryLink = new Link(this.page, '#documentLibrary');
    documentDataBucketsLink = new Link(this.page, '#documentDataBuckets');
    documentErrorLogLink = new Link(this.page, '#documentErrorLog');
    hammerheadDiagnosticLink = new Link(this.page, '#hammerheadDiagnostic');
    hammerheadDiagnosticStateFilingLink = new Link(this.page, '#hammerheadDiagnosticStateFiling');
    emailDiagnosticLink = new Link(this.page, '#emailDiagnostic');
    hammerheadDiagnosticPerformanceLink = new Link(this.page, '#hammerheadDiagnosticTranslation');

    // --- API Tasks Section ---
    apiTasksLink = new Link(this.page, '#apiTasks');

    async verifyLinksAreVisible(): Promise<void> {
        try {
            logger.info('[AdminDashboardPage.verifyLinksAreVisible] Verifying key links are visible on Admin Dashboard page');
            await expect(this.userManagementLink.getLocator()).toBeVisible({ timeout: timeouts.veryShort });
            await expect(this.quoteApiLink.getLocator()).toBeVisible({ timeout: timeouts.veryShort });
        } catch (error) {
            logger.warning('[AdminDashboardPage.verifyLinksAreVisible] Key links not visible, reloading page and retrying');
            await this.page.reload({ waitUntil: 'networkidle' });
            await expect(this.userManagementLink.getLocator()).toBeVisible({ timeout: timeouts.veryShort });
            await expect(this.quoteApiLink.getLocator()).toBeVisible({ timeout: timeouts.veryShort });
        }
    }
}
