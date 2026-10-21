import { BasePage } from '@pages/base-page';
import { Button } from '@controls/button';
import { Label } from '@controls/label';

export class Review30DayPage extends BasePage {
    backButton = new Button(this.page, this.page.locator("//button[contains(.,'Back')]"));
    nextSelectAnnualPlanButton = new Button(this.page, this.page.locator("//button[contains(.,'Next: Select Annual Plan')]"));
    checkoutButton = new Button(this.page, this.page.locator("//button[contains(.,'Checkout')]"));
    dayCoveragesLabel = new Label(this.page, this.page.locator("//span[contains(.,'30-DAY COVERAGE')]"));
}
