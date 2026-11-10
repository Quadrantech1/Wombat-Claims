import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const SUPPORTED_DOCUMENT_EXTENSIONS = new Set([
    '.png',
    '.jpg',
    '.jpeg',
    '.tif',
    '.tiff',
    '.webp',
    '.pdf'
]);

interface ClaimOcrResultBase {
    schema_version: string;
    status: 'ok' | 'needs_review' | 'failed';
    source_document: string;
    validation: {
        review_required: boolean;
        warnings: string[];
    };
}

export interface ClaimOcrSingleInvoiceResult extends ClaimOcrResultBase {
    claim_metadata: Record<string, unknown>;
    pets: Array<{
        pet_name: string | null;
        line_items: Array<Record<string, unknown>>;
        conditions?: Array<Record<string, unknown>>;
    }>;
}

export interface ClaimOcrMultiInvoiceResult extends ClaimOcrResultBase {
    document_classification: Record<string, unknown>;
    invoices: Array<ClaimOcrSingleInvoiceResult & { page_numbers: number[] }>;
    unassigned_pages: Array<Record<string, unknown>>;
}

export type ClaimOcrResult =
    | ClaimOcrSingleInvoiceResult
    | ClaimOcrMultiInvoiceResult;

export interface ClaimOcrBundleResult {
    schema_version: string;
    status: 'needs_review';
    documents: ClaimOcrResult[];
    relationships: Array<{
        documents: string[];
        relationship: string;
        matching_evidence: string[];
        conflicting_evidence: string[];
        review_required: boolean;
    }>;
    validation: {
        review_required: boolean;
        warnings: string[];
    };
}

export interface ClaimOcrServiceOptions {
    extractionProjectRoot?: string;
    pythonExecutable?: string;
}

export class ClaimOcrService {
    private readonly extractionProjectRoot: string;
    private readonly pythonExecutable: string;

    constructor(options: ClaimOcrServiceOptions = {}) {
        this.extractionProjectRoot = path.resolve(
            options.extractionProjectRoot
                ?? (process.env.CLAIM_OCR_PROJECT_ROOT || undefined)
                ?? path.resolve(process.cwd(), '..', 'bpi_playwright_handoff_repo')
        );
        this.pythonExecutable = options.pythonExecutable
            ?? (process.env.CLAIM_OCR_PYTHON || undefined)
            ?? path.join(
                this.extractionProjectRoot,
                '.venv-py312',
                process.platform === 'win32' ? 'Scripts' : 'bin',
                process.platform === 'win32' ? 'python.exe' : 'python'
            );
    }

    /**
     * Run the existing claim parser for an image or PDF and save its JSON result.
     * This method does not interact with the browser or submit a claim.
     */
    async parseDocumentToJson(
        documentPath: string,
        outputPath?: string
    ): Promise<ClaimOcrResult> {
        const sourcePath = path.resolve(documentPath);
        const sourceStats = await fs.stat(sourcePath);
        if (!sourceStats.isFile()) {
            throw new Error(`[ClaimOcrService.parseDocumentToJson] Document path is not a file: ${sourcePath}`);
        }

        if (!SUPPORTED_DOCUMENT_EXTENSIONS.has(path.extname(sourcePath).toLowerCase())) {
            throw new Error(`[ClaimOcrService.parseDocumentToJson] Unsupported document type: ${path.extname(sourcePath)}`);
        }

        const destinationPath = path.resolve(
            outputPath ?? path.join(path.dirname(sourcePath), `${path.parse(sourcePath).name}.json`)
        );
        const normalizedSource = process.platform === 'win32' ? sourcePath.toLowerCase() : sourcePath;
        const normalizedDestination = process.platform === 'win32'
            ? destinationPath.toLowerCase()
            : destinationPath;
        if (normalizedSource === normalizedDestination) {
            throw new Error('[ClaimOcrService.parseDocumentToJson] JSON output must not overwrite the source document.');
        }

        await this.runExtractor([sourcePath], destinationPath);

        let result: unknown;
        try {
            result = JSON.parse(await fs.readFile(destinationPath, 'utf8'));
        } catch (error) {
            throw new Error(
                `[ClaimOcrService.parseDocumentToJson] Could not read valid extraction JSON at ${destinationPath}: ${String(error)}`
            );
        }
        if (!this.isClaimOcrResult(result)) {
            throw new Error(
                `[ClaimOcrService.parseDocumentToJson] Extractor output does not match the claim JSON contract: ${destinationPath}`
            );
        }
        return result;
    }

    async parseDocumentsToJson(
        documentPaths: string[],
        outputPath?: string
    ): Promise<ClaimOcrBundleResult> {
        if (documentPaths.length < 2) {
            throw new Error('[ClaimOcrService.parseDocumentsToJson] At least two documents are required.');
        }
        const sourcePaths = await Promise.all(documentPaths.map(async documentPath => {
            const sourcePath = path.resolve(documentPath);
            const sourceStats = await fs.stat(sourcePath);
            if (!sourceStats.isFile()) {
                throw new Error(`[ClaimOcrService.parseDocumentsToJson] Document path is not a file: ${sourcePath}`);
            }
            if (!SUPPORTED_DOCUMENT_EXTENSIONS.has(path.extname(sourcePath).toLowerCase())) {
                throw new Error(`[ClaimOcrService.parseDocumentsToJson] Unsupported document type: ${path.extname(sourcePath)}`);
            }
            return sourcePath;
        }));
        const destinationPath = path.resolve(
            outputPath
                ?? path.join(
                    path.dirname(sourcePaths[0]),
                    `${path.parse(sourcePaths[0]).name}_bundle.json`
                )
        );
        const normalizedDestination = process.platform === 'win32'
            ? destinationPath.toLowerCase()
            : destinationPath;
        if (sourcePaths.some(sourcePath => (
            (process.platform === 'win32' ? sourcePath.toLowerCase() : sourcePath)
                === normalizedDestination
        ))) {
            throw new Error('[ClaimOcrService.parseDocumentsToJson] JSON output must not overwrite a source document.');
        }

        await this.runExtractor(sourcePaths, destinationPath);

        let result: unknown;
        try {
            result = JSON.parse(await fs.readFile(destinationPath, 'utf8'));
        } catch (error) {
            throw new Error(
                `[ClaimOcrService.parseDocumentsToJson] Could not read valid extraction JSON at ${destinationPath}: ${String(error)}`
            );
        }
        if (!this.isClaimOcrBundleResult(result)) {
            throw new Error(
                `[ClaimOcrService.parseDocumentsToJson] Extractor output does not match the document bundle contract: ${destinationPath}`
            );
        }
        return result;
    }

    async parseImageToJson(
        imagePath: string,
        outputPath?: string
    ): Promise<ClaimOcrResult> {
        const extension = path.extname(imagePath).toLowerCase();
        if (extension === '.pdf') {
            throw new Error('[ClaimOcrService.parseImageToJson] Use parseDocumentToJson for PDF files.');
        }
        return this.parseDocumentToJson(imagePath, outputPath);
    }

    private runExtractor(sourcePaths: string[], destinationPath: string): Promise<void> {
        const pythonPath = [
            path.join(this.extractionProjectRoot, 'src'),
            process.env.PYTHONPATH
        ].filter(Boolean).join(path.delimiter);
        return new Promise((resolve, reject) => {
            const processHandle = spawn(
                this.pythonExecutable,
                ['-m', 'bpi_claim_extraction', ...sourcePaths, '--output', destinationPath],
                {
                    cwd: this.extractionProjectRoot,
                    env: { ...process.env, PYTHONPATH: pythonPath },
                    windowsHide: true
                }
            );
            let stderr = '';
            processHandle.stderr.setEncoding('utf8');
            processHandle.stderr.on('data', (chunk: string) => {
                stderr = `${stderr}${chunk}`.slice(-4000);
            });
            processHandle.once('error', error => {
                reject(new Error(
                    `[ClaimOcrService.parseDocumentToJson] Could not start Python OCR (` +
                    `${this.pythonExecutable}): ${error.message}`
                ));
            });
            processHandle.once('close', code => {
                if (code === 0) {
                    resolve();
                    return;
                }
                reject(new Error(
                    `[ClaimOcrService.parseDocumentToJson] OCR process exited with code ${code}. ` +
                    `Check the Python environment and OCR dependencies. ${stderr.trim()}`
                ));
            });
        });
    }

    private isClaimOcrResult(value: unknown): value is ClaimOcrResult {
        if (!value || typeof value !== 'object') {
            return false;
        }
        const result = value as Record<string, unknown>;
        const validBase = typeof result.schema_version === 'string'
            && ['ok', 'needs_review', 'failed'].includes(String(result.status))
            && typeof result.source_document === 'string'
            && !!result.validation
            && typeof result.validation === 'object'
            && typeof (result.validation as Record<string, unknown>).review_required === 'boolean'
            && Array.isArray((result.validation as Record<string, unknown>).warnings);
        if (!validBase) {
            return false;
        }
        const singleInvoice = !!result.claim_metadata
            && typeof result.claim_metadata === 'object'
            && Array.isArray(result.pets);
        const multipleInvoices = !!result.document_classification
            && typeof result.document_classification === 'object'
            && Array.isArray(result.invoices)
            && (result.invoices as unknown[]).every(invoice => {
                if (!invoice || typeof invoice !== 'object') {
                    return false;
                }
                const record = invoice as Record<string, unknown>;
                return !!record.claim_metadata
                    && typeof record.claim_metadata === 'object'
                    && Array.isArray(record.pets)
                    && Array.isArray(record.page_numbers);
            })
            && Array.isArray(result.unassigned_pages);
        return singleInvoice || multipleInvoices;
    }

    private isClaimOcrBundleResult(value: unknown): value is ClaimOcrBundleResult {
        if (!value || typeof value !== 'object') {
            return false;
        }
        const result = value as Partial<ClaimOcrBundleResult>;
        return typeof result.schema_version === 'string'
            && result.status === 'needs_review'
            && Array.isArray(result.documents)
            && result.documents.every(document => this.isClaimOcrResult(document))
            && Array.isArray(result.relationships)
            && !!result.validation
            && typeof result.validation.review_required === 'boolean'
            && Array.isArray(result.validation.warnings);
    }
}
