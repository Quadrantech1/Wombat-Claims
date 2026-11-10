import { mkdir, readFile, readdir, rm } from 'fs/promises';
import path from 'path';
import { expect, test } from '@fixtures/api-fixtures';
import { TabClaimOptions } from '@pages/orca/claim/tabs-claim-detail-section';
import { OrcaScreenManager } from '@pages/page-managers/orca-page-manager';
import { ClaimOcrService } from '@services/claim-ocr-service';
import { downloadPdf } from '@utils/download-util';
import { loginToOrca } from '@utils/login-orca-util';

const claimId = '2431310';
const claimAttachmentsFolder = 'claim-attachments';

test('Orca > Download all attachments for a claim', { tag: ['@Regression', '@Orca', '@ClaimsTest'] }, async ({ page }) => {
    await test.step('Clear previous downloaded files and OCR output', async () => {
        const downloadDirectory = path.resolve('download', claimAttachmentsFolder);
        await mkdir(downloadDirectory, { recursive: true });
        const existingEntries = await readdir(downloadDirectory);
        await Promise.all(existingEntries.map(entry =>
            rm(path.join(downloadDirectory, entry), { recursive: true, force: true })
        ));
    });

    await test.step('Log in and open the specified claim', async () => {
        await page.goto('https://orca.qas.petpartners.com/account/login?returnUrl=%2F');
        await loginToOrca(page);
        await page.goto(`https://orca.qas.petpartners.com/Claim/ClaimDetail?claimId=${claimId}`);
    });

    const orca = new OrcaScreenManager(page);
    await test.step('Open Attachments and select the Claims result', async () => {
        await orca.claimDetailPage.tabsClaimDetailSection.openTab(TabClaimOptions.attachmentTab);
        await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.confirmClaimResultLinkLoaded();
        await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.claimsResultLink.clickAndWait();
    });

    await test.step('Open and download the claim attachment', async () => {
        const attachmentPanel = orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection;
        const downloadDirectory = path.resolve('download', claimAttachmentsFolder);
        await mkdir(downloadDirectory, { recursive: true });

        const attachmentLink = await attachmentPanel.claimPdfLinkLocatorNamed('Additional Claim Info', 'claims doc');
        const pdfUrl = await attachmentLink.getAttribute('href');
        if (!pdfUrl) {
            throw new Error('Claim attachment link has no URL.');
        }
        const attachmentUrl = new URL(pdfUrl, page.url()).href;
        const attachmentTabPromise = page.waitForEvent('popup');
        await attachmentLink.click();
        const attachmentTab = await attachmentTabPromise;

        try {
            await attachmentTab.waitForLoadState('load');
            await downloadPdf(
                page,
                attachmentUrl,
                claimAttachmentsFolder,
                `${claimId}-additional-claim-info.pdf`
            );
            const pdfPath = path.join(downloadDirectory, `${claimId}-additional-claim-info.pdf`);
            const pdfBytes = await readFile(pdfPath);
            if (pdfBytes.subarray(0, 1024).indexOf(Buffer.from('%PDF-')) === -1) {
                throw new Error(`Downloaded attachment is not a valid PDF: ${attachmentUrl}`);
            }
            await attachmentTab.waitForTimeout(30_000);
        } finally {
            await attachmentTab.close();
        }
    });

    await test.step('Extract the downloaded document into JSON', async () => {
        const documentPath = path.join(
            path.resolve('download', claimAttachmentsFolder),
            `${claimId}-additional-claim-info.pdf`
        );
        const outputPath = path.join(
            path.dirname(documentPath),
            `${claimId}-additional-claim-info.json`
        );
        const documentBytes = await readFile(documentPath);
        expect(documentBytes.subarray(0, 1024).indexOf(Buffer.from('%PDF-'))).toBeGreaterThanOrEqual(0);

        const result = await new ClaimOcrService().parseDocumentToJson(documentPath, outputPath);
        const savedResult = JSON.parse(await readFile(outputPath, 'utf8'));
        expect(savedResult).toEqual(result);
        expect(result.validation.review_required).toBe(true);

        const ruleOutputDirectory = path.join(
            path.dirname(outputPath),
            path.parse(outputPath).name
        );
        const metadata = JSON.parse(
            await readFile(path.join(ruleOutputDirectory, 'claim_metadata.json'), 'utf8')
        );
        const petWiseItems = JSON.parse(
            await readFile(path.join(ruleOutputDirectory, 'pet_wise_line_items.json'), 'utf8')
        );
        if ('invoices' in result) {
            expect(metadata.invoices).toHaveLength(result.invoices.length);
            expect(petWiseItems.invoices).toHaveLength(result.invoices.length);
        } else {
            expect(metadata.claim_metadata).toEqual(result.claim_metadata);
            expect(petWiseItems.pets).toEqual(result.pets);
        }
    });
});
