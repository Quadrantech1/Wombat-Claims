import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';


export class ProcessingTabSection extends BasePage {

    addLossesButton = new Button(this.page, "//a[@title='Add Loss(es)']");
    addLineItemsButton = new Button(this.page, "//a[@title='Add Line Items']");
    totalSubmittedAmountLabel = new Label(this.page, "//strong[normalize-space()='Total Submitted:']/ancestor::td/following-sibling::td[1]");

    async clickOnViewDeleteCellForPet(petName: string, isDeleteButton: boolean): Promise<void> {
        logger.info(`[ProcessingTabSection.clickOnViewDeleteCellForPet] - Clicking on ${isDeleteButton ? 'Delete' : 'View'} button for pet: ${petName}`);
        const viewOrDelete = isDeleteButton ? "Delete Loss" : "Add Line Items";
        const xpath = `//div[@id='losses-table']/table//td[contains(., "${petName}")]/parent::*/td/a[@title='${viewOrDelete}']`;
        const control = new Button(this.page, xpath);
        await control.clickAndWait();
    }

    async getLinkForCancellationPDF(): Promise<string> {
        logger.info("[ProssesingTabSection>getLinkForCancellationPDF]Retrieving link for Cancellation PDF");
        const linkCancellationPDF = new Link(this.page, "//a[contains(@href,'attachments') and contains(@href,'.pdf')]");
        const href = await linkCancellationPDF.getAttribute("href");
        if (href === null) {
            throw new Error("Cancellation PDF link not found.");
        }
        return href;
    }
}