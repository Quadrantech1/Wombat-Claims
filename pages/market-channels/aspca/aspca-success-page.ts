import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class AspcaSuccessPage extends BasePage {

    // Confirmation content
    successHeading = new Label(this.page, this.page.getByRole('heading', { name: 'Success!' }));
    enrollmentConfirmationLabel = new Label(this.page, this.page.getByText(/is officially enrolled!/));
    policyNumberLabel = new Label(this.page, this.page.locator('p').filter({ hasText: 'Policy Number:' }));
    amazonGiftCardLabel = new Label(
        this.page,
        this.page.getByText(/we'll send your \$25 Amazon Gift Card/)
    );
    telehealthLabel = new Label(
        this.page,
        this.page.getByText(/24\/7 telehealth/)
    );

    // Member Centre section
    enterMemberCenterButton = new Button(
        this.page,
        this.page.getByRole('button', { name: 'Enter the Member Center' })
    );
    googlePlayButton = new Button(this.page, this.page.getByRole('button', { name: 'Playstore Logo' }));
    appleAppStoreButton = new Button(this.page, this.page.getByRole('button', { name: /App Store/ }));

    // Header
    callSupportLink = new Link(this.page, this.page.getByRole('link', { name: 'Call support at 1-888-716-' }));

    /**
     * Extracts and returns the policy number from the confirmation paragraph.
     * The text is expected to contain "Policy Number: XXXXXXXX".
     * @returns The policy number string (e.g. 'A8078290')
     */
    async getPolicyNumber(): Promise<string> {
        logger.info('[AspcaSuccessPage.getPolicyNumber] - Getting policy number from confirmation page');
        await this.policyNumberLabel.waitForVisible();
        // Policy number is populated asynchronously after the label appears — retry until it has a value
        await expect(this.policyNumberLabel.getLocator()).not.toHaveText(/Policy Number:\s*$/, { timeout: timeouts.short });
        const text = await this.policyNumberLabel.getLocator().textContent() ?? '';
        const match = text.match(/Policy Number:\s*([A-Z0-9\-]+)/i);
        if (!match) {
            throw new Error(`[AspcaSuccessPage.getPolicyNumber] - Could not extract policy number from: "${text}"`);
        }
        return match[1];
    }

    /**
     * Waits for the confirmation page to fully load (until Policy Number is visible).
     */
    async waitForConfirmation(): Promise<void> {
        logger.info('[AspcaSuccessPage.waitForConfirmation] - Waiting for confirmation page to load');
        await expect(this.successHeading.getLocator()).toBeVisible();
        await expect(this.policyNumberLabel.getLocator()).toBeVisible();
        logger.info('[AspcaSuccessPage.waitForConfirmation] - Confirmation page loaded');
    }
}

