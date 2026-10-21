import { ClaimPage } from '@pages/portal/claims/claim-page';
import { MainPortalPage } from '@pages/portal/main-portal-page';
import { AddPetQuotePage } from '@pages/portal/policy/add-pet-quote-page';
import { PolicyDetailPage } from '@pages/portal/policy/policy-detail-page';
import { PortalCompleteEnrollmentPage } from '@pages/portal/policy/portal-complete-enrollment-page';
import { PortalCongratulationEnrollmentPage } from '@pages/portal/policy/portal-congratulation-enrollment-page';
import { PortalCustomizePlanPage } from '@pages/portal/policy/portal-customize-plan-page';
import { PortalLoginPage } from '@pages/portal/portal-login-page';
import { Page } from '@playwright/test';
import { BasePageManager } from './base-page-manager';

export class PortalPageManager extends BasePageManager {
    readonly portalLoginPage: PortalLoginPage;
    readonly mainPortalPage: MainPortalPage;
    readonly policyDetailPage: PolicyDetailPage;
    readonly addPetQuotePage: AddPetQuotePage;
    readonly portalCompleteEnrollmentPage: PortalCompleteEnrollmentPage;
    readonly portalCongratulationEnrollmentPage: PortalCongratulationEnrollmentPage;
    readonly portalCustomizePlanPage: PortalCustomizePlanPage;
    readonly claimPage: ClaimPage;

    constructor(page: Page) {
        super(page);
        this.portalLoginPage = new PortalLoginPage(page);
        this.mainPortalPage = new MainPortalPage(page);
        this.policyDetailPage = new PolicyDetailPage(page);
        this.addPetQuotePage = new AddPetQuotePage(page);
        this.portalCompleteEnrollmentPage = new PortalCompleteEnrollmentPage(page);
        this.portalCongratulationEnrollmentPage = new PortalCongratulationEnrollmentPage(page);
        this.portalCustomizePlanPage = new PortalCustomizePlanPage(page);
        this.claimPage = new ClaimPage(page);
    }

    /**
     * Create a new manager for a different page (e.g., new tab)
     * @param newPage - The new page instance
     * @returns New PortalPageManager instance
     */
    forPage(newPage: Page): PortalPageManager {
        return new PortalPageManager(newPage);
    }
}