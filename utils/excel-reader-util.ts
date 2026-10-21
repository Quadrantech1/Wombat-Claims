import * as XLSX from 'xlsx';
import { logger } from './logger-util';

export class ExcelReaderUtil {
    private workbook: XLSX.WorkBook | null = null;
    private sheet: XLSX.WorkSheet | null = null;
    private headers: string[] = [];
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    /**
     * Loads the workbook and selects the first sheet or a specific sheet by name.
     * Extracts headers from the selected sheet.
     * @param {string} [sheetName] - Optional name of the sheet to select.
     * @throws Will throw an error if the file or sheet cannot be loaded.
     */
    public load(sheetName?: string): void {
        try {
            logger.info(`[ExcelReaderUtil.load] - Reading Excel file: [${this.filePath}]`);
            this.workbook = XLSX.readFile(this.filePath);
            if (sheetName) {
                this.sheet = this.workbook.Sheets[sheetName];
                if (!this.sheet) throw new Error(`[ExcelReaderUtil.load] - Sheet not found: ${sheetName}`);
                logger.info(`[ExcelReaderUtil.load] - Selected sheet: '${sheetName}'`);
            } else {
                const firstSheetName = this.workbook.SheetNames[0];
                this.sheet = this.workbook.Sheets[firstSheetName];
                logger.info(`[ExcelReaderUtil.load] - Selected first sheet: '${firstSheetName}'`);
            }
            this.extractHeaders();
        } catch (e: any) {
            throw new Error(`[ExcelReaderUtil.load] - Failed to process excel file: ${e.message}`);
        }
    }

    /**
     * Extracts headers from the first row of the selected sheet.
     * Populates the headers property with column names.
     * @private
     */
    private extractHeaders(): void {
        if (!this.sheet) return;
        const range = XLSX.utils.decode_range(this.sheet['!ref'] as string);
        const headerRow = range.s.r;
        this.headers = [];
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
            const cell = this.sheet[cellAddress];
            this.headers.push(cell ? String(cell.v) : '');
        }
    }

    /**
     * Gets the value of a cell by column name and row index (1-based).
     * @param {string} columnName - The name of the column.
     * @param {number} row - The 1-based row index.
     * @returns {string} The cell value, or empty string if the cell is empty.
     * @throws Will throw an error if the sheet is not loaded or column is not found.
     */
    public getValue(columnName: string, row: number): string {
        if (!this.sheet) throw new Error('[ExcelReaderUtil.getValue] - Sheet not loaded');
        logger.info(`[ExcelReaderUtil.getValue] - Getting value for column: '${columnName}', row: ${row}`);
        const colIdx = this.headers.indexOf(columnName);
        if (colIdx === -1) throw new Error(`[ExcelReaderUtil.getValue] - Column not found: ${columnName}`);
        const cellAddress = XLSX.utils.encode_cell({ r: row - 1, c: colIdx });
        const cell = this.sheet[cellAddress];
        const value = cell ? String(cell.v) : '';
        logger.info(`[ExcelReaderUtil.getValue] - Cell address: [${cellAddress}], Value: '${value}'`);
        return value;
    }

    /**
     * Gets all column headers from the selected sheet.
     * @returns {string[]} Array of header names.
     */
    public getHeaders(): string[] {
        logger.info(`[ExcelReaderUtil.getHeaders] - Returning headers: ${JSON.stringify(this.headers)}`);
        return this.headers;
    }

    /**
     * Converts the loaded sheet to JSON format.
     * @returns {any[]} Array of objects representing the sheet data.
     * @throws Will throw an error if the sheet is not loaded.
     */
    public convertToJson(): any[] {
        if (!this.sheet) throw new Error('[ExcelReaderUtil.convertToJson] - Sheet not loaded');
        logger.info(`[ExcelReaderUtil.convertToJson] - Converting sheet to JSON format`);
        const jsonData = XLSX.utils.sheet_to_json(this.sheet);
        logger.info(`[ExcelReaderUtil.convertToJson] - Converted ${jsonData.length} rows to JSON`);
        return jsonData;
    }

    /**
     * Clears workbook, sheet, and headers references from the instance.
     * Useful for resetting the reader to load a new file or sheet.
     */
    public clearExcelReferences(): void {
        logger.info(`[ExcelReaderUtil.clearExcelReferences] - Clearing workbook, sheet, and headers references.`);
        this.workbook = null;
        this.sheet = null;
        this.headers = [];
    }
}