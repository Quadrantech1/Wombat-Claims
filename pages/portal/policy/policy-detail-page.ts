import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { TabsPolicyDetailSection } from '@pages/orca/policy/tabs-policy-detail-section';
import { extractFirstAmount } from '@utils/amounts-util';
import { logger } from '@utils/logger-util';
import { BasePage } from '../../base-page';

export class PolicyDetailPage extends BasePage {
    // Labels
    policyDetailLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Policy Details' }));
    coverageLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Coverage' }));
    claimsLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Claims', exact: true }));
    activeLabel = new Label(this.page, this.page.getByText('StatusActive'));
    costLabel = new Label(this.page, this.page.getByText('Cost'));
    petNameLabel = new Label(this.page, this.page.getByText('Pet Name'));
    premiumLabel = new Label(this.page, this.page.getByText('Premium', { exact: true }));
    productLabel = new Label(this.page, this.page.getByText('Products'));
    policyStatus = new Label(this.page, '//*[contains(text(),"Status")]/parent::*');
    downloadAttachmentLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Download your attachments' }));
    portalStatusBox = new Label(this.page, "//div[div[@class='header__container']]");
    spinnerBallLabel = new Label(this.page, ".la-ball-spin");
    premiumYearlyAmountLabel = new Label(this.page, "//div[@class='card__item --premium --full pad-bot--1']//div[@class='card__value'][contains(., '/yr')]");
    premiumMonthlyAmountLabel = new Label(this.page, "//div[@class='card__item --premium --full pad-bot--1']//p[@class='card__value'][contains(., '/mo')]");

    // Links
    viewPolicyDocumentsLink = new Link(this.page, "//button[contains(@title,'View policy documents')]");
    showCoverageSummaryLink = new Link(this.page, "//span[contains(text(),'Show Coverage Summary')]");
    viewPolicyDetailLink = new Link(this.page, "//button[contains(@title,'View policy documents')]");

    // Buttons
    closeDialogButton = new Button(this.page, "//div[@class=\"modal__close\"]");
    addPetButton = new Button(this.page, "//button[contains(.,'Add Pet')]");
    blockedAddPetButton = new Button(this.page, "//a[contains(text(),'Add Pet') and contains(@class,'not-allowed')]");
    changeCoverageOptions = new Button(this.page, "//a[contains(text(),'Change Coverage Options')]");
    changeFirstCoverageOptionsButton = new Button(this.page, this.page.getByText('Change Coverage Options').first());
    blockedChangeCoverageButton = new Button(this.page, "//a[contains(text(),'Change Coverage Options') and contains(@class,'not-allowed')]");
    popupContinueButton = new Button(this.page, "//button[@class='button__submit']");
    openCalendarButton = new Button(this.page, this.page.getByRole('button', { name: 'Open calendar' }));

    // tab sections
    tabsPolicyDetailSection = new TabsPolicyDetailSection(this.page);

    /**
     * Get continue button for a specific policy
     * @param policyId - The policy ID to get the continue button for
     * @returns Button for the specified policy
     */
    getContinueButtonForPolicy(policyId: string): Button {
        logger.info(`[PolicyDetailPage.getContinueButtonForPolicy] Getting continue button for policy: ${policyId}`);
        const locator = `//div[contains(text(),'${policyId}')]/../../..//a[contains(.,'Continue')]`;
        return new Button(this.page, locator);
    }

    /**
     * Get document label
     * @param documentName - The name of the document to get the label for
     * @returns Label for the specified document
     */
    getDocumentLabel(documentName: string): Label {
        logger.info(`[PolicyDetailPage.getDocumentLabel] Getting document label: ${documentName}`);
        return new Label(this.page, `//pp-attachment-list//div[contains(text(),'${documentName}')]`);
    }

    /**
     * Get policy number label
     * @param policyNumber - The policy number to get the label for  
     * @returns Label for the specified policy number
     */
    getPolicyNumberLabel(policyNumber: string): Label {
        logger.info(`[PolicyDetailPage.getPolicyNumberLabel] Getting policy number label: ${policyNumber}`);
        return new Label(this.page, `//p[text()='${policyNumber}']`);
    }

    /**
     * Gets the yearly premium amount from the portal (e.g., "$1,352.90")
     * Parses text like " $1,352.90/yr" and returns "$1,352.90"
     * @returns The yearly premium amount as a string
     */
    async getYearlyPremiumAmount(): Promise<string> {
        logger.info(`[PolicyDetailPage.getYearlyPremiumAmount] - Getting yearly premium amount`);
        const rawText = (await this.premiumYearlyAmountLabel.getText()).trim();
        return extractFirstAmount(rawText);
    }

    /**
     * Gets the monthly premium amount from the portal (e.g., "$115.74")
     * Parses text like " $115.74/mo" and returns "$115.74"
     * @returns The monthly premium amount as a string
     */
    async getMonthlyPremiumAmount(): Promise<string> {
        logger.info(`[PolicyDetailPage.getMonthlyPremiumAmount] - Getting monthly premium amount`);
        const rawText = (await this.premiumMonthlyAmountLabel.getText()).trim();
        return extractFirstAmount(rawText);
    }
    
    /**
     * click on the Add Pet button for a specific pet index
     * @param index - The index of the pet to add (1-based)
     */
    async clickAddPetButtonByIndex(index: number): Promise<void> {
        logger.info(`[PolicyDetailPage.clickAddPetButtonByIndex] Clicking on the Add Pet button at index ${index}`);
        await this.addPetButton.getLocator().nth(index - 1).click();
    }

    /**
     * Select a future date in the calendar
     * @param days - Number of days in the future to select
     */
    async selectFutureDate(days: number): Promise<void> {
        logger.info(`[PolicyDetailPage.selectFutureDate] Selecting date ${days} days in the future`);

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        const monthName = futureDate.toLocaleString('en-US', { month: 'long' });
        const day = futureDate.getDate();
        const dateButtonName = `${monthName} ${day},`;

        logger.info(`[PolicyDetailPage.selectFutureDate] Opening calendar and selecting: ${dateButtonName}`);
        await this.openCalendarButton.click();

        const dateButton = new Button(this.page, this.page.getByRole('button', { name: dateButtonName }));
        await dateButton.click();
    }

}
