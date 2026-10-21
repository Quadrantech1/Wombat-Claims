import { Button } from '@controls/button';
import { QuotePageManager } from '@pages/page-managers/quote-page-manager';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';

/**
 * Activates the 30-day-only offer on the generic (AKC/PPI) quote flow — used by McLead 30-day registrations.
 * Links the McLead registration via the 'Is your pet registered' modal (the McLead Get Quote link itself still
 * serves the legacy quote tool in this environment, not the new one).
 * Spans stepOnePage -> thirtyDayActivationPage -> reviewThirtyDayPage -> stepThreePage -> welcomePage.
 * @param quote - QuotePageManager instance for the tab the quote flow is running on
 * @param registrationNo - The McLead registration number to look up
 * @param postalCode - The postal code used on the McLead registration
 * @returns The resulting policy number and the welcome page's portal entry button
 */
export async function activateMclead30DayOffer(
    quote: QuotePageManager,
    registrationNo: string,
    postalCode: string
): Promise<{ policyNumber: string; portalButton: Button }> {
    logger.info(`[activate-mclead-30-day-offer-helper.activateMclead30DayOffer] - Activating 30-day offer for registration ${registrationNo}`);
    await quote.main.stepOnePage.isYourPetRegisteredButton.click();
    await quote.main.stepOnePage.akcRegistrationModal.fillRegistrationForm(registrationNo, postalCode);
    await quote.main.stepOnePage.termsCheckbox.check();
    await quote.main.stepOnePage.chooseCoverageButton.click();
    await expect(quote.main.thirtyDayActivationPage.activate30DayOnlyRadioButton.getLocator()).toBeVisible();
    await quote.main.thirtyDayActivationPage.selectActivate30DayOnly();
    await expect(quote.main.reviewThirtyDayPage.review30DayCoverageLabel.getLocator()).toBeVisible();
    await quote.main.reviewThirtyDayPage.continueButton.clickAndWait('load');
    await quote.main.reviewThirtyDayPage.continueButton.waitWhileControlDisappears();
    await expect(quote.main.stepThreePage.enrollNowButton.getLocator()).toBeEnabled();
    await expect(quote.main.stepThreePage.todayTotalAmountLabel.getLocator()).toHaveText('$0.00');
    await quote.main.stepThreePage.applicationAcknowledgementsCheckbox.check();
    await quote.main.stepThreePage.paperlessReceivePolicyCheckbox.check();
    await quote.main.stepThreePage.enrollNowButton.clickAndWait();
    await quote.main.stepThreePage.enrollNowButton.waitWhileControlDisappears();
    const policyNumber = await quote.main.welcomePage.getPolicyNumber();
    logger.info(`[activate-mclead-30-day-offer-helper.activateMclead30DayOffer] - Activated with policy number: ${policyNumber}`);
    return { policyNumber, portalButton: quote.main.welcomePage.enterYourPortalButton };
}
