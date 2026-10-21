import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import { logger } from './logger-util';

let pdfParseWarningSuppressionDepth = 0;
let originalConsoleWarn: typeof console.warn;
let originalConsoleError: typeof console.error;

const suppressPdfParseWarnings = async <T>(operation: () => Promise<T>): Promise<T> => {
    const shouldSuppress = (message: string): boolean => /Warning:\s*TT:|undefined function|invalid function id/i.test(message);

    if (pdfParseWarningSuppressionDepth === 0) {
        originalConsoleWarn = console.warn;
        originalConsoleError = console.error;

        console.warn = (...args: unknown[]) => {
            const message = args.map(String).join(' ');
            if (!shouldSuppress(message)) {
                originalConsoleWarn(...args);
            }
        };

        console.error = (...args: unknown[]) => {
            const message = args.map(String).join(' ');
            if (!shouldSuppress(message)) {
                originalConsoleError(...args);
            }
        };
    }
    pdfParseWarningSuppressionDepth++;

    try {
        return await operation();
    } finally {
        pdfParseWarningSuppressionDepth--;
        if (pdfParseWarningSuppressionDepth === 0) {
            console.warn = originalConsoleWarn;
            console.error = originalConsoleError;
        }
    }
};

/**
 * Reads a PDF file and extracts its text content.
 * @param filePath Full path to the PDF file
 * @returns Promise<string> The extracted text content
 */
export async function extractTextFromPdf(filePath: string): Promise<string> {
    try {
        logger.info(`[pdf-util.extractTextFromPdf] - Reading PDF file: ${filePath}`);
        const data = await fs.readFile(filePath);
        const pdfData = await suppressPdfParseWarnings(async () => pdfParse(data));
        return pdfData.text;
    } catch (e) {
        throw new Error(`[pdf-util.extractTextFromPdf] - Error reading PDF file: ${filePath}.\n${e}`);
    }
}

/**
 * Reads a PDF file from a folder structure and extracts its text content.
 * @param folderName relative path to the PDF file within the download folder (ex: `${policyId}`)
 * @param fileName Name of the PDF file to check
 * @param downloadFolder Base download folder (defaults to 'download')
 * @returns Promise<string> The extracted text content
 */
export async function getTextPDF(folderName: string, fileName: string, downloadFolder: string = 'download'): Promise<string> {
    const filePath = path.join(downloadFolder, folderName, fileName);
    return extractTextFromPdf(filePath);
}

/**
 * Extracts a currency amount associated with a label from PDF text.
 * @param pdfText Extracted PDF text
 * @param label Currency label to find
 * @returns The parsed currency amount
 */
export function getCurrencyAmountFromPdf(pdfText: string, label: string): number {
    const escapedLabel = label
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\s+/g, '\\s+');

    const flexibleLabelPattern = new RegExp(
        `(?:premium\\s+)?${escapedLabel}\\s*:?\\s*[-(]?\\s*\\$?\\s*([\\d,]+\\.\\d{2})`,
        'i'
    );

    const directLabelPattern = new RegExp(
        `${escapedLabel}\\s*:?\\s*[-(]?\\s*\\$?\\s*([\\d,]+\\.\\d{2})`,
        'i'
    );

    const match = pdfText.match(flexibleLabelPattern) ?? pdfText.match(directLabelPattern);

    if (!match) {
        throw new Error(`[pdf-util.getCurrencyAmountFromPdf] - ${label} amount was not found in declaration PDF`);
    }

    return Number(match[1].replace(/,/g, ''));
}

/**
 * Extracts the multi-pet discount amount from PDF text.
 * @param pdfText Extracted PDF text
 * @returns The absolute parsed discount amount
 */
export function getMultiPetDiscountAmountFromPdf(pdfText: string): number {
    const patterns = [
        /multiple\s+pet\s+discount\s*:?\s*[-(]?\s*\$?\s*([\d,]+\.\d{2})/i,
        /multi(?:ple)?\s*[- ]?\s*pet\s*discount\s*:?\s*[-(]?\s*\$?\s*([\d,]+\.\d{2})/i,
        /multi(?:ple)?\s+pet\s+discount\s*:?\s*[-(]?\s*\$?\s*([\d,]+\.\d{2})/i
    ];

    for (const pattern of patterns) {
        const match = pdfText.match(pattern);
        if (match) {
            return Math.abs(Number(match[1].replace(/,/g, '')));
        }
    }

    throw new Error('[pdf-util.getMultiPetDiscountAmountFromPdf] - Multi-pet discount amount was not found in declaration PDF');
}

/**
 * Checks if the PDF from folder structure contains the given text
 * @param folderName relative path to the PDF file within the download folder (ex: `${policyId}`)
 * @param fileName Name of the PDF file to check
 * @param searchText Text to search for in the PDF
 * @param downloadFolder Base download folder (defaults to 'download')
 * @returns Promise<boolean> True if text is found, false otherwise
 */
export async function pdfContainsText(
    folderName: string,
    fileName: string,
    searchText: string | string[],
    downloadFolder: string = 'download'
): Promise<boolean> {
    const searchList = Array.isArray(searchText) ? searchText : [searchText];
    logger.info(`[pdf-util.pdfContainsText] - Checking PDF file in folder: ${folderName}, file: ${fileName} for texts: ${searchList.join(', ')}`);
    const filePath = path.join(downloadFolder, folderName, fileName);
    try {
        const extractedText = await extractTextFromPdf(filePath);
        // Return true only if ALL provided search strings are present in the extracted text
        return searchList.every(s => extractedText.includes(s));
    } catch (e) {
        logger.error(`[pdf-util.pdfContainsText] - Error checking PDF: ${e}`);
        return false;
    }
}

/**
 * Collapses whitespace/line breaks into single spaces and trims leading/trailing whitespace.
 * @param text Text to normalize
 * @returns Normalized text
 */
function normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}

/**
 * Checks if the PDF from folder structure contains the given text, ignoring whitespace/line
 * break differences. Useful for long sentences that may wrap across multiple lines in the PDF.
 * @param folderName relative path to the PDF file within the download folder (ex: `${policyId}`)
 * @param fileName Name of the PDF file to check
 * @param searchText Text to search for in the PDF
 * @param downloadFolder Base download folder (defaults to 'download')
 * @returns Promise<boolean> True if text is found, false otherwise
 */
export async function pdfContainsTextNormalized(
    folderName: string,
    fileName: string,
    searchText: string | string[],
    downloadFolder: string = 'download'
): Promise<boolean> {
    const searchList = Array.isArray(searchText) ? searchText : [searchText];
    logger.info(`[pdf-util.pdfContainsTextNormalized] - Checking PDF file in folder: ${folderName}, file: ${fileName} for texts: ${searchList.join(', ')}`);
    const filePath = path.join(downloadFolder, folderName, fileName);
    try {
        const extractedText = await extractTextFromPdf(filePath);
        const normalizedText = normalizeWhitespace(extractedText);
        return searchList.every(s => normalizedText.includes(normalizeWhitespace(s)));
    } catch (e) {
        logger.error(`[pdf-util.pdfContainsTextNormalized] - Error checking PDF: ${e}`);
        return false;
    }
}
