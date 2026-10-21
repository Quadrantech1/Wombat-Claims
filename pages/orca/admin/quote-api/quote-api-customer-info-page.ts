import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class QuoteApiCustomInfoPage extends BasePage {
    deductibleSelect = new Select(this.page, "//select[@formcontrolname='deductibleLimitId']");
    coinsuranceSelect = new Select(this.page, "//select[@formcontrolname='coinsuranceId']");
    annualLimitsSelect = new Select(this.page, "//select[@formcontrolname='coverageId']");
    incidentLimitsSelect = new Select(this.page, "//select[@formcontrolname='incidentLimitId']");
    createButton = new Button(this.page, "//button[text()='Create']");
    quotePetIdLabel = new Label(this.page, "//div[@class='card-body']/p[contains(text(),'Quote Pet Id')]/b");
    accidentAndIllnessRadioButton = new RadioButton(this.page, "//input[@id='Accident and Illness Coverage0' or @id='CompanionCare0' or @id='Accident and Illness0']");
    accidentOnlyRadioButton = new RadioButton(this.page, "#AccidentCare1, #AccidentCare0");

    /**
     * Selects an available upgrade radio button by type
     */
    async selectAvailableUpgrades(type: string): Promise<void> {
        logger.info(`[QuoteApiCustomerInfoPage.selectAvailableUpgrades] - Selecting upgrade type: ${type}`);
        await new RadioButton(this.page, `//div/input[contains(@id,"${type}")]`).click();
    }

    /**
     * Selects an available upgrade radio button by pet age
     */
    async selectCoverageType(petAge: number): Promise<void> {
        logger.info(`[QuoteApiCustomerInfoPage.selectCoverageType] - Selecting coverage for pet age: ${petAge}`);
        if (petAge >= 9) {
            await this.accidentOnlyRadioButton.click();
            await this.selectProductsUnderAvailableUpgrades('Pre-Existing Condition Coverage', 'AccidentCare');
            await this.selectProductsUnderAvailableUpgrades('Waiting Period', 'AccidentCare');
        } else {
            await this.accidentAndIllnessRadioButton.click();
            await this.selectProductsUnderAvailableUpgrades('Pre-Existing Condition Coverage', 'CompanionCare');
            await this.selectProductsUnderAvailableUpgrades('Waiting Period', 'CompanionCare');
            await this.selectProductsUnderAvailableUpgrades('IVDD Waiting Period', 'CompanionCare');
        }


    }

    /**
     * Checks if an available upgrade option is displayed
     */
    async checkAvailableUpgradeOptionDisplayed(mainProduct: string): Promise<void> {
        logger.info(`[QuoteApiCustomerInfoPage.checkAvailableUpgradeOptionDisplayed] - Checking upgrade option for: ${mainProduct}`);
        const radio = new RadioButton(this.page, `//div/input[contains(@id,"${mainProduct}")]`);
        await expect(radio.getLocator()).toBeVisible({ timeout: timeouts.short });
    }

    /**
     * Selects products under available upgrades
     */
    async selectProductsUnderAvailableUpgrades(subProduct: string, product: string): Promise<void> {
        logger.info(`[QuoteApiCustomerInfoPage.selectProductsUnderAvailableUpgrades] - Selecting subProduct: ${subProduct} under product: ${product}`);
        await new Checkbox(this.page, `//input[@type="radio" and contains(@id,"${product}")]/ancestor::div[@role="tab"]/following-sibling::div//label[text()="${subProduct}"]/preceding-sibling::input[@type="checkbox"]`).check();
    }

    /**
     * Selects all available upgrades based on coverage type (Accident and Illness vs Accident Only)
     */
    async selectAllAvailableUpgradesByCoverageType(isCoverageAccidentAndIllness: boolean): Promise<void> {
        logger.info(`[QuoteApiCustomInfoPage.selectAllAvailableUpgradesByCoverageType] - Selecting upgrades for coverage type: ${isCoverageAccidentAndIllness ? 'Accident and Illness' : 'Accident Only'}`);

        if (isCoverageAccidentAndIllness) {
            // Accident and Illness upgrades
            await this.selectProductsUnderAvailableUpgrades('Examination Fees', 'CompanionCare');
            await this.selectProductsUnderAvailableUpgrades('Examination Fees Dental Illness', 'CompanionCare');
            await this.selectProductsUnderAvailableUpgrades('Prescription Food', 'CompanionCare');
            await this.selectProductsUnderAvailableUpgrades('Take Home Medication', 'CompanionCare');
            await this.selectProductsUnderAvailableUpgrades('Basic', 'CompanionCare');
            await this.selectProductsUnderAvailableUpgrades('Prime', 'CompanionCare');
        } else {
            // Accident Only upgrades
            await this.selectProductsUnderAvailableUpgrades('Examination Fees', 'AccidentCare');
            await this.selectProductsUnderAvailableUpgrades('Take Home Medication', 'AccidentCare');
            await this.selectProductsUnderAvailableUpgrades('Prescription Food', 'AccidentCare');
            await this.selectProductsUnderAvailableUpgrades('Basic', 'AccidentCare');
            await this.selectProductsUnderAvailableUpgrades('Prime', 'AccidentCare');
        }
    }
}
