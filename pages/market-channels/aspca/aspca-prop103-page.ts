import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { ReactCombobox } from '@controls/react-combobox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export type Prop103FilterOption = 'Custom' | 'Most Reimbursement' | 'Lowest Cost' | 'Most Popular';
export type Prop103AnnualLimit = '$2500' | '$5000' | '$7000' | '$10,000' | 'Unlimited';

export class AspcaProp103Page extends BasePage {

    // Progress stepper
    petInfoStepButton = new Button(this.page, this.page.getByTestId('step-0'));
    coverageStepButton = new Button(this.page, this.page.getByTestId('step-1'));

    // Coverage page headings
    choosePlanHeadingLabel = new Label(this.page, this.page.locator('div').filter({ hasText: 'Choose a Plan for' }).nth(2));
    completeCoverageLabel = new Label(this.page, this.page.locator('div').filter({ hasText: 'Complete CoverageFor when' }).nth(3));

    // Filter by combobox
    filterByCombobox = new ReactCombobox(this.page, this.page.getByRole('combobox', { name: 'Filter by' }));

    // Custom plan label (visible after selecting "Custom" filter)
    customPlanLabel = new Label(this.page, this.page.getByText('Custom', { exact: true }));

    // Add a Pet discount button
    addPetDiscountButton = new Button(this.page, this.page.getByRole('button', { name: 'Add a Pet, Get 5% Off!' }));

    // Navigation
    continueButton = new Button(this.page, this.page.getByRole('button', { name: 'Continue' }));

    /**
     * Selects an option in the "Filter by" combobox.
     * @param option - Filter option to select
     */
    async selectFilter(option: Prop103FilterOption): Promise<void> {
        logger.info(`[AspcaProp103Page.selectFilter] - Selecting filter: ${option}`);
        await this.filterByCombobox.select(option);
    }

    /**
     * Clicks an annual limit button by its dollar value.
     * @param limit - Annual limit value (e.g. '$7000')
     */
    async selectAnnualLimit(limit: Prop103AnnualLimit): Promise<void> {
        logger.info(`[AspcaProp103Page.selectAnnualLimit] - Selecting annual limit: ${limit}`);
        await this.page.getByRole('button', { name: limit }).click();
    }

    /**
     * Waits for the "Filter by" combobox to be visible on the prop103 coverage page.
     */
    async waitForCoveragePage(): Promise<void> {
        logger.info('[AspcaProp103Page.waitForCoveragePage] - Waiting for prop103 coverage page');
        await this.filterByCombobox.waitForVisible(timeouts.short);
    }
}
