import * as XLSX from 'xlsx';
import { logger } from './logger-util';

export class ExcelWriterUtil {
    private workbook: XLSX.WorkBook;
    private sheet: XLSX.WorkSheet;
    private filePath: string;

    /**
     * Constructor to open an existing Excel file
     * @param filePath path to the Excel file
     */
    constructor(filePath: string) {
        this.filePath = filePath;
        try {
            logger.info(`[ExcelWriterUtil.constructor] - Opening Excel file: [${filePath}]`);
            this.workbook = XLSX.readFile(filePath);
            this.sheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
        } catch (e: any) {
            throw new Error(`[ExcelWriterUtil.constructor] - Error opening Excel file: [${filePath}] - ${e.message}`);
        }
    }

    /**
     * Select a sheet by name or first sheet if not found
     * @param sheetName name of the sheet or undefined if reading first sheet
     */
    public selectSheet(sheetName?: string): void {
        if (sheetName) {
            const sheet = this.workbook.Sheets[sheetName];
            if (!sheet) throw new Error(`[ExcelWriterUtil.selectSheet] - Sheet not found: ${sheetName}`);
            this.sheet = sheet;
            logger.info(`[ExcelWriterUtil.selectSheet] - Selected sheet: '${sheetName}'`);
        } else {
            const firstSheetName = this.workbook.SheetNames[0];
            this.sheet = this.workbook.Sheets[firstSheetName];
            logger.info(`[ExcelWriterUtil.selectSheet] - Selected first sheet: '${firstSheetName}'`);
        }
    }

    /**
     * Get the index of a column by its name
     * @param columnName name of the column
     * @returns column index or -1 if not found
     */
    public getColumnIndexByName(columnName: string): number {
        const range = XLSX.utils.decode_range(this.sheet['!ref'] as string);
        const headerRow = range.s.r;
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
            const cell = this.sheet[cellAddress];
            if (cell && String(cell.v) === columnName) {
                return col;
            }
        }
        return -1;
    }

    /**
     * Write a value to a cell by column name and row index (1-based row)
     * @param columnName name of the column
     * @param rowIndex 1-based row index
     * @param value value to set
     */
    public writeCell(columnName: string, rowIndex: number, value: string): void {
        const colIdx = this.getColumnIndexByName(columnName);
        if (colIdx === -1) throw new Error(`[ExcelWriterUtil.writeCell] - Column '${columnName}' not found.`);
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex - 1, c: colIdx });
        logger.info(`[ExcelWriterUtil.writeCell] - Writing value '${value}' to cell [${cellAddress}] (Column: '${columnName}', Row: ${rowIndex})`);
        this.sheet[cellAddress] = { t: 's', v: value };

        // Store the decoded range to avoid redundant parsing
        const currentRange = XLSX.utils.decode_range(this.sheet['!ref'] as string);
        this.sheet['!ref'] = XLSX.utils.encode_range({
            s: { r: 0, c: 0 },
            e: {
                r: Math.max(rowIndex - 1, currentRange.e.r),
                c: Math.max(colIdx, currentRange.e.c)
            }
        });
    }

    /**
     * Clears all cell values in a specific row using header columns.
     * @param rowIndex 1-based row index to clear
     */
    public clearRowByHeaders(rowIndex: number): void {
        logger.info(`[ExcelWriterUtil.clearRowByHeaders] - Clearing all cell values in row ${rowIndex} using header columns.`);
        const range = XLSX.utils.decode_range(this.sheet['!ref'] as string);
        const headerRow = range.s.r;
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddressHeader = XLSX.utils.encode_cell({ r: headerRow, c: col });
            const headerCell = this.sheet[cellAddressHeader];
            if (headerCell && headerCell.v) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex - 1, c: col });
                if (this.sheet[cellAddress]) {
                    logger.info(`[ExcelWriterUtil.clearRowByHeaders] - Deleting cell [${cellAddress}] (Column: '${headerCell.v}', Row: ${rowIndex})`);
                    delete this.sheet[cellAddress];
                }
            }
        }
    }

    /**
     * Save changes to the Excel file
     */
    public save(): void {
        try {
            logger.info(`[ExcelWriterUtil.save] - Saving Excel file to: [${this.filePath}]`);
            XLSX.writeFile(this.workbook, this.filePath);
            logger.info(`[ExcelWriterUtil.save] - Successfully saved Excel file: [${this.filePath}]`);
        } catch (e: any) {
            throw new Error(`[ExcelWriterUtil.save] - Error saving Excel file: ${e.message}`);
        }
    }
}
