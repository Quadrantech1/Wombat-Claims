import { promises as fs } from 'fs';
import path from 'path';
import { expect, test } from '@playwright/test';
import { ClaimOcrService } from '@services/claim-ocr-service';

const claimId = '2431310';
const attachmentDirectory = path.resolve('download', 'claim-attachments');
const documentName = `${claimId}-additional-claim-info`;
const documentPath = path.join(attachmentDirectory, `${documentName}.pdf`);
const outputPath = path.join(attachmentDirectory, `${documentName}.json`);

test(
    'Orca > Extract claim JSON from the downloaded attachment',
    { tag: ['@Regression', '@Orca', '@ClaimsTest', '@OCR'] },
    async () => {
        await test.step('Verify the downloaded attachment is a PDF', async () => {
            const pdfBytes = await fs.readFile(documentPath);
            expect(pdfBytes.subarray(0, 1024).indexOf(Buffer.from('%PDF-'))).toBeGreaterThanOrEqual(0);
        });

        const result = await new ClaimOcrService().parseDocumentToJson(documentPath, outputPath);
        const ruleOutputDirectory = path.join(attachmentDirectory, documentName);

        await test.step('Verify the generated JSON and OCR sidecars', async () => {
            const savedResult = JSON.parse(await fs.readFile(outputPath, 'utf8'));
            expect(savedResult).toEqual(result);
            expect(result.validation.review_required).toBe(true);

            const metadata = JSON.parse(
                await fs.readFile(path.join(ruleOutputDirectory, 'claim_metadata.json'), 'utf8')
            );
            const petWiseItems = JSON.parse(
                await fs.readFile(path.join(ruleOutputDirectory, 'pet_wise_line_items.json'), 'utf8')
            );
            if ('invoices' in result) {
                expect(metadata.invoices).toHaveLength(result.invoices.length);
                expect(petWiseItems.invoices).toHaveLength(result.invoices.length);
            } else {
                expect(metadata.claim_metadata).toEqual(result.claim_metadata);
                expect(petWiseItems.pets).toEqual(result.pets);
            }
        });
    }
);
