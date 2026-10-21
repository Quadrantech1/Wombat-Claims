import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class CongratulationsEnrollmentPage extends BasePage {
    // Labels
    congratulationsLabel = new Label(this.page, "h1:text('Congratulations on your enrollment!')");
    messageCongratulationLabel = new Label(this.page, "h1.h2.mt--1.header--primary");
    policyNumberLabel = new Label(this.page, "h2:has-text('Policy')");
    portalLoginLabel = new Label(this.page, "span:has-text('Portal Login')");
    monthlyTotalLabel = new Label(this.page, "div.pet-overview__premium-price");
    petNameLabel = new Label(this.page, "div.pet-overview__name div");
    petBreedLabel = new Label(this.page, "div.pet-overview__details div:not([class])");
    petCoverageDetailsLabel = new Label(this.page, "div.fw--600");
    policyTermLabel = new Label(this.page, "datetime");
    deductibleLabel = new Label(this.page, "li:has-text('Deductible:') span");
    coinsuranceLabel = new Label(this.page, "li:has-text('Coinsurance:') span");
    incidentLabel = new Label(this.page, "li:has-text('Incident:') span");
    annualLabel = new Label(this.page, "li:has-text('Annual:') span");
    petOverviewPriceLabel = new Label(this.page, "div.pet-overview__price.c--primary");
    linkAKCSmartCollarLabel = new Label(this.page, "//*[contains(text(),'Link AKC Smart Collar Selection')]");

    // Buttons
    closeButton = new Button(this.page, "#sa_close");
    portalLoginButton = new Button(this.page, "span:has-text('Portal Login')");

    /**
     * Gets the pet overview price for a specific pet by name
     * @param petName - The name of the pet to get price for
     * @returns Promise that resolves to the price text
     */
    async getPetOverviewPriceByName(petName: string): Promise<string> {
        logger.info(`[CongratulationsEnrollmentPage.getPetOverviewPriceByName] Getting pet overview price for pet: ${petName}`);
        const selector = `//div[text()="${petName}"]/ancestor::div[contains(@class,'pet-overview')]//div[contains(@class,'pet-overview__price')]`;
        const priceLabel = new Label(this.page, selector);
        return await priceLabel.getText();
    }

    /**
    * Gets the policy number from the policy number label
    * Removes the 'Policy' text prefix and trims whitespace
    * @returns Promise that resolves to the policy number as a string
    */
    async getPolicyNumber(): Promise<string> {
        return (await this.policyNumberLabel.getText()).replace('Policy', '').trim();
    }
}
