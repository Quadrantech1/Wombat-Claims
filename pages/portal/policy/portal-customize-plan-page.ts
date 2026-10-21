import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { CustomizePlanData, getDefaultCustomizePlanData, getDefaultUpgradeData, UpgradeData } from '@data/portal/customize-plan-data';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { BasePage } from '../../base-page';

export class PortalCustomizePlanPage extends BasePage {
    // Buttons
    addToCartButton = new Button(this.page, this.page.getByRole('button', { name: 'Add to Cart' }));
    addToCartButtonToolTip = new Label(this.page, "//div[@id='cdk-describedby-message-container']/div");

    // Select Controls
    deductibleSelect = new Select(this.page, "//select[@formcontrolname='deductibleId']");
    coinsuranceSelect = new Select(this.page, "//select[@formcontrolname='coinsuranceId']");
    annualLimitSelect = new Select(this.page, "//select[@formcontrolname='coverageLimitId']");

    // Upgrade Options Checkboxes
    examPlusCheckbox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'ExamPlus' }));
    breedingCoverageCheckbox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'BreedingCoverage' }));
    supportPlusCheckbox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'SupportPlus' }));
    defenderPlusCheckbox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'DefenderPlus' }));
    defenderCheckbox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'Defender', exact: true }));
    hereditaryPlusCheckbox = new Checkbox(this.page, this.page.getByRole('checkbox', { name: 'HereditaryPlus' }));
    leaveButton = new Button(this.page, this.page.getByRole('button', { name: 'Leave' }));

    /**
     * Fill the coverage options on the customize plan page
     * @param planData - Partial data containing only the fields to update
     * @returns Promise that resolves when the coverage options are filled
     */
    async fillCoverageOptions(planData?: Partial<CustomizePlanData>): Promise<void> {
        const formData = { ...getDefaultCustomizePlanData(), ...planData };

        // todo: Add logging
        await this.deductibleSelect.waitForVisible(timeouts.default);

        await this.deductibleSelect.selectValue(formData.deductible);
        await this.coinsuranceSelect.selectValue(formData.coinsurance);
        await this.annualLimitSelect.selectValue(formData.annualLimit);
    }

    /**
     * Click on a specific policy number link
     * @param policyNumber - The policy number to click on
     * @returns Promise that resolves when the link is clicked
     */
    async clickPolicyNumberLink(policyNumber: string): Promise<void> {
        logger.info(`[PortalCustomizePlanPage.clickPolicyNumberLink] Clicking policy number link: ${policyNumber}`);
        const policyLink = new Button(this.page, `//div[@class="policy__number" and contains(text(),"${policyNumber}")]`);
        await policyLink.waitForVisible();
        await policyLink.clickAndWait('load');
    }

    /**
     * Selects limits with default data merged with any provided overrides
     * @param coverageData - Optional partial data to override defaults
     * @returns Promise that resolves when coverage options are filled
     */
    async selectLimits(coverageData?: Partial<CustomizePlanData>): Promise<void> {
        const formData = { ...getDefaultCustomizePlanData(), ...coverageData };
        logger.info('[PortalCustomizePlanPage.selectLimits] Selecting coverage limits, data: ' + JSON.stringify(formData));

        await this.deductibleSelect.waitForVisible(timeouts.default);
        await this.deductibleSelect.selectValue(formData.deductible!);
        await this.coinsuranceSelect.selectValue(formData.coinsurance!);
        await this.annualLimitSelect.selectValue(formData.annualLimit!);
        logger.info('[PortalCustomizePlanPage.selectLimits] Selected coverage limits successfully');
    }

    /**
     * Selects upgrade options based on boolean values
     * @param upgradeData - Optional partial data to override defaults
     * @returns Promise that resolves when specified upgrades are selected
     */
    async selectUpgrades(upgradeData?: Partial<UpgradeData>): Promise<void> {

        const upgrades = { ...getDefaultUpgradeData(), ...upgradeData };
        logger.info('[PortalCustomizePlanPage.selectUpgrades] Selecting upgrade options, data: ' + JSON.stringify(upgrades));

        const upgradeMap = {
            ExamPlus: this.examPlusCheckbox,
            BreedingCoverage: this.breedingCoverageCheckbox,
            SupportPlus: this.supportPlusCheckbox,
            DefenderPlus: this.defenderPlusCheckbox,
            Defender: this.defenderCheckbox,
            HereditaryPlus: this.hereditaryPlusCheckbox
        };

        for (const [upgradeName, shouldClick] of Object.entries(upgrades)) {
            if (shouldClick === true) {
                const checkbox = upgradeMap[upgradeName as keyof typeof upgradeMap];
                await checkbox?.click();
            }
        }
        logger.info('[PortalCustomizePlanPage.selectUpgrades] Upgrade options selected successfully');
    }
}
