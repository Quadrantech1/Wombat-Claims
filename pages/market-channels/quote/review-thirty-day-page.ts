import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';

export class ReviewThirtyDayPage extends BasePage {
    // Header elements
    review30DayCoverageLabel = new Label(this.page, "//h1[contains(text(),'Review 30-day Coverage')]");

    // Plan card elements
    coverageDetailsLabel = new Label(this.page, "//h3[contains(@class,'base-plan-title')]");

    // Plan limits and values
    annualCoverageValue = new Label(this.page, "//h4[@id='annualcoverage']/ancestor::div[contains(@class,'d-flex')]//p[contains(@class,'plan_body_limits_values')]");

    deductibleValue = new Label(this.page, "//h4[@id='deductible']/ancestor::div[contains(@class,'d-flex')]//p[contains(@class,'plan_body_limits_values')]");

    reimbursementValue = new Label(this.page, "//h4[@id='reimbursement']/ancestor::div[contains(@class,'d-flex')]//p[contains(@class,'plan_body_limits_values')]");

    whatsNotCoveredList = this.page.locator("//section[contains(@class,'whats-not-covered')]//ul");

    // Full coverage details link
    fullCoverageDetailsLink = this.page.locator("//a[contains(.,'SEE FULL COVERAGE AND WAITING PERIOD DETAILS')]");

    // Navigation buttons (these may vary based on the flow)
    continueButton = new Button(this.page, this.page.getByRole('button', { name: 'Continue', exact: false }));
    backButton = new Button(this.page, this.page.getByRole('button', { name: 'Back', exact: false }));
}
