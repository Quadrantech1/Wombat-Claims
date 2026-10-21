import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { RadioButton } from '@controls/radio-button';
import { BasePage } from '@pages/base-page';
import { AspcaCoverageDetailsModal } from '@pages/market-channels/aspca/modals/aspca-coverage-details-modal';
import { AspcaExclusionsModal } from '@pages/market-channels/aspca/modals/aspca-exclusions-modal';
import { expect } from '@playwright/test';
import { isMobile } from '@utils/browser-utils';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export type AspcaPlan = 'Value' | 'Popular' | 'High Coverage';
export type AspcaDeductible = '$750' | '$500' | '$250' | '$100';
export type AspcaReimbursement = '70%' | '80%' | '90%';
export type AspcaAnnualLimit = '$2500' | '$5000' | '$7000' | '$10,000' | 'Unlimited';

export interface BuildYourOwnOptions {
    deductible?: AspcaDeductible;
    reimbursement?: AspcaReimbursement;
    annualLimit?: AspcaAnnualLimit;
}

export class AspcaCoveragePage extends BasePage {

    // Modals opened from this page
    exclusionsModal = new AspcaExclusionsModal(this.page);
    coverageDetailsModal = new AspcaCoverageDetailsModal(this.page);

    // Progress stepper — buttons are identified by data-testid
    petInfoStepButton = new Button(this.page, this.page.getByTestId('step-0'));
    coverageStepButton = new Button(this.page, this.page.getByTestId('step-1'));

    // Plan radiogroup
    private planRadiogroup = this.page.getByRole('radiogroup', { name: /Plan options/ });

    // Pre-set plan "Select Plan" / "Plan Selected" buttons
    valuePlanSelectButton = new Button(
        this.page,
        this.planRadiogroup.getByRole('radio', { name: /^Value,/ }).getByRole('button')
    );
    popularPlanSelectButton = new Button(
        this.page,
        this.planRadiogroup.getByRole('radio', { name: /^Popular,/ }).getByRole('button')
    );
    highCoveragePlanSelectButton = new Button(
        this.page,
        this.planRadiogroup.getByRole('radio', { name: /^High Coverage,/ }).getByRole('button')
    );

    // Plan price labels
    valuePlanPriceLabel = new Label(
        this.page,
        this.planRadiogroup.getByRole('radio', { name: /^Value,/ }).getByText('/mo')
    );
    popularPlanPriceLabel = new Label(
        this.page,
        this.planRadiogroup.getByRole('radio', { name: /^Popular,/ }).getByText('/mo')
    );
    highCoveragePlanPriceLabel = new Label(
        this.page,
        this.planRadiogroup.getByRole('radio', { name: /^High Coverage,/ }).getByText('/mo')
    );

    // Build Your Own Plan accordion
    buildYourOwnPlanButton = new Button(
        this.page,
        this.page.getByRole('button', { name: 'Build Your Own Plan' })
    );

    // Build Your Own — option groups
    deductibleGroup = this.page.getByRole('group', { name: 'Deductible' });
    reimbursementGroup = this.page.getByRole('group', { name: 'Reimbursement' });
    annualLimitGroup = this.page.getByRole('group', { name: 'Annual Limit' });

    // Coverage detail buttons (visible under What's covered tab)
    accidentsButton = new Button(this.page, this.page.getByRole('button', { name: 'Accidents' }));
    illnessButton = new Button(this.page, this.page.getByRole('button', { name: 'Illness' }));
    hereditaryButton = new Button(this.page, this.page.getByRole('button', { name: 'Hereditary & Congenital Issues' }));
    behavioralButton = new Button(this.page, this.page.getByRole('button', { name: 'Behavioral Issues' }));
    endOfLifeButton = new Button(this.page, this.page.getByRole('button', { name: 'End of Life Expenses' }));
    microchipButton = new Button(this.page, this.page.getByRole('button', { name: 'Microchip Implantation' }));

    // Optional Preventive Care — each is an aria-pressed toggle; on select its own accessible name swaps to "Added" and a sibling "Remove" button appears
    addBasicPreventiveCareButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Basic' }));
    addPrimePreventiveCareButton = new Button(this.page, this.page.getByRole('button', { name: 'Add Prime' }));
    // Selected-state controls — Basic/Prime share one state field (single-select), so at most one card shows "Added"/"Remove" at a time
    preventiveCareAddedButton = new Button(this.page, this.page.getByRole('button', { name: 'Added' }));
    removePreventiveCareButton = new Button(this.page, this.page.getByRole('button', { name: 'Remove' }));

    // Coverage detail panel tabs
    // Note: the button text uses a curly apostrophe (U+2019) — use regex to avoid character mismatch
    whatsCovedTab = new RadioButton(this.page, this.page.getByRole('radio', { name: /what.s covered/i }));
    notCoveredTab = new RadioButton(this.page, this.page.getByRole('radio', { name: 'Not Covered' }));

    // Plan radio buttons — used for aria-checked assertions
    valuePlanRadio = new RadioButton(this.page, this.planRadiogroup.getByRole('radio', { name: /^Value,/ }));
    popularPlanRadio = new RadioButton(this.page, this.planRadiogroup.getByRole('radio', { name: /^Popular,/ }));
    highCoveragePlanRadio = new RadioButton(this.page, this.planRadiogroup.getByRole('radio', { name: /^High Coverage,/ }));

    // Plan tier headings
    choosePlanHeadingLabel = new Label(this.page, this.page.getByRole('heading', { name: /Choose a plan for/i }));
    valuePlanHeading = new Label(this.page, this.page.getByRole('heading', { name: 'Value', level: 2 }));
    popularPlanHeading = new Label(this.page, this.page.getByRole('heading', { name: 'Popular', level: 2 }));
    highCoveragePlanHeading = new Label(this.page, this.page.getByRole('heading', { name: 'High Coverage', level: 2 }));

    // See Plan Options button — reveals the plan tier cards
    seePlanOptionsButton = new Button(this.page, this.page.getByRole('button', { name: 'See Plan Options' }));

    // Stepper progress (sr-only label)
    stepperProgressLabel = new Label(this.page, this.page.locator('[role="status"].sr-only'));

    // Sub-step headings
    optionalPreventiveCareHeading = new Label(this.page, this.page.getByRole('heading', { name: 'Optional Preventive Care' }));
    anyOtherPetsHeading = new Label(this.page, this.page.getByRole('heading', { name: /Any other pets to add/i }));

    // Add another pet
    addAnotherPetButton = new Button(this.page, this.page.getByRole('button', { name: 'Add a Pet, Get 10% Off' }));

    // Navigation
    continueButton = new Button(this.page, this.page.getByRole('button', { name: 'Continue' }));
    // Shared "Back" button — returns to the previous Step 2 sub-screen (or Step 1 from What's Covered)
    backButton = new Button(this.page, this.page.getByRole('button', { name: 'Back' }));

    // What's Covered — Exclusions modal trigger (PBI 250107); a <button>, accessible name "View our full list of exclusions"
    exclusionsLink = new Button(this.page, this.page.getByRole('button', { name: 'View our full list of exclusions' }));

    // Build Your Own Plan — packaged-plan / accident-only / complete-coverage toggles (quoted text from PBIs 248286/248288)
    backToPackagedPlanButton = new Button(this.page, this.page.getByRole('button', { name: 'Back to Packaged Plans' }));
    justWantAccidentOnlyLink = new Link(this.page, this.page.getByRole('note', { name: 'Just want accident coverage' }));
    backToCompleteCoverageLink = new Link(this.page, this.page.getByRole('note', { name: 'Back to Complete Coverage (' }));
    addMoreLink = new Button(this.page, this.page.getByRole('button', { name: 'And More' }));
    coverageDetailsButton = new Button(this.page, this.page.getByRole('button', { name: 'View Full Coverage Details' }));

    // Build Your Own — per-option-group tooltip triggers and content
    deductibleTooltipTrigger = new Button(this.page, this.page.getByRole('button', { name: 'Deductible information' }));
    reimbursementTooltipTrigger = new Button(this.page, this.page.getByRole('button', { name: 'Reimbursement information' }));
    annualLimitTooltipTrigger = new Button(this.page, this.page.getByRole('button', { name: 'Annual Limit information' }));
    deductibleTooltipContent = new Label(this.page, this.page.getByText('The amount you must satisfy'));
    reimbursementTooltipContent = new Label(this.page, this.page.getByText('The portion of covered costs'));
    annualLimitTooltipContent = new Label(this.page, this.page.getByText('The total amount you can be'));

    // Add a Pet — Yes/No radios (PBI 248328)
    addPetYesRadio = new RadioButton(this.page, this.page.getByRole('radio', { name: 'Yes' }));
    addPetNoRadio = new RadioButton(this.page, this.page.getByRole('radio', { name: 'No' }));

    /**
     * Returns a Label for the dynamic coverage page heading (e.g. "Choose a plan for Buddy").
     * Matches on a short prefix of the pet name only, since long names are truncated in the UI.
     * @param petName - The pet name submitted on the Pet Info form
     */
    getPlanHeading(petName: string): Label {
        const namePrefix = petName.slice(0, 10).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new Label(this.page, this.page.getByRole('heading', { name: new RegExp(`Choose a plan for ${namePrefix}`, 'i') }));
    }

    /**
     * Returns a RadioButton for a specific Deductible option within the Build Your Own Plan group.
     * @param value - Deductible value (e.g. '$500')
     */
    getDeductibleOption(value: AspcaDeductible): RadioButton {
        return new RadioButton(this.page, this.deductibleGroup.getByRole('radio', { name: value }));
    }

    /**
     * Returns a RadioButton for a specific Reimbursement option within the Build Your Own Plan group.
     * @param value - Reimbursement value (e.g. '80%')
     */
    getReimbursementOption(value: AspcaReimbursement): RadioButton {
        return new RadioButton(this.page, this.reimbursementGroup.getByRole('radio', { name: value }));
    }

    /**
     * Returns a RadioButton for a specific Annual Limit option within the Build Your Own Plan group.
     * @param value - Annual limit value (e.g. '$5000')
     */
    getAnnualLimitOption(value: AspcaAnnualLimit): RadioButton {
        return new RadioButton(this.page, this.annualLimitGroup.getByRole('radio', { name: value }));
    }

    /**
     * Selects one of the three pre-set plan tiers by clicking its "Select Plan" button.
     * @param plan - Plan name: 'Value', 'Popular', or 'High Coverage'
     */
    async selectPlan(plan: AspcaPlan): Promise<void> {
        logger.info(`[AspcaCoveragePage.selectPlan] - Selecting plan: ${plan}`);
        switch (plan) {
            case 'Value':
                await this.valuePlanSelectButton.click();
                break;
            case 'Popular':
                await this.popularPlanSelectButton.click();
                break;
            case 'High Coverage':
                await this.highCoveragePlanSelectButton.click();
                break;
        }
        logger.info(`[AspcaCoveragePage.selectPlan] - Plan selected: ${plan}`);
    }

    /**
     * Expands the Build Your Own Plan section if it is collapsed, then selects
     * any combination of deductible, reimbursement, and annual limit options.
     * Only the options provided will be clicked — omitted options are left unchanged.
     * @param options - One or more of: deductible, reimbursement, annualLimit
     */
    async selectBuildYourOwn(options: BuildYourOwnOptions): Promise<void> {
        logger.info(`[AspcaCoveragePage.selectBuildYourOwn] - Configuring Build Your Own Plan: ${JSON.stringify(options)}`);
        // Open the BYOP section only if the deductible group is not yet visible
        const isOpen = await this.deductibleGroup.isVisible().catch(() => false);
        if (!isOpen) {
            await this.buildYourOwnPlanButton.click();
            await this.deductibleGroup.waitFor({ state: 'visible', timeout: timeouts.fifteen });
        }
        if (options.deductible) {
            await this.deductibleGroup.getByText(options.deductible, { exact: true }).click();
        }
        if (options.reimbursement) {
            await this.reimbursementGroup.getByText(options.reimbursement, { exact: true }).click();
        }
        if (options.annualLimit) {
            await this.annualLimitGroup.getByText(options.annualLimit, { exact: true }).click();
        }
        logger.info(`[AspcaCoveragePage.selectBuildYourOwn] - Build Your Own Plan configured`);
    }

    /**
     * Opens the tooltip trigger for a Build Your Own option group and asserts its tooltip content becomes visible.
     * Hovers on desktop (real hover event) and taps on mobile/touch emulation, since touch never fires hover.
     * @param group - Which option group's tooltip to verify: 'Deductible', 'Reimbursement', or 'AnnualLimit'
     */
    async verifyTooltipOption(group: 'Deductible' | 'Reimbursement' | 'AnnualLimit'): Promise<void> {
        logger.info(`[AspcaCoveragePage.verifyTooltipOption] - Verifying Build Your Own option tooltip: ${group}`);
        const mobileView = await isMobile(this.page);
        switch (group) {
            case 'Deductible':
                mobileView ? await this.deductibleTooltipTrigger.click() : await this.deductibleTooltipTrigger.hover();
                await expect(this.deductibleTooltipContent.getLocator()).toBeVisible({ timeout: timeouts.veryShort });
                break;
            case 'Reimbursement':
                mobileView ? await this.reimbursementTooltipTrigger.click() : await this.reimbursementTooltipTrigger.hover();
                await expect(this.reimbursementTooltipContent.getLocator()).toBeVisible({ timeout: timeouts.veryShort });
                break;
            case 'AnnualLimit':
                mobileView ? await this.annualLimitTooltipTrigger.click() : await this.annualLimitTooltipTrigger.hover();
                await expect(this.annualLimitTooltipContent.getLocator()).toBeVisible({ timeout: timeouts.veryShort });
                break;
        }
    }

    /**
     * Selects the "Yes" or "No" option on the Add a Pet page.
     * @param choice - 'Yes' to add another pet, 'No' (default) to proceed to Step 3
     */
    async selectAddAnotherPetChoice(choice: 'Yes' | 'No'): Promise<void> {
        logger.info(`[AspcaCoveragePage.selectAddAnotherPetChoice] - Selecting Add a Pet choice: ${choice}`);
        choice === 'Yes' ? await this.addPetYesRadio.click() : await this.addPetNoRadio.click();
    }

}
