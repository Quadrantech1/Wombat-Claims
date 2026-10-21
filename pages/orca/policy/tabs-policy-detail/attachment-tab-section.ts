import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { BasePage } from '@pages/base-page';
import type { Page } from '@playwright/test';
import { downloadPdf } from '@utils/download-util';
import { logger } from '@utils/logger-util';
import { getTextPDF, pdfContainsText, pdfContainsTextNormalized } from '@utils/pdf-util';
import { timeouts } from '@utils/timeouts-util';

export class AttachmentTabSection extends BasePage {
    // Attachment tab link controls
    term1Link = new Label(this.page, "//a[@class ='accordion-toggle ajax-get' and contains(text(),'Term')]");
    term2Link = new Label(this.page, "//a[contains(text(),'Term 2')]");
    declarationsLink = new Label(this.page, this.page.getByRole('link', { name: 'Declarations - (1)' }));
    term1DeclarationsLink = new Link(this.page, this.page.getByRole('link', { name: /Declarations - \(\d+\)/ }));
    declarationDownloadLinks = new Link(this.page, "//div[contains(text(),'Declarations')]/..//a[contains(@href,'.pdf') and not (@title)]");
    termsAndConditionsLink = new Label(this.page, "//a[contains(text(), 'Terms and Conditions')]");
    otherLink = new Label(this.page, "//a[contains(text(),'Other')]");
    documentsAndLettersLink = new Label(this.page, "//a[contains(text(), 'Documents and Letters')]");
    documentsAndLetters1Link = new Label(this.page, "//a[contains(text(), 'Documents and Letters - (1)')]");
    financeAndCancellationsLink = new Label(this.page, "//a[contains(text(), 'Finance and Cancellations')]");
    cancellationNoticeCheckbox = new Label(this.page, "//div[@data-input-type='select' and contains(text(),'Cancellation Notice')]//preceding-sibling::div/input[@type='checkbox']");
    cancellationNoticePdfLink = new Label(this.page, "//div[@data-input-type='select' and contains(text(),'Cancellation Notice')]//preceding-sibling::div/a");
    otherDocumentsAndLettersLink = new Label(this.page, "//div[@id=\"attachments-other\"]//a[contains(text(), 'Documents and Letters')]");

    // Document type labels
    declarationsDocLabel = new Label(this.page, "//div[@class='span2 edit' and contains(text(),'Declarations')]");
    termsAndConditionsDocLabel = new Label(this.page, "//div[@class='span2 edit' and contains(text(),'Terms and Conditions')]");
    endorsementsDocLabel = new Label(this.page, "//div[@class='span2 edit' and contains(text(),'Endorsements')]");
    welcomeCoverPageDocLabel = new Label(this.page, "//div[@class='span3 edit' and contains(text(),'Welcome Cover Page')]");
    welcomeLetterDocLabel = new Label(this.page, "//div[@class='span3 edit' and contains(text(),'Welcome Letter')]");
    cancellationLetterDocLabel = new Label(this.page, "//div[@data-input-type='select' and contains(text(),'Cancellation Letter')]");

    // Result labels
    activatedByLabel = new Label(this.page, "//div[@class='accordion-body in collapse']//div[contains(@class,'row-fluid')][contains(text(),'Activated By')]");
    soldByLabel = new Label(this.page, "//div[@class='accordion-body in collapse']//div[contains(@class,'row-fluid')][contains(text(),'Sold By')]");


    async getDownloadLinkFromLink(nameDocument: string): Promise<string> {
        const document = new Link(this.page, `//div[contains(text(),"${nameDocument}")]/..//a[not (@title)]`);
        const href = await document.getAttribute('href');
        if (!href) {
            throw new Error(`Download link not found for document: ${nameDocument}`);
        }
        return href;
    }

    async getDeclarationPdfTexts(folderId: string, filePrefix: string = 'Declarations'): Promise<string[]> {
        const downloadLinks = this.declarationDownloadLinks.getLocator();
        const declarationPdfTexts: string[] = [];

        const declarationCount = await downloadLinks.count();
        for (let declarationIndex = 0; declarationIndex < declarationCount; declarationIndex++) {
            const declarationUrl = await downloadLinks.nth(declarationIndex).getAttribute('href');
            if (!declarationUrl) {
                throw new Error(`[AttachmentTabSection.getDeclarationPdfTexts] - Declaration PDF ${declarationIndex + 1} download link was not found`);
            }

            const fileName = `${filePrefix}-${declarationIndex + 1}.pdf`;
            await downloadPdf(this.page, declarationUrl, folderId, fileName);
            declarationPdfTexts.push(await getTextPDF(folderId, fileName));
        }

        return declarationPdfTexts;
    }

    async openDeclarationDocumentInNewTab(declarationIndex: number): Promise<{ popup: Page; pdfUrl: string }> {
        try {
            const declarationLink = this.declarationDownloadLinks.getLocator().nth(declarationIndex);
            await declarationLink.waitFor({ state: 'visible', timeout: timeouts.long });
            await declarationLink.scrollIntoViewIfNeeded();
            const href = await declarationLink.getAttribute('href');
            if (!href) throw new Error('Declaration link has no href');
            const [popup] = await Promise.all([
                this.page.waitForEvent('popup'),
                declarationLink.click()
            ]);
            // Headless Chromium downloads the PDF, so the popup stays blank and never fires load events
            return { popup, pdfUrl: new URL(href, this.page.url()).toString() };
        } catch (error) {
            throw new Error(`[AttachmentTabSection.openDeclarationDocumentInNewTab] - ${error instanceof Error ? error.message : error}`);
        }
    }

    async openFirstDeclarationDocumentInNewTab(): Promise<{ popup: Page; pdfUrl: string }> {
        return this.openDeclarationDocumentInNewTab(0);
    }

    async getDeclarationCountFromTerm1(): Promise<number> {
        await this.verifyTerm1AndOtherAttachmentsLoaded();
        await this.term1Link.click();

        await this.term1DeclarationsLink.waitForVisible(timeouts.long);
        await this.term1DeclarationsLink.getLocator().scrollIntoViewIfNeeded();
        await this.term1DeclarationsLink.click();
        // declarationDownloadLinks can match multiple PDFs, so wait on the first match to avoid a strict-mode violation
        await this.declarationDownloadLinks.getLocator().first().waitFor({ state: 'visible', timeout: timeouts.long });

        const labelText = await this.term1DeclarationsLink.getLocator().textContent();
        const match = labelText?.match(/\((\d+)\)/);

        if (!match) {
            throw new Error(`[AttachmentTabSection.getDeclarationCountFromTerm1] - Declaration count was not found in label text: ${labelText}`);
        }

        return Number(match[1]);
    }

    /**
     * Verify that a named document in the Attachment tab contains the specified text.
     *
     * This method will locate the document link for `nameDocument`, download the PDF
     * to a folder identified by `folderId` (saving it as `${nameDocument}.pdf`), and
     * then check whether the downloaded PDF contains the provided `expectedText`.
     *
     * @param nameDocument - The visible name of the document link (e.g. 'Welcome Letter')
     * @param expectedText - A string or array of strings expected to appear in the PDF
     * @param folderId - A folder identifier (often the policy id) used as download target
     * @returns Promise<boolean> - resolves to true if the PDF contains the expected text, otherwise false
     * @throws Error - if the document download link cannot be found or if downloadPdf throws
     */
    async verifyDocumentHasText(nameDocument: string, expectedText: string | string[], folderId: string): Promise<boolean> {
        const documentLink = await this.getDownloadLinkFromLink(nameDocument);
        await downloadPdf(this.page, documentLink, folderId, `${nameDocument}.pdf`);
        if (!await pdfContainsText(folderId, `${nameDocument}.pdf`, expectedText)) {
            throw new Error(`PDF for ${nameDocument} does not contain expected text: ${expectedText}`);
        }
        return true;
    }

    /**
     * Same as {@link verifyDocumentHasText}, but ignores whitespace/line break differences.
     * Use for long sentences that may wrap across multiple lines in the PDF.
     *
     * @param nameDocument - The visible name of the document link (e.g. 'Cancellation Letter')
     * @param expectedText - A string or array of strings expected to appear in the PDF
     * @param folderId - A folder identifier (often the policy id) used as download target
     * @returns Promise<boolean> - resolves to true if the PDF contains the expected text
     * @throws Error - if the document download link cannot be found, if downloadPdf throws, or if the PDF does not contain the expected text
     */
    async verifyDocumentHasNormalizedText(nameDocument: string, expectedText: string | string[], folderId: string): Promise<boolean> {
        let documentLink: string;
        try {
            documentLink = await this.getDownloadLinkFromLink(nameDocument);
        } catch (e) {
            throw new Error(`[AttachmentTabSection.verifyDocumentHasNormalizedText] - ${e instanceof Error ? e.message : e}`);
        }
        await downloadPdf(this.page, documentLink, folderId, `${nameDocument}.pdf`);
        if (!await pdfContainsTextNormalized(folderId, `${nameDocument}.pdf`, expectedText)) {
            throw new Error(`[AttachmentTabSection.verifyDocumentHasNormalizedText] - PDF for ${nameDocument} does not contain expected text: ${expectedText}`);
        }
        return true;
    }

    /**
     * Ensure that the Term1 and Other attachment links are visible on the page.
     * Notes:
     * - `isDisplayed` returns a boolean, so this method evaluates those booleans
     *   rather than relying on exceptions.
     *
     * @returns Promise<boolean> resolves to true when both links are visible
     * @throws Error when links are not visible after one reload attempt
     */
    async verifyTerm1AndOtherAttachmentsLoaded(): Promise<boolean> {
        await this.page.waitForTimeout(timeouts.polling);
        const checkLinks = async (): Promise<boolean> => {
            const term1Visible = await this.term1Link.isDisplayed(timeouts.polling);
            const otherVisible = await this.otherLink.isDisplayed(timeouts.polling);
            return Boolean(term1Visible && otherVisible);
        };

        // First attempt
        if (await checkLinks()) {
            return true;
        }

        logger.warning('[AttachmentTabSection.verifyTerm1AndOtherAttachmentsLoaded] - After first try Required document links not loaded, reloading page and trying again');
        await this.page.reload({ waitUntil: 'networkidle' });

        // Second attempt after reload
        if (await checkLinks()) {
            return true;
        }

        throw new Error('[AttachmentTabSection.verifyTerm1AndOtherAttachmentsLoaded] - Required document links not loaded after page reload');
    }

    /**
     * Wait for the Finance and Cancellations link to be loaded before clicking it.
     * Cancellation letter generation is an async backend job, so under parallel test
     * load it can take longer to populate this accordion; retries once after a reload.
     *
     * @returns Promise<boolean> resolves to true when the link is visible
     * @throws Error when the link is not visible after one reload attempt
     */
    async waitForFinanceAndCancellationsLink(): Promise<boolean> {
        if (await this.financeAndCancellationsLink.isDisplayed(timeouts.long)) {
            return true;
        }

        logger.warning('[AttachmentTabSection.waitForFinanceAndCancellationsLink] - Finance and Cancellations link not loaded, reloading page and trying again');
        await this.page.reload({ waitUntil: 'networkidle' });
        await this.otherLink.clickAndWait();

        if (await this.financeAndCancellationsLink.isDisplayed(timeouts.long)) {
            return true;
        }

        throw new Error('[AttachmentTabSection.waitForFinanceAndCancellationsLink] - Finance and Cancellations link not loaded after page reload');
    }
}
