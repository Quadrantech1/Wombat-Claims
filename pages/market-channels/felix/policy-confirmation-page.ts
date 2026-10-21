import { BasePage } from '@pages/base-page';
import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { logger } from '@utils/logger-util';

export class PolicyConfirmationPage extends BasePage {
    // Labels
    welcomeToFelixFamilyLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Welcome to the Felix Family!' }));
    policyNumberLabel = new Label(this.page, "h2.policy_pet_number");

    // Buttons
    enterYourPortalButton = new Button(this.page, this.page.getByRole('link', { name: 'customer_portal_btn' }));

    /**
     * Gets the policy number from the policy number label
     * @returns Promise that resolves to the policy number as a string
     */
    async getPolicyNumber(): Promise<string> {
        logger.info('[PolicyConfirmationPage.getPolicyNumber] Getting policy number from confirmation page');
        await this.policyNumberLabel.waitForVisible();
        const policyText = await this.policyNumberLabel.getText();
        const match = policyText.match(/(\d+)/);
        if (!match) {
            throw new Error(`[PolicyConfirmationPage.getPolicyNumber] - Could not extract policy number from label: ${policyText}`);
        }
        return match[1];
    }
}
