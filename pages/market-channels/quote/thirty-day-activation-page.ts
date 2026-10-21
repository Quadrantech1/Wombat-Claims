import { Button } from '@controls/button';
import { RadioButton } from '@controls/radio-button';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class ThirtyDayActivationPage extends BasePage {
    // Radio button options
    activate30DayAndEnrollAnnualRadioButton = new RadioButton(this.page, this.page.locator("//h2[contains(.,'Activate 30-days of Pet Insurance & Enroll Annual Plan')]/../..//input"));
    activate30DayOnlyRadioButton = new RadioButton(this.page, this.page.locator("//h2[contains(.,'Activate 30-days of Pet Insurance Coverage')]/../..//input"));
    skip30DayRadioButton = new RadioButton(this.page, this.page.locator("//h2[contains(.,'Skip 30-Day Coverage and Enroll in Annual Plan Now')]/../..//input"));
    enrollInAnnualPlanNowRadioButton = new RadioButton(this.page, this.page.locator("//h2[contains(.,'Enroll in Annual Plan Now')]/../..//input"));

    // Navigation buttons
    backButton = new Button(this.page, this.page.getByRole('button', { name: 'Back' }));
    continueButton = new Button(this.page, this.page.getByRole('button', { name: 'Continue' }));

    /**
     * Selects the option to activate 30-day and enroll in annual plan
     */
    async selectActivate30DayAndAnnual(): Promise<void> {
        logger.info('[ThirtyDayActivationPage.selectActivate30DayAndAnnual] Selecting Activate 30-days & Enroll Annual Plan');
        await this.activate30DayAndEnrollAnnualRadioButton.clickAndWait();
        await this.continueButton.clickAndWait('load');
        await this.activate30DayAndEnrollAnnualRadioButton.waitWhileControlDisappears();
        logger.info('[ThirtyDayActivationPage.selectActivate30DayAndAnnual] Selected and continued');
    }

    /**
     * Selects the option to activate 30-day coverage only
     */
    async selectActivate30DayOnly(): Promise<void> {
        logger.info('[ThirtyDayActivationPage.selectActivate30DayOnly] Selecting Activate 30-days Coverage Only');
        await this.activate30DayOnlyRadioButton.click();
        await this.continueButton.clickAndWait();
        await this.activate30DayOnlyRadioButton.waitWhileControlDisappears();
        logger.info('[ThirtyDayActivationPage.selectActivate30DayOnly] Selected and continued');
    }

    /**
     * Selects the option to skip 30-day and enroll in annual plan
     */
    async selectSkip30Day(): Promise<void> {
        logger.info('[ThirtyDayActivationPage.selectSkip30Day] Selecting Skip 30-Day Coverage');
        await this.skip30DayRadioButton.click();
        await this.continueButton.click();
        await this.skip30DayRadioButton.waitWhileControlDisappears();
        logger.info('[ThirtyDayActivationPage.selectSkip30Day] Selected and continued');
    }

    /**
     * Selects the option to enroll in annual plan now
     */
    async selectEnrollInAnnualPlanNow(): Promise<void> {
        logger.info('[ThirtyDayActivationPage.selectEnrollInAnnualPlanNow] Selecting Enroll in Annual Plan Now');
        await this.enrollInAnnualPlanNowRadioButton.click();
        await this.continueButton.click();
        await this.enrollInAnnualPlanNowRadioButton.waitWhileControlDisappears();
        logger.info('[ThirtyDayActivationPage.selectEnrollInAnnualPlanNow] Selected and continued');
    }
}
