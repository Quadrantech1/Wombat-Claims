import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { logger } from '@utils/logger-util';
import { BasePage } from '../base-page';

export class MainPortalPage extends BasePage {
    // Labels
    welcomeLabel = new Label(this.page, "//h4[contains(.,'Welcome to your Customer Portal!')]");
    policyDetailsLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Policy Details' }));
    customerPortalGoingAway = new Label(this.page, this.page.getByRole('heading', { name: 'This Customer Portal is going' }));

    // Links
    submitClaimLink = new Link(this.page, "//a[contains(.,'Submit Claim')]");

    // Buttons
    petGeniusRx = new Button(this.page, "//main//*[./div[contains(text(),'PetGenius Rx')]]");
    petGeniusLink = new Button(this.page, "//p[contains(text(),'Save Money on your pet medications')]");
    signOutButton = new Button(this.page, "//main//div[text()='Sign Out']");
    homeButton = new Button(this.page, "//*[@id=\"dashboard-nav\"]//div[contains(text(),\"Home\")]");
    backToHomeButton = new Button(this.page, "//button[contains(text(),'Back to home')]");
    homeMenu = new Button(this.page, "//div[@id='dashboard-nav']//div[@class='navigation__label'][normalize-space()='Home']");
    showCoverageSummaryButton = new Button(this.page, this.page.getByText('+ Show Coverage Summary'));

    // Menu navigation buttons
    claimsMenuButton = new Button(this.page, "//div[@id='dashboard-nav']//div[@class='navigation__label'][normalize-space()='Claims']");
    userAccountMenuButton = new Button(this.page, "//div[@id='dashboard-nav']//div[@class='navigation__label'][normalize-space()='User Account']");
    signOutMenuButton = new Button(this.page, "//div[@id='dashboard-nav']//div[@class='navigation__label'][normalize-space()='Sign Out']");

    /**
     * Gets a Label control for the specified policy number.
     * @param policyNumber - The policy number to locate
     * @returns Label control for the policy number element
     */
    async getPolicyNumberLabel(policyNumber: string): Promise<Label> {
        logger.info(`[MainPortalPage.getPolicyNumberLabel] Getting policy number label for: ${policyNumber}`);
        return new Label(this.page, `//p[contains(text(),"${policyNumber}")]`);
    }
}
