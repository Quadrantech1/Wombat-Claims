import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { RadioButton } from '@controls/radio-button';
import { FelixCoverageData, FelixUpgradeData, getDefaultFelixCoverageData, getDefaultFelixUpgradeData } from '@data/felix/felix-coverage-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class CustomizePlanPage extends BasePage {
    // Plan Details
    editCatDetailsButton = new Button(this.page, this.page.getByRole('button', { name: 'Edit Cat' }));
    customPlanButton = new Button(this.page, this.page.getByText('CUSTOM PLAN', { exact: true }));
    basicPlanButton = new Button(this.page, this.page.getByText('BASIC PLAN'));
    basePriceLabel = new Label(this.page, 'span.base_price');

    // Edit Cat pop up
    yesLeaveButton = new Button(this.page, this.page.getByRole('button', { name: 'Yes, Leave' }));
    noStayButton = new Button(this.page, this.page.getByRole('button', { name: 'No, stay' }));

    // Basic Plan Labels
    annualCoverageLabel = new Label(this.page, 'dt:has-text("Annual Coverage") + dd');
    annualDeductibleLabel = new Label(this.page, 'dt:has-text("Annual Deductible") + dd');
    reimbursementLabel = new Label(this.page, 'dt:has-text("Reimbursement") + dd');
    incidentLimitLabel = new Label(this.page, 'dt:has-text("Incident Limit") + dd');

    // What Felix covers buttons
    emergenciesButton = new Button(this.page, this.page.getByRole('button', { name: 'Emergencies' }));
    illnessesButton = new Button(this.page, this.page.getByRole('button', { name: 'Illnesses' }));
    prescriptionsButton = new Button(this.page, this.page.getByRole('button', { name: 'Prescriptions' }));
    surgeriesButton = new Button(this.page, this.page.getByRole('button', { name: 'Surgeries' }));
    diagnosticTestsButton = new Button(this.page, this.page.getByRole('button', { name: 'Diagnostic Tests' }));
    alternativeAndHolisticButton = new Button(this.page, this.page.getByRole('button', { name: 'Alternative & Holistic' }));
    cancerCoverageButton = new Button(this.page, this.page.getByRole('button', { name: 'Cancer Coverage' }));

    coverageAndWaitingPeriodsLink = new Link(this.page, this.page.getByRole('link', { name: 'SEE FULL COVERAGE AND WAITING' }));

    // Coverage options
    welnessBasicCovRadioButton = new RadioButton(this.page, '//input[contains(@id,"Wellness - Basic")]');
    welnessPrimeCovRadioButton = new RadioButton(this.page, '//input[contains(@id,"Wellness - Prime")]');

    noWellnessCovRadioButton = new RadioButton(this.page, "//*[contains(@id,'No, I don')]");

    examCareCovRadioButton = new RadioButton(this.page, this.page.getByRole('radio', { name: 'Yes, add "Exam Care Coverage"' }).or(this.page.getByRole('radio', { name: 'Yes, add "Exam Care"' })));
    noExamCareCovRadioButton = new RadioButton(this.page, "//*[text()='Exam  Care  Coverage' or text()='Exam  Care']//parent::div//input[@type='radio' and contains(@id,'noCoverage')]");

    inheritedAndCongenitalCareCovRadioButton = new RadioButton(this.page, this.page.getByRole('radio', { name: 'Yes, add "Inherited' }));
    noInheritedAndCongenitalCareCovRadioButton = new RadioButton(this.page, "//*[text()='Inherited &  Congenital  Care  Coverage' or text()='Inherited &  Congenital  Care']//parent::div//input[@type='radio' and contains(@id,'noCoverage')]");

    breedingCovRadioButton = new RadioButton(this.page, this.page.getByRole('radio', { name: 'Yes, add "Breeding Coverage"' }));
    noBreedingCovRadioButton = new RadioButton(this.page, "//*[text()='Breeding  Coverage' or text()='Breeding Coverage']//parent::*//input[@type='radio' and contains(@id,'noCoverage')]");

    finalRespectsCareCovRadioButton = new RadioButton(this.page, this.page.getByRole('radio', { name: 'Yes, add "Final Respects Care' }));
    noFinalRespectsCareCovRadioButton = new RadioButton(this.page, "//*[text()='Final  Respects  Care  Coverage' or text()='Final  Respects  Care']//parent::*//*[@type='radio' and contains(@id,'noCoverage')]");

    addAnotherCatButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Another Cat' }));
    checkoutButton = new Button(this.page, this.page.getByRole('button', { name: 'Checkout →' }));

    /**
     * Selects a plan option by its value (e.g., '$2,500', '$500', '90%')
     * @param value - The exact text value to select
     */
    async selectPlanOptionByValue(value: string): Promise<void> {
        logger.info(`[CustomizePlanPage.selectPlanOptionByValue] Selecting plan option by value: ${value}`);
        const optionButton = new Button(this.page, this.page.getByText(value, { exact: true }));
        await optionButton.click();
        try {
            await expect(optionButton.getLocator()).toHaveClass(/active_option_selected/, { timeout: timeouts.veryShort });
        } catch {
            logger.warning(`[CustomizePlanPage.selectPlanOptionByValue] Option not selected, trying again ${value}`);
            await optionButton.click();
            await expect(optionButton.getLocator()).toHaveClass(/active_option_selected/, { timeout: timeouts.veryShort });
        }
    }

    /**
     * Selects multiple plan options at once
     * @param options - Object with optional plan values
     * @param options.annualCoverage - Annual coverage amount (default from defaults)
     * @param options.annualDeductible - Annual deductible amount (default from defaults) 
     * @param options.reimbursement - Reimbursement percentage (default from defaults)
     */
    async selectPlanOptions(options?: Partial<FelixCoverageData>): Promise<void> {
        logger.info('[CustomizePlanPage.selectPlanOptions] Selecting multiple plan options');
        const defaultData = getDefaultFelixCoverageData();
        const formData = { ...defaultData, ...options };
        await this.basePriceLabel.waitForVisible(timeouts.default);
        await this.page.waitForTimeout(timeouts.polling);
        await this.selectPlanOptionByValue(formData.annualCoverage!);
        await this.selectPlanOptionByValue(formData.annualDeductible!);
        await this.selectPlanOptionByValue(formData.reimbursement!);
        logger.info('[CustomizePlanPage.selectPlanOptions] Plan options selected successfully');
    }

    /**
     * Selects upgrade coverage options
     * @param upgradeData - Object with upgrade option flags
     */
    async selectUpgradeOptions(upgradeData?: Partial<FelixUpgradeData>): Promise<void> {
        logger.info('[CustomizePlanPage.selectUpgradeOptions] Selecting upgrade coverage options');
        const defaultData = getDefaultFelixUpgradeData();
        const formData = { ...defaultData, ...upgradeData };

        await this.handleWellnessCoverage(formData.wellnessCoverage);
        await this.handleCoverageOption(formData.examCareCoverage, this.examCareCovRadioButton, this.noExamCareCovRadioButton);
        await this.handleCoverageOption(formData.inheritedAndCongenitalCareCoverage, this.inheritedAndCongenitalCareCovRadioButton, this.noInheritedAndCongenitalCareCovRadioButton);
        await this.handleCoverageOption(formData.breedingCoverage, this.breedingCovRadioButton, this.noBreedingCovRadioButton);
        await this.handleCoverageOption(formData.finalRespectsCoverage, this.finalRespectsCareCovRadioButton, this.noFinalRespectsCareCovRadioButton);
        logger.info('[CustomizePlanPage.selectUpgradeOptions] Upgrade coverage options selected successfully');
    }

    /**
     * Handles wellness coverage selection (basic, prime, or none)
     * @param wellnessType - The type of wellness coverage to select
     */
    private async handleWellnessCoverage(wellnessType?: 'basic' | 'prime' | 'none'): Promise<void> {
        logger.info(`[CustomizePlanPage.handleWellnessCoverage] Handling wellness coverage: ${wellnessType}`);
        switch (wellnessType) {
            case 'basic':
                await this.welnessBasicCovRadioButton.checkMobile();
                break;
            case 'prime':
                await this.welnessPrimeCovRadioButton.checkMobile();
                break;
            case 'none':
                await this.noWellnessCovRadioButton.checkMobile();
                break;
            default:
                await this.noWellnessCovRadioButton.checkMobile();
                break;
        }
    }

    /**
     * Helper method to handle boolean coverage options
     * @param shouldSelect - Whether to select the coverage
     * @param yesElement - The "yes" radio button element
     * @param noElement - The "no" radio button element
     */
    private async handleCoverageOption(
        shouldSelect: boolean | undefined | null,
        yesElement: RadioButton,
        noElement: RadioButton
    ): Promise<void> {
        logger.info(`[CustomizePlanPage.handleCoverageOption] Handling coverage option, shouldSelect: ${shouldSelect}`);
        if (typeof shouldSelect === 'undefined' || shouldSelect === null) {
            return;
        }
        if (shouldSelect) {
            await yesElement.checkMobile();
        } else {
            await noElement.checkMobile();
        }
    }

    /**
     * Returns the Label control for the pet name (heading)
     * @param petName - The pet name to match
     */
    getPetNameLabel(petName: string): Label {
        logger.info(`[CustomizePlanPage.getPetNameLabel] Getting pet name label for: ${petName}`);
        return new Label(this.page, this.page.getByRole('heading', { name: petName, exact: true }));
    }

    /**
     * Returns the Label control for the gender, age, or breed
     * @param value - The value to match (e.g., 'Female', 'Abyssinian')
     */
    getPetInfoLabel(value: string): Label {
        logger.info(`[CustomizePlanPage.getPetInfoLabel] Getting pet info label for value: ${value}`);
        return new Label(this.page, this.page.getByText(value));
    }

    /**
     * Returns the Label control for the base plan heading.
     * @param planType - The plan type to match ('Accident Only' or 'Accident & Illness')
     */
    getBasePlanLabel(planType: 'Accident Only' | 'Accident & Illness'): Label {
        logger.info(`[CustomizePlanPage.getBasePlanLabel] Getting base plan label for type: ${planType}`);
        return new Label(this.page, this.page.getByRole('heading', { name: `base plan ${planType}`, exact: true }));
    }

    /**
     * Returns the Label control for the pet age (e.g., '4 yrs')
     * @param age - The age value to match (number or string)
     */
    getPetAgeLabel(age: string | number): Label {
        logger.info(`[CustomizePlanPage.getPetAgeLabel] Getting pet age label for age: ${age}`);
        return new Label(this.page, this.page.getByText(`${age} yrs`));
    }
}
