import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { CoverageData, getDefaultCoverageData, getDefaultUpgradeData, UpgradeData } from '@data/quote-tool/coverage-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class CoveragePage extends BasePage {
    // Labels
    customizeYourPlanLabel = new Label(this.page, "h2:text('Customize Your Plan')");
    descriptionLabel = new Label(this.page, "div.margin-top--1:text-matches('This option has preset limits')");
    messageDialog = new Label(this.page, "//div[@id='save-quote-success-modal']//p");
    priceMonthLabel = new Label(this.page, "//div[contains(@class,'pet-overview__premium-price')]/span");

    // Buttons
    activateInitial30Day = new Button(this.page, "#activate-30-day");
    activateCertAndContinue = new Button(this.page, "#activate-enroll");
    activateAnnualPlan = new Button(this.page, "#enroll-in-annual-plan");
    addToCartButton = new Button(this.page, "span:text('Add to Cart')");
    emailQuoteButton = new Button(this.page, "#email-quote-modal-button");
    submitButton = new Button(this.page, "span:text('Submit')");
    closeButton = new Button(this.page, "div.modal.modal-small button:text('Close')");
    editPetButton = new Button(this.page, "button[title='Return to previous Step']");
    planToggleButton = new Button(this.page, "label.toggle__label");

    // Select Controls
    deductibleSelect = new Select(this.page, "#deductible-amount");
    coinsuranceSelect = new Select(this.page, "#coinsurance-amount");
    annualLimitSelect = new Select(this.page, "#annual-level");
    incidentLimitSelect = new Select(this.page, "#incident-level");

    // Radio Buttons
    examPlusRadioButton = new RadioButton(this.page, "input#NP_EXAM");
    breedingCoverageRadioButton = new RadioButton(this.page, "input#BREEDER");
    supportPlusRadioButton = new RadioButton(this.page, "input#FINAL_RESPECTS");
    defenderPlusRadioButton = new RadioButton(this.page, "input#Wellness2");
    defenderRadioButton = new RadioButton(this.page, "input#Wellness1");
    hereditaryPlusRadioButton = new RadioButton(this.page, "input#NP_INHERITED");

    /**
     * Returns a locator for pet age label containing the specified age
     * @param age - The pet age to search for
     * @returns Locator for the pet age label
     */
    getPetAgeLabel(age: string): Label {
        logger.info(`[CoveragePage.getPetAgeLabel] Getting pet age label for age: ${age}`);
        const selector = `//div[@class="pet-overview__details"]/div[contains(text(),"${age}")]`;
        return new Label(this.page, selector);
    }

    /**
     * Returns a locator for breed label containing the specified breed
     * @param breed - The pet breed to search for
     * @returns Locator for the breed label
     */
    getBreedLabel(breed: string): Label {
        logger.info(`[CoveragePage.getBreedLabel] Getting breed label for breed: ${breed}`);
        const selector = `//div[@class="pet-overview__details"]/div[contains(text(),"${breed}")]`;
        return new Label(this.page, selector);
    }

    /**
     * Selects limits with default data merged with any provided overrides
     * @param coverageData - Optional partial data to override defaults
     * @returns Promise that resolves when coverage options are filled
     */
    async selectLimits(coverageData?: Partial<CoverageData>): Promise<void> {
        const formData = { ...getDefaultCoverageData(), ...coverageData };
        logger.info(`[CoveragePage.selectLimits] Selecting limits`);
        await this.selectPlanType(formData.coverageType);
        if (formData.coverageType?.toLowerCase() === 'custom') {
            await this.deductibleSelect.selectValue(formData.deductible!);
            await this.coinsuranceSelect.selectValue(formData.coinsurance!);
            await this.annualLimitSelect.selectValue(formData.annualLimit!);
        }
        logger.info(`[CoveragePage.selectLimits] Selected coverage limits`);
    }

    /**
     * Selects upgrade options based on boolean values
     * @param upgradeData - Optional partial data to override defaults
     * @returns Promise that resolves when specified upgrades are selected
     */
    async selectUpgrades(upgradeData?: Partial<UpgradeData>): Promise<void> {
        logger.info('[CoveragePage.selectUpgrades] Selecting upgrades');
        const upgrades = { ...getDefaultUpgradeData(), ...upgradeData };

        const upgradeMap = {
            ExamPlus: this.examPlusRadioButton,
            BreedingCoverage: this.breedingCoverageRadioButton,
            SupportPlus: this.supportPlusRadioButton,
            DefenderPlus: this.defenderPlusRadioButton,
            Defender: this.defenderRadioButton,
            HereditaryPlus: this.hereditaryPlusRadioButton
        };

        for (const [upgradeName, shouldClick] of Object.entries(upgrades)) {
            if (shouldClick === true) {
                const radioButton = upgradeMap[upgradeName as keyof typeof upgradeMap];
                await radioButton?.click();
            }
        }
        logger.info('[CoveragePage.selectUpgrades] Upgrade options selected successfully');
    }

    /**
     * Selects the plan type (basic or custom) based on the option provided
     * @param option - The plan type to select ('basic' or 'custom')
     * @returns Promise that resolves when plan type is selected
     */
    async selectPlanType(option?: string): Promise<void> {
        logger.info(`[CoveragePage.selectPlanType] Selecting plan type: ${option}`);
        const isDescriptionVisible = await this.descriptionLabel.isDisplayed();
        const shouldToggle =
            (isDescriptionVisible && option?.toLowerCase() === 'custom') ||
            (!isDescriptionVisible && option?.toLowerCase() === 'basic');

        if (shouldToggle) {
            await this.planToggleButton.click();
        }
    }
}
