import { BasePage } from '@pages/base-page';
import { RadioButton } from '@controls/radio-button';
import { Button } from '@controls/button';

export class ThirtyDayCoverageOptionsPage extends BasePage {
    activate30DayOfPetInsuranceEnrollAnnualRadioButton = new RadioButton(this.page, this.page.locator("//h2[contains(.,'Activate 30-Days of Pet Insurance & Enroll in Annual Plan Now')]/../..//input"));
    activate30DayOfPetInsuranceCoverageRadioButton = new RadioButton(this.page, this.page.locator("//h2[contains(.,'Activate 30-Days of Pet Insurance Coverage')]/../..//input"));
    skip30DayOfPetInsuranceCoverageRadioButton = new RadioButton(this.page, this.page.locator("//h2[contains(.,'Skip 30-Day Coverage and Enroll in Annual Plan Now')]/../..//input"));
    backButton = new Button(this.page, this.page.locator("//button[contains(.,'Back')]"));
    nextButton = new Button(this.page, this.page.locator("//button[contains(.,'Continue')]"));
}
