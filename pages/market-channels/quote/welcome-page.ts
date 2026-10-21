import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class WelcomePage extends BasePage {
    // Labels
    welcomeToLabel = new Label(this.page, "//h1[contains(text(),'Welcome') or contains(text(),'Bienvenue')]");
    policyNumberLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Policy Number:' }));

    // Buttons
    appStorePetCloudButton = new Button(this.page, this.page.getByRole('link', { name: 'AppStore (opens new tab)' }));
    playStorePetCloudButton = new Button(this.page, this.page.getByRole('link', { name: 'PlayStore (opens new tab)' }));
    enterYourPortalButton = new Button(this.page, this.page.getByRole('button', { name: ' Enter Your Portal ' }));

 


    /**
     * Gets the policy number from the policy number label
     * @returns Promise that resolves to the policy number as a string
     */
    async getPolicyNumber(): Promise<string> {
        logger.info('[WelcomePage.getPolicyNumber] - Getting policy number from confirmation page');
        await this.policyNumberLabel.waitForVisible();
        const policyText = await this.policyNumberLabel.getText();
        const match = policyText.match(/(\d+)/);
        if (!match) {
            throw new Error(`[WelcomePage.getPolicyNumber] - Could not extract policy number from label: ${policyText}`);
        }
        return match[1];
    }

    async checkLabelisDisplayed(label: string): Promise<Boolean> {
        logger.info(`[WelcomePage.checkLabelisDisplayed] - Checking if label is displayed: ${label}`);
        let labelControl = new Label(this.page, this.page.getByText(label, { exact: false }));
        return await labelControl.isDisplayed();
    }
}