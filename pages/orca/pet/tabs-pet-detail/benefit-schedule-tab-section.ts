import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class BenefitScheduleTabSection extends BasePage {
    noWellnessCoverageAlert = new Label(this.page, "//div[@id='ben-sched-table']//div[contains(@class,'alert-warning')]");
    benefitScheduleTable = new Table(this.page, "//div[@id='ben-sched-table']//table");

    /**
     * Opens the accordion for a specific policy term
     * @param policyId - The policy ID
     * @param term - The term number (default: 1)
     */
    async openPolicyTermAccordion(policyId: string, term: number = 1): Promise<void> {
        logger.info(`[BenefitScheduleTabSection.openPolicyTermAccordion] - Opening accordion for Policy ${policyId} Term ${term}`);
        const accordionLink = new Link(
            this.page,
            `//div[@id='ben-sched-table']//a[contains(text(),'Policy ${policyId}') and contains(text(),'Term ${term}')]`
        );
        await accordionLink.click();
    }

    /**
     * Gets the View Policy link for a specific policy
     * @param policyId - The policy ID
     */
    getViewPolicyLink(policyId: string): Link {
        return new Link(this.page, `//div[@id='ben-sched-table']//a[contains(@href,'policyId=${policyId}')]`);
    }
}
