import { AspcaCheckoutPage } from '@pages/market-channels/aspca/aspca-checkout-page';
import { AspcaCoveragePage } from '@pages/market-channels/aspca/aspca-coverage-page';
import { AspcaPetInfoPage } from '@pages/market-channels/aspca/aspca-pet-info-page';
import { AspcaSuccessPage } from '@pages/market-channels/aspca/aspca-success-page';
import { AspcaTotalBar } from '@pages/market-channels/aspca/aspca-total-bar';
import { CFARegistrationModal } from '@pages/market-channels/felix/cfa-registration-modal';
import { CustomQuotePage } from '@pages/market-channels/felix/custom-quote-page';
import { CustomizePlanPage } from '@pages/market-channels/felix/customize-plan-page';
import { FinalizePlanPage } from '@pages/market-channels/felix/finalize-plan-page';
import { PolicyConfirmationPage } from '@pages/market-channels/felix/policy-confirmation-page';
import { PurchaseFooterPage } from '@pages/market-channels/felix/purchase-footer';
import { Review30DayPage } from '@pages/market-channels/felix/review-30-day-page';
import { ThirtyDayCoverageOptionsPage } from '@pages/market-channels/felix/thirty-day-coverage-options-page';
import { PpuStepOnePage } from '@pages/market-channels/ppu/ppu-step-one-page';
import { PpuStepThreePage } from '@pages/market-channels/ppu/ppu-step-three-page';
import { PpuStepTwoPage } from '@pages/market-channels/ppu/ppu-step-two-page';
import { PpuWelcomePage } from '@pages/market-channels/ppu/ppu-welcome-page';
import { ReviewThirtyDayPage } from '@pages/market-channels/quote/review-thirty-day-page';
import { StepOnePage } from '@pages/market-channels/quote/step-one-page';
import { StepThreePage } from '@pages/market-channels/quote/step-three-page';
import { StepTwoPage } from '@pages/market-channels/quote/step-two-page';
import { ThirtyDayActivationPage } from '@pages/market-channels/quote/thirty-day-activation-page';
import { WelcomePage } from '@pages/market-channels/quote/welcome-page';
import { Page } from '@playwright/test';
import { BasePageManager } from './base-page-manager';

export class QuotePageManager extends BasePageManager {

    readonly felix: {
        customQuotePage: CustomQuotePage;
        customizePlanPage: CustomizePlanPage;
        finalizePlanPage: FinalizePlanPage;
        policyConfirmationPage: PolicyConfirmationPage;
        cfaRegistrationModal: CFARegistrationModal;
        purchaseFooterPage: PurchaseFooterPage;
        thirtyDayCoverageOptionsPage: ThirtyDayCoverageOptionsPage;
        review30DayPage: Review30DayPage;
    };

    readonly ppu: {
        stepOnePage: PpuStepOnePage;
        stepTwoPage: PpuStepTwoPage;
        stepThreePage: PpuStepThreePage;
        welcomePage: PpuWelcomePage;
    };

    readonly aspca: {
        petInfoPage: AspcaPetInfoPage;
        coveragePage: AspcaCoveragePage;
        checkoutPage: AspcaCheckoutPage;
        successPage: AspcaSuccessPage;
        totalBar: AspcaTotalBar;
    };


    readonly main: {
        stepOnePage: StepOnePage;
        stepTwoPage: StepTwoPage;
        stepThreePage: StepThreePage;
        reviewThirtyDayPage: ReviewThirtyDayPage;
        welcomePage: WelcomePage;
        thirtyDayActivationPage: ThirtyDayActivationPage;
    };

    constructor(page: Page) {
        super(page);
        this.felix = {
            customQuotePage: new CustomQuotePage(page),
            customizePlanPage: new CustomizePlanPage(page),
            finalizePlanPage: new FinalizePlanPage(page),
            policyConfirmationPage: new PolicyConfirmationPage(page),
            cfaRegistrationModal: new CFARegistrationModal(page),
            purchaseFooterPage: new PurchaseFooterPage(page),
            thirtyDayCoverageOptionsPage: new ThirtyDayCoverageOptionsPage(page),
            review30DayPage: new Review30DayPage(page),
        };
        this.ppu = {
            stepOnePage: new PpuStepOnePage(page),
            stepTwoPage: new PpuStepTwoPage(page),
            stepThreePage: new PpuStepThreePage(page),
            welcomePage: new PpuWelcomePage(page),
        };
        this.main = {
            stepOnePage: new StepOnePage(page),
            stepTwoPage: new StepTwoPage(page),
            stepThreePage: new StepThreePage(page),
            reviewThirtyDayPage: new ReviewThirtyDayPage(page),
            welcomePage: new WelcomePage(page),
            thirtyDayActivationPage: new ThirtyDayActivationPage(page),
        };

        this.aspca = {
            petInfoPage: new AspcaPetInfoPage(page),
            coveragePage: new AspcaCoveragePage(page),
            checkoutPage: new AspcaCheckoutPage(page),
            successPage: new AspcaSuccessPage(page),
            totalBar: new AspcaTotalBar(page),
        };
    }

    /**
     * Create a new manager for a different page (e.g., new tab)
     * @param newPage - The new page instance
     * @returns New QuotePageManager instance
     */
    forPage(newPage: Page): QuotePageManager {
        return new QuotePageManager(newPage);
    }
}