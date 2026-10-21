import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { AttachmentTabSection } from '@pages/orca/policy/tabs-policy-detail/attachment-tab-section';
import { downloadPdf } from '@utils/download-util';
import { logger } from '@utils/logger-util';
import { getTextPDF } from '@utils/pdf-util';
import { timeouts } from '@utils/timeouts-util';

export class GroupAttachmentTabSection extends AttachmentTabSection {
    private readonly documentCheckboxSelector = 'input[type="checkbox"].reissue[data-hdn-id="SelectedAttachments"][data-param="attachmentIds"]';
    override term1Link = new Label(this.page, this.page.locator('#certificate-attachments').getByRole('link', { name: /^Term 1\b/ }));
    private readonly term1Group = this.term1Link.getLocator().locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," accordion-group ")][1]');
    welcomeLetterCheckbox = new Checkbox(this.page, this.welcomeLetterDocLabel.getLocator().locator('..').locator('input.reissue[type="checkbox"]'));
    welcomeLetterRow = new Label(this.page, this.welcomeLetterDocLabel.getLocator().locator('..'));
    override documentsAndLettersLink = new Label(this.page, this.term1Group.getByRole('link', { name: /Documents and Letters - \(\d+\)/ }));
    addAttachmentButton = new Button(this.page, '#attachments .btn-group > a[title="Add Attachment"]');
    deleteAttachmentsButton = new Button(this.page, '#attachments .btn-group > #btn-delete-attachments');
    reissueDocumentsButton = new Button(this.page, '#attachments .btn-group > #btn-reissue-attachments');
    selectedAttachmentsInput = new Label(this.page, '#SelectedAttachments');
    documentCheckboxes = new Checkbox(this.page, this.page.locator('#attachments').locator(this.documentCheckboxSelector));
    checkedDocumentCheckboxes = new Checkbox(this.page, this.page.locator('#attachments').locator(`${this.documentCheckboxSelector}:checked`));
    firstTerm1DocumentCheckbox = new Checkbox(this.page, this.term1Group.locator(this.documentCheckboxSelector).first());
    firstTerm1DocumentRow = new Label(this.page, this.firstTerm1DocumentCheckbox.getLocator().locator('xpath=ancestor::div[starts-with(@id,"attachment-")][1]'));
    documentRows = new Label(this.page, this.documentCheckboxes.getLocator().locator('xpath=ancestor::div[starts-with(@id,"attachment-")][1]'));

    getAttachmentRow(rowId: string): Label {
        return new Label(this.page, this.page.locator('#attachments').locator(`[id="${rowId}"]`));
    }

    getAttachmentCheckbox(rowId: string): Checkbox {
        return new Checkbox(this.page, this.getAttachmentRow(rowId).getLocator().locator(`${this.documentCheckboxSelector}:visible`));
    }

    /** Expands Term 1 and its first document group after opening or refreshing attachments. */
    async expandDocumentGroups(): Promise<void> {
        await this.term1Link.waitForVisible();
        await this.term1Link.click();
        await this.term1Group.locator(':scope > .accordion-body.in[style*="height: auto"]').waitFor({ state: 'visible', timeout: timeouts.default });
        await this.documentsAndLettersLink.waitForVisible();
        await this.documentsAndLettersLink.click();
        await this.firstTerm1DocumentCheckbox.getLocator().locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," accordion-body ")][1]')
            .and(this.page.locator('.in[style*="height: auto"]')).waitFor({ state: 'visible', timeout: timeouts.default });
    }

    /**
     * Reload the page, reopen the Attachment(s) tab, and verify that a new Declaration Page was generated
     * before downloading and reading the newest Declaration PDF.
     *
     * @param previousCount - the Declaration count observed before the triggering change
     * @param folderId - folder identifier (typically the certificate/policy number) used as the download target
     * @param filePrefix - prefix used for the downloaded PDF file name, e.g. `${filePrefix}-Opened.pdf`
     * @returns Promise<string> - the extracted text of the newest Declaration PDF
     * @throws Error - if the new Declaration count does not equal previousCount + 1
     */
    async waitForAndVerifyNewDeclaration(previousCount: number, folderId: string, filePrefix: string): Promise<string> {
        logger.info(`[GroupAttachmentTabSection.waitForAndVerifyNewDeclaration] - filePrefix: ${filePrefix}`);
        const expectedCount = previousCount + 1;
        await this.page.waitForTimeout(timeouts.default);
        await this.page.reload({ waitUntil: 'networkidle' });
        await new Label(this.page, '//a[@title="Attachment(s)"]').click();

        const newCount = await this.getDeclarationCountFromTerm1();
        if (newCount !== expectedCount) {
            throw new Error(`[GroupAttachmentTabSection.waitForAndVerifyNewDeclaration] - Expected Declaration count ${expectedCount} but found ${newCount}`);
        }

        const { popup, pdfUrl } = await this.openDeclarationDocumentInNewTab(newCount - 1);
        try {
            await downloadPdf(popup, pdfUrl, folderId, `${filePrefix}-Opened.pdf`);
            return await getTextPDF(folderId, `${filePrefix}-Opened.pdf`);
        } finally {
            await popup.close();
        }
    }

    /**
     * Gets the download link of a Group document whose name carries the Coverage Period ID suffix (e.g. "Welcome Letter 96724").
     * @param nameDocument - The document name without the CP ID (e.g. 'Welcome Letter')
     * @param cpId - The Coverage Period ID the document belongs to
     * @throws Error if the document row with the CP ID suffix is not found
     */
    async getDownloadLinkFromLinkWithCpId(nameDocument: string, cpId: string): Promise<string> {
        const document = new Link(this.page, `//div[contains(normalize-space(text()),"${nameDocument} ${cpId}")]/..//a[not (@title)]`);
        const href = await document.getAttribute('href');
        if (!href) {
            throw new Error(`[GroupAttachmentTabSection.getDownloadLinkFromLinkWithCpId] - Download link not found for document: ${nameDocument} ${cpId}`);
        }
        return href;
    }

    /**
     * Gets the names of the listed Group documents carrying the Coverage Period ID suffix, with the suffix stripped (e.g. "Welcome Letter 96724" -> "Welcome Letter").
     * Reads the currently expanded accordion (e.g. Documents and Letters).
     * @param cpId - The Coverage Period ID the documents belong to
     */
    async getDocumentNamesWithCpId(cpId: string): Promise<string[]> {
        logger.info(`[GroupAttachmentTabSection.getDocumentNamesWithCpId] - Reading documents for CP ID: ${cpId}`);
        const rows = new Label(this.page, `//div[contains(normalize-space(text()),"${cpId}") and ../descendant::a[not(@title)]]`).getLocator();
        await rows.first().waitFor({ state: 'visible', timeout: timeouts.long });
        const texts = await rows.allTextContents();
        return texts.map(text => text.replace(cpId, '').trim());
    }
}
