import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class AttachmentTabSection extends BasePage {
    otherLink = new Link(this.page, "//a[@data-placeholder-id='attachments-other']");
    termLink = new Link(this.page, "//a[contains(@data-placeholder-id,'-attachments')]");
    claimsResultLink = new Link(this.page, "//a[contains(text(),'Claims -')]");

    claimsReissueDocButton = new Button(this.page, "#btn-reissue-claim-attachements");
    claimsDocumentCheckbox = new Checkbox(this.page, "//input[@data-hdn-id='SelectedAttachments']");

    claimsAcknowledgementLabel = new Label(this.page, "//div[@class='span2 edit' and contains(text(),'Claim Acknowledgement')]");
    claimsLabel = new Label(this.page, "//div[@class='span2 edit' and contains(text(),'Claims')]")
    uploadedFilesLabel = new Label(this.page, "//div[@class='span2 edit' and contains(text(),'Uploaded Files')]");
    explanationOfBenefitsLabel = new Label(this.page, "//div[@class='span2 edit' and contains(text(),'Explanation of Benefits')]");
    chooseFileLabel = new Label(this.page, "//input[@id='file']");

    addNewButton = new Button(this.page, "//a[@title='Add Attachment']");
    addAttachmentButton = new Button(this.page, "input[type='file']");
    saveButton = new Button(this.page, "button:has-text('Save')");

    /**
     * Gets the link for a claim PDF by document type and optional specific description.
     * @param nameDocument - The document type (e.g., "Explanation of Benefits", "Claims")
     * @param secondDescription - Optional specific description (e.g., "EOB Cover Page", "Claims Form")
     * @returns The href attribute of the PDF link
     * @throws Error if the PDF link is not found
     */
    async getLinkForClaimPDFByName(nameDocument: string, secondDescription?: string): Promise<string> {
        let xpath: string;

        if (secondDescription) {
            // Match both the document type (span2) and specific description (span3)
            xpath = `//div[@class='span2 edit' and contains(normalize-space(.), '${nameDocument}')][../div[@class='span3 edit' and contains(normalize-space(.), '${secondDescription}')]]/parent::div[contains(@class,'row-fluid')]//a[@target='_blank']`
        } else {
            //match only the document type
            xpath = `//div[contains(text(),'${nameDocument}')]/..//a[contains(.,'.pdf')]`;
        }

        const linkClaimPDF = new Link(this.page, xpath);
        await linkClaimPDF.waitForVisible(timeouts.default);
        const href = await linkClaimPDF.getAttribute("href");
        if (href === null) {
            throw new Error(`[AttachmentTabSection.getLinkForClaimPDFByName] - PDF link href attribute not found for document: ${nameDocument}${secondDescription ? ` - ${secondDescription}` : ''}`);
        }
        return href;
    }

    async getNumberOfElementsOnAttachmentTable(value: string): Promise<number> {
        const elements = await this.page.$$(`//div[contains(text(),'${value}') and @data-source]`);
        return elements.length;
    }

    /**
     * Ensure that the Claims Result link is visible on the page.
     * Notes:
     * - `isDisplayed` returns a boolean, so this method evaluates that boolean
     *   rather than relying on exceptions.
     *
     * @returns Promise<boolean> resolves to true when the link is visible
     * @throws Error when link is not visible after one reload attempt
     */
    async verifyClaimsResultLinkLoaded(): Promise<boolean> {
        await this.page.waitForTimeout(timeouts.polling);

        // First attempt
        if (await this.claimsResultLink.isDisplayed(timeouts.veryShort)) {
            return true;
        }

        logger.warning('[AttachmentTabSection.verifyClaimsResultLinkLoaded] - Claims Result link not loaded, reloading page and trying again');
        await this.page.reload({ waitUntil: 'networkidle' });
        await this.page.getByRole('link', { name: 'Attachment(s)' }).click();

        // Second attempt after reload
        if (await this.claimsResultLink.isDisplayed(timeouts.polling)) {
            return true;
        }

        throw new Error('[AttachmentTabSection.verifyClaimsResultLinkLoaded] - Claims Result link not loaded after page reload');
    }
}