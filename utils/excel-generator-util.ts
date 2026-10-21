import * as XLSX from 'xlsx';
import { logger } from './logger-util';

export class ExcelGeneratorUtil {
    /**
     * Generates an Excel workbook from JSON data and saves it to a file.
     * @param {any[]} data - Array of objects representing rows of data.
     * @param {string} sheetName - Name of the worksheet.
     * @param {string} filePath - Path where the Excel file will be saved.
     */
    public static generateWorkbook(data: any[], sheetName: string, filePath: string): void {
        try {
            logger.info(`[ExcelGeneratorUtil.generateWorkbook] - Creating workbook with ${data.length} rows`);

            // Create a new workbook
            const workbook = XLSX.utils.book_new();

            // Convert JSON data to worksheet
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Append worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            // Write workbook to file
            XLSX.writeFile(workbook, filePath);

            logger.info(`[ExcelGeneratorUtil.generateWorkbook] - Excel file successfully created at: ${filePath}`);
        } catch (e: any) {
            throw new Error(`[ExcelGeneratorUtil.generateWorkbook] - Failed to generate Excel file: ${e.message}`);
        }
    }

    /**
     * Generates an Excel workbook from array of arrays (rows) and saves it to a file.
     * @param {any[][]} data - Array of arrays representing rows of data (including header row).
     * @param {string} sheetName - Name of the worksheet.
     * @param {string} filePath - Path where the Excel file will be saved.
     */
    public static generateWorkbookFromArray(data: any[][], sheetName: string, filePath: string): void {
        try {
            logger.info(`[ExcelGeneratorUtil.generateWorkbookFromArray] - Creating workbook with ${data.length} rows`);

            // Create a new workbook
            const workbook = XLSX.utils.book_new();

            // Convert array of arrays to worksheet
            const worksheet = XLSX.utils.aoa_to_sheet(data);

            // Append worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            // Write workbook to file
            XLSX.writeFile(workbook, filePath);

            logger.info(`[ExcelGeneratorUtil.generateWorkbookFromArray] - Excel file successfully created at: ${filePath}`);
        } catch (e: any) {
            throw new Error(`[ExcelGeneratorUtil.generateWorkbookFromArray] - Failed to generate Excel file: ${e.message}`);
        }
    }
}
