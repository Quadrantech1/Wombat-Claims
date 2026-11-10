import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { ClaimOcrService } from '@services/claim-ocr-service';

test(
    'Orca > Extract claim JSON from an invoice image or PDF',
    { tag: ['@Regression', '@Orca', '@ClaimsTest', '@OCR'] },
    async () => {
        const documentPath = process.env.CLAIM_OCR_DOCUMENT_PATH
            ?? process.env.CLAIM_OCR_IMAGE_PATH;
        test.skip(
            !documentPath,
            'Set CLAIM_OCR_DOCUMENT_PATH (or legacy CLAIM_OCR_IMAGE_PATH) to run the OCR extraction test.'
        );

        const outputPath = process.env.CLAIM_OCR_OUTPUT_PATH;
        const resolvedOutputPath = outputPath
            ? path.resolve(outputPath)
            : path.join(
                path.dirname(path.resolve(documentPath!)),
                `${path.parse(documentPath!).name}.json`
            );
        const ruleOutputDirectory = path.join(
            path.dirname(resolvedOutputPath),
            path.parse(resolvedOutputPath).name
        );
        const result = await new ClaimOcrService().parseDocumentToJson(
            documentPath!,
            outputPath
        );

        await test.step('Verify the generated claim JSON is saved and reviewable', async () => {
            const output = JSON.parse(await fs.readFile(resolvedOutputPath, 'utf8'));
            expect(output).toEqual(result);
            expect(result.status).toBe('needs_review');
            expect(result.validation.review_required).toBe(true);
            expect(Array.isArray(result.pets)).toBe(true);
            const metadata = JSON.parse(
                await fs.readFile(path.join(ruleOutputDirectory, 'claim_metadata.json'), 'utf8')
            );
            const petWiseItems = JSON.parse(
                await fs.readFile(path.join(ruleOutputDirectory, 'pet_wise_line_items.json'), 'utf8')
            );
            if ('invoices' in result) {
                expect(metadata.invoices).toHaveLength(result.invoices.length);
                expect(petWiseItems.invoices).toHaveLength(result.invoices.length);
                expect(
                    petWiseItems.invoices.map((invoice: { pets: unknown[] }) => invoice.pets)
                ).toEqual(result.invoices.map(invoice => invoice.pets));
            } else {
                expect(metadata.claim_metadata).toEqual(result.claim_metadata);
                expect(petWiseItems.pets).toEqual(result.pets);
            }
        });
    }
);
