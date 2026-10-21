import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { CustomPlanData, getDefaultPpuCustomPlanData } from '@data/quote/step-two-data';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { StepTwoPage } from '../quote/step-two-page';

export enum limits {
    AnnualCoverage = 'Annual Coverage',
    Deductible = 'Deductible',
    Reimbursement = 'Reimbursement',
    CouvertureAnnuelle = 'Couverture annuell',
    Franchise = 'Franchise',
    Remboursement = 'Remboursement'
}


export class PpuStepTwoPage extends StepTwoPage {

    // What PPU covers buttons
    accidentsButton = new Button(this.page, this.page.getByRole('button', { name: 'Accidents' }));
    illnessButton = new Button(this.page, this.page.getByRole('button', { name: 'Illness' }));
   

    //edita pet? message
    override yesLeaveButton = new Button(this.page, "//button[@aria-label='Yes, Leave' or @aria-label='Oui, partez']");
    override noStayButton = new Button(this.page, "//button[@aria-label='No, Stay' or @aria-label='Non, restez']");
    /**
       * Selects a plan option by its value (e.g., '$7,500', '$100', '70%')
       * @param value - The exact text value to select
       */
    async selectPlanOptionByValue(value: string): Promise<void> {
        logger.info(`[PPU StepTwoPage.selectPlanOptionByValue] Selecting plan option by value: ${value}`);
        const optionButton = new Button(this.page, this.page.getByText(value, { exact: false }));
        await optionButton.click();
        try {
            await expect(optionButton.getLocator()).toHaveClass(/btn price_option_button_label/, { timeout: timeouts.veryShort });
        } catch {
            logger.warning(`[PPU StepTwoPage.selectPlanOptionByValue] Option not selected, trying again ${value}`);
            await optionButton.click();
            await expect(optionButton.getLocator()).toHaveClass(/btn price_option_button_label/, { timeout: timeouts.veryShort });
        }
    }

    /**
       * Selects multiple plan options at once
       * @param options - Object with optional plan values
       */
    override async selectPlanOptions(options?: Partial<CustomPlanData>): Promise<void> {
        logger.info('[PPU StepTwoPage.selectPlanOptions] Selecting multiple plan options');
        const defaultData = getDefaultPpuCustomPlanData();
        const formData = { ...defaultData, ...options };
        await this.basePriceLabel.waitForVisible(timeouts.default);
        await this.page.waitForTimeout(timeouts.polling);
        await this.selectPlanOptionByValue(formData.annualCoverage!);
        await this.selectPlanOptionByValue(formData.deductible!);
        await this.selectPlanOptionByValue(formData.reimbursement!);
        logger.info('[PPU StepTwoPage.selectPlanOptions] Plan options selected successfully');
    }

    async getValuesForLimitsAccidentIllness(limitsValue: limits): Promise<string[]> {
        let xpathLocator = `//h4[contains(text(),'${limitsValue}')]/../../ul//label`;
        logger.info(`[PPU StepTwoPage.getValuesForLimits] Getting all label texts from XPath: ${xpathLocator}`);
        let labels = await this.page.locator(xpathLocator).all();
        const textsArray: string[] = [];

        for (const label of labels) {
            const text = await label.textContent();
            logger.info(`[PPU StepTwoPage.getValuesForLimits] Found label text >>> : ${text?.trim()}`);
            if (text !== null) {
                const normalized = text
                    .replace(/\u00A0/g, ' ')
                    .trim()
                    .replace(/\s+/g, ' ');
                textsArray.push(normalized.trim());
            }
        }
        logger.info(`[PPU StepTwoPage.getValuesForLimits] Found ${textsArray.length} labels: ${textsArray.join(', ')}`);
        return textsArray;
    }

    async getValuesForLimitsAccidentOnly(limitsValue: limits): Promise<string> {
        let xpathLocator = `//h4[contains(text(),'${limitsValue}')]/../../p`;
        logger.info(`[PPU StepTwoPage.getValuesForLimitsAccidentOnly] Getting label text from XPath: ${xpathLocator}`);
        let valueLimitLabel = new Label(this.page, xpathLocator);
        const normalized = (await valueLimitLabel.getText()).trim()
            .replace(/\u00A0/g, ' ')
            .trim()
            .replace(/\s+/g, ' ');
        logger.info(`[PPU StepTwoPage.getValuesForLimitsAccidentOnly] Found label: ${normalized}`);
        return normalized;
    }
}