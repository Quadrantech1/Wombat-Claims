import path from 'path';
import {
    ClaimOcrResult,
    ClaimOcrService
} from '../services/claim-ocr-service';

interface CliOptions {
    documentPaths: string[];
    outputPath?: string;
}

function parseArguments(args: string[]): CliOptions {
    const documentPaths: string[] = [];
    let legacyImageUsed = false;
    let outputPath: string | undefined;

    for (let index = 0; index < args.length; index += 1) {
        const argument = args[index];
        if (argument === '--help' || argument === '-h') {
            console.log(
                'Usage: npm run ocr:claim -- --document <image-or-pdf-path> [--output <path>]\n' +
                '       npm run ocr:claim -- --document <path1> --document <path2> [--output <path>]\n' +
                '       npm run ocr:claim -- --image <image-path> [--output <path>] (legacy alias)'
            );
            process.exit(0);
        }

        if (argument !== '--document' && argument !== '--image' && argument !== '--output') {
            throw new Error(`Unknown argument: ${argument}`);
        }
        const value = args[index + 1];
        if (!value || value.startsWith('--')) {
            throw new Error(`Expected a path after ${argument}.`);
        }
        if (argument === '--document' || argument === '--image') {
            if (argument === '--image') {
                if (legacyImageUsed) {
                    throw new Error('Specify only one --image path.');
                }
                if (documentPaths.length > 0) {
                    throw new Error('Do not combine --image with --document.');
                }
                legacyImageUsed = true;
            } else if (legacyImageUsed) {
                throw new Error('Do not combine --image with --document.');
            }
            documentPaths.push(value);
        } else {
            outputPath = value;
        }
        index += 1;
    }

    if (documentPaths.length === 0) {
        throw new Error('Document path is required. Use --document <image-or-pdf-path>.');
    }
    if (legacyImageUsed && documentPaths.length > 1) {
        throw new Error('Specify only one --image path.');
    }
    return { documentPaths, outputPath };
}

function countLineItems(result: ClaimOcrResult): number {
    if ('invoices' in result) {
        return result.invoices.reduce(
            (total, invoice) => total + invoice.pets.reduce(
                (petTotal, pet) => petTotal + pet.line_items.length,
                0
            ),
            0
        );
    }
    return result.pets.reduce(
        (total, pet) => total + pet.line_items.length,
        0
    );
}

async function main(): Promise<void> {
    try {
        const options = parseArguments(process.argv.slice(2));
        const service = new ClaimOcrService();
        const outputPath = options.outputPath
            ?? path.join(
                path.dirname(options.documentPaths[0]),
                `${path.parse(options.documentPaths[0]).name}${options.documentPaths.length > 1 ? '_bundle' : ''}.json`
            );
        const sidecarDirectory = path.join(
            path.dirname(outputPath),
            path.parse(outputPath).name
        );
        if (options.documentPaths.length === 1) {
            const result = await service.parseDocumentToJson(
                options.documentPaths[0],
                outputPath
            );
            const lineItemCount = countLineItems(result);
            console.log(`Claim JSON written to: ${outputPath}`);
            console.log(`Rule-specific JSON written to: ${path.join(sidecarDirectory, 'claim_metadata.json')} and ${path.join(sidecarDirectory, 'pet_wise_line_items.json')}`);
            const invoiceCount = 'invoices' in result
                ? result.invoices.length
                : 1;
            console.log(`Status: ${result.status}; invoices: ${invoiceCount}; line items: ${lineItemCount}`);
            if (result.validation.warnings.length > 0) {
                console.log(`Review warnings: ${result.validation.warnings.length}`);
            }
        } else {
            const result = await service.parseDocumentsToJson(
                options.documentPaths,
                outputPath
            );
            const lineItemCount = result.documents.reduce(
                (total, document) => total + countLineItems(document),
                0
            );
            console.log(`Document bundle JSON written to: ${outputPath}`);
            console.log(`Rule-specific JSON written to: ${path.join(sidecarDirectory, 'claim_metadata.json')} and ${path.join(sidecarDirectory, 'pet_wise_line_items.json')}`);
            console.log(`Status: ${result.status}; documents: ${result.documents.length}; line items: ${lineItemCount}`);
            if (result.validation.warnings.length > 0) {
                console.log(`Review warnings: ${result.validation.warnings.length}`);
            }
        }
    } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
    }
}

void main();
