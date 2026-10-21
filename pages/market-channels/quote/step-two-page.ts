import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { CustomPlanData, getDefaultCustomPlanData, getDefaultUpgradeData, UpgradeData } from '@data/quote/step-two-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class StepTwoPage extends BasePage {
    // Plan Details
    editPetButton = new Button(this.page, this.page.getByRole('button', { name: /Edit Pet|Modifier/i, exact: false }));
    editPetDetailsButton = new Button(this.page, this.page.getByRole('button', { name: 'Edit Pet Details' }));
    yesLeaveButton = new Button(this.page, this.page.getByRole('button', { name: 'Yes, Leave' }));
    noStayButton = new Button(this.page, this.page.getByRole('button', { name: 'No, Stay' }));

    accidentAndIllnessButton = new Button(this.page, this.page.getByLabel('base plan mode selector').getByText('Accident & Illness'));
    accidentButton = new Button(this.page, this.page.getByText('Accident', { exact: true }));
    basicPlanHeading = new Label(this.page, this.page.getByRole('heading', { name: 'Basic Plan', exact: true }));
    customPlanHeading = new Label(this.page, this.page.getByRole('heading', { name: 'Custom Plan', exact: true }));
    accidentOnlyHeading = new Label(this.page, this.page.getByRole('heading', { name: 'AccidentCare' }));
    accidentOnlyLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Accident Only Plan' }));
    accidentIllnessHeading = new Label(this.page, this.page.getByRole('heading', { name: 'Accident & Illness Plan' }));
    basePriceLabel = new Label(this.page, 'span.base_price');
    groupDiscountLabel = new Label(this.page, this.page.getByText('% Group Discount'));
    multiPetDiscountLabel = new Label(this.page, this.page.getByText('5% Multi-Pet Discount', { exact: true }));
    accidentAndIllnessCustomPlanLabel = new Label(this.page, 'label[for="custom-plan-button"]');
    accidentAndIllnessBasicPlanLabel = new Label(this.page, 'label[for="basic-plan-button"]');
    accidentOnlyPlanLabel = new Label(this.page, 'label[for="AccidentOnly-plan-button"]');
    accidentAndIllnessLabel = new Label(this.page, 'label[for="Accident_Illness-plan-button"]');
    filterByLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Filter By' }));

    // Accident Only plan limit values
    annualCoverageValueLabel = new Label(this.page, '//h4[@id="annualcoverage"]/../../p[contains(@class, "plan_body_limits_")]');
    annualDeductibleValueLabel = new Label(this.page, '//h4[@id="deductible"]/../../p[contains(@class, "plan_body_limits_")]');
    reimbursementValueLabel = new Label(this.page, '//h4[@id="reimbursement"]/../../p[contains(@class, "plan_body_limits_")]');
    incidentValueLabel = new Label(this.page, '//h4[@id="incidentLimit"]/../../p[contains(@class, "plan_body_limits_")]');


    // Add Available Upgrades
    addRoutineButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Routine' }));
    addAdvancedButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Advanced' }));


    customButton = new Button(this.page, '//input[@id="custom-plan-button"]/../label');
    basicButton = new Button(this.page, '//input[@id="basic-plan-button"]/../label');

    annualCoverageSelect = new Select(this.page, "#coverageLimit");
    annualDeductibleSelect = new Select(this.page, "#deductibleLimit");
    reimbursementSelect = new Select(this.page, "#reimbursementLimit");
    filterBySelect = new Select(this.page, "#filterOptionsLimit");


    //prop103 - coverage limits and upgrades

    annualCoverageLimitSelectedLabel = new Label(this.page, '//ul[@aria-labelledby="annualcoverage"]//img/..');
    annualDeductibleLimitSelectedLabel = new Label(this.page, '//ul[@aria-labelledby="deductible"]//img/..');
    reimbursementLimitSelectedLabel = new Label(this.page, '//ul[@aria-labelledby="reimbursement"]//img/..');
    basicCoverageUpgradeHeading = new Label(this.page, this.page.getByRole('heading', { name: 'Basic', exact: true }));
    primeCoverageUpgradeHeading = new Label(this.page, this.page.getByRole('heading', { name: 'Prime', exact: true }));
    addBasicButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Basic' }));
    addPrimeButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Prime' }));


    // add availables upgrades
    wellnessLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Wellness' }));
    yesWellnessDefenderButton = new Button(this.page, "//input[contains(@id,'Defender') and not(contains(@id,'Plus'))]");
    yesWellnessDefenderPlusButton = new Button(this.page, "//input[contains(@id,'DefenderPlus')]");
    noWellnessAddIncoverageButton = new Button(this.page, "//label[@aria-describedby='wellness_required']/..//input[contains(@id,'No')]");

    examPlusCoverageLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Exam Plus Coverage' }));
    yesExamPlusButton = new Button(this.page, "//input[contains(@id,'ExamPlus')]");
    noExamPlusButton = new Button(this.page, "//input[contains(@id,'ExamPlus')]/../..//input[not(contains(@id,'ExamPlus'))]");

    hereditaryPlusCoverageLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Hereditary Plus Coverage' }));
    yesHereditaryPlusButton = new Button(this.page, "//input[contains(@id,'HereditaryPlus')]");
    noHereditaryPlusButton = new Button(this.page, "//input[contains(@id,'HereditaryPlus')]/../..//input[not(contains(@id,'HereditaryPlus'))]");

    breedingCoverageLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Breeding Coverage' }));
    yesBreedingCoverageButton = new Button(this.page, "//input[contains(@id,'BreedingCoverage')]");
    noBreedingCoverageButton = new Button(this.page, "//input[contains(@id,'BreedingCoverage')]/../..//input[not(contains(@id,'BreedingCoverage'))]");

    supportPlusCoverageLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Support Plus Coverage' }));
    yesSupportPlusCoverageButton = new Button(this.page, "//input[contains(@id,'SupportPlus')]");
    noSupportPlusCoverageButton = new Button(this.page, "//input[contains(@id,'SupportPlus')]/../..//input[not(contains(@id,'SupportPlus'))]");

    hereditaryConditionsButton = new Button(this.page, this.page.getByRole('button', { name: 'Hereditary Conditions' }));
    behaviouralTherapiesButton = new Button(this.page, this.page.getByRole('button', { name: 'Behavioural Therapies' }));
    alternativeTherapiesButton = new Button(this.page, this.page.getByRole('button', { name: 'Alternative Therapies' }));
    fullCoverageLink = new Link(this.page, this.page.getByRole('link', { name: 'SEE FULL COVERAGE AND WAITING' }));

    // What coverage covers buttons (AKC/PPI specific)
    advancedTreatmentsButton = new Button(this.page, this.page.getByRole('button', { name: 'Advanced Treatments & Services' }));
    prescriptionMedicationButton = new Button(this.page, this.page.getByRole('button', { name: 'Prescription Medication' }));
    illnessesButton = new Button(this.page, this.page.getByRole('button', { name: 'Illnesses' }));
    surgeriesButton = new Button(this.page, this.page.getByRole('button', { name: 'Surgeries' }));
    foreignBodyOrToxinButton = new Button(this.page, this.page.getByRole('button', { name: 'Foreign Body or Toxin' }));
    diagnosticTestingButton = new Button(this.page, this.page.getByRole('button', { name: 'Diagnostic Testing' }));
    alternativeAndHolisticButton = new Button(this.page, this.page.getByRole('button', { name: 'Alternative & Holistic' }));
    cancerCoverageButton = new Button(this.page, this.page.getByRole('button', { name: 'Cancer Coverage' }));
    preExistingConditionsButton = new Button(this.page, this.page.getByRole('button', { name: 'Pre-Existing Conditions' }));

    // Footer
    addAnotherPetButton = new Button(this.page, "//button[contains(text(),' ADD ANOTHER PET ')]");
    addAnotherPetPopUpButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Another Pet' }));
    checkoutButton = new Button(this.page, this.page.getByRole('button', { name: 'Checkout', exact: false }));
    continueButton = new Button(this.page, this.page.getByRole('button', { name: 'Continue' }));
    //labels 
    discountLabel = new Label(this.page, this.page.getByText('Discounts Applied', { exact: false }));
    partnerDiscountTextLabel = new Label(this.page, this.page.getByText('5% Partner Discount', { exact: false }));
    /**
     * Selects multiple plan options at once
     * @param options - Object with optional plan values
     */
    async selectPlanOptions(options?: Partial<CustomPlanData>): Promise<void> {
        const defaultData = getDefaultCustomPlanData();
        const formData = { ...defaultData, ...options };

        if (formData.coverageType?.toLowerCase() === 'custom') {
            await this.customButton.click();
            await this.annualCoverageSelect.selectOption(formData.annualCoverage!);
            await this.annualDeductibleSelect.selectOption(formData.deductible!);
            await this.reimbursementSelect.selectOption(formData.reimbursement!);
        }
        logger.info(`[StepTwoPage.selectPlanOptions] Selected coverage limits`);
    }


    async selectUpgrades(upgradeData?: Partial<UpgradeData>): Promise<void> {
        logger.info('[StepTwoPage.selectUpgrades] Selecting upgrades');
        const upgrades = { ...getDefaultUpgradeData(), ...upgradeData };

        // Handle Wellness (has 3 options)
        if (upgrades.Wellness === 'DefenderPlus') {
            await this.yesWellnessDefenderPlusButton.check();
        } else if (upgrades.Wellness === 'Defender') {
            await this.yesWellnessDefenderButton.check();
        } else {
            await this.noWellnessAddIncoverageButton.check();
        }

        // Handle boolean upgrades
        const upgradeOptions = [
            { label: this.examPlusCoverageLabel, yesBtn: this.yesExamPlusButton, noBtn: this.noExamPlusButton, value: upgrades.ExamPlus },
            { label: this.hereditaryPlusCoverageLabel, yesBtn: this.yesHereditaryPlusButton, noBtn: this.noHereditaryPlusButton, value: upgrades.HereditaryPlus },
            { label: this.breedingCoverageLabel, yesBtn: this.yesBreedingCoverageButton, noBtn: this.noBreedingCoverageButton, value: upgrades.BreedingCoverage },
            { label: this.supportPlusCoverageLabel, yesBtn: this.yesSupportPlusCoverageButton, noBtn: this.noSupportPlusCoverageButton, value: upgrades.SupportPlus }
        ];

        for (const option of upgradeOptions) {
            if (await option.label.isDisplayed()) {
                const buttonToClick = option.value ? option.yesBtn : option.noBtn;
                await buttonToClick.check();
            }
        }
    }

    /**
     * Returns the Label control for the pet name (heading)
     * @param petName - The pet name to match
     */
    getPetNameLabel(petName: string): Label {
        logger.info(`[StepTwoPage.getPetNameLabel] Getting pet name label for: ${petName}`);
        return new Label(this.page, this.page.getByRole('heading', { name: petName, exact: true }));
    }

    /**
     * Returns the Label control for the gender, age, or breed
     * @param value - The value to match (e.g., 'Female', 'Abyssinian')
     */
    getPetInfoLabel(value: string): Label {
        logger.info(`[StepTwoPage.getPetInfoLabel] Getting pet info label for value: ${value}`);
        return new Label(this.page, this.page.getByText(value));
    }

    /**
     * Returns the Label control for the pet age (e.g., '4 yrs')
     * @param age - The age value to match (number or string)
     */
    getPetAgeLabel(age: string | number): Label {
        logger.info(`[StepTwoPage.getPetAgeLabel] Getting pet age label for age: ${age}`);
        return new Label(this.page, `//span[contains(text(),'${age} yrs') or contains(text(),'${age} ans')]`);
    }

    /**
     * Returns the Label control for the base plan heading.
     * @param planType - The plan type to match ('Accident Only' or 'Accident & Illness')
     */
    getBasePlanLabel(planType: 'Accident Only' | 'Accident & Illness'): Label {
        logger.info(`[StepTwoPage.getBasePlanLabel] Getting base plan label for type: ${planType}`);
        return new Label(this.page, this.page.getByRole('heading', { name: `base plan ${planType}`, exact: true }));
    }
}