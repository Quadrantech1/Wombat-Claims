import { Locator, Page } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { ControlBase } from './control-base';
import { TextBox } from './textbox';

/**
 * Wrapper for interacting with HTML tables (tbody rows/tds) on the page.
 * Provides helpers to set inputs/selects, click checkboxes/links and search for values in cells.
 */
export class Table extends ControlBase {
    async clickFirstRow(): Promise<void> {
        logger.info(`[Table>clickFirstRow] Clicking first row of table`);
        await this.locator.locator('tbody tr').first().locator('a').first().click();
    }
    private readonly headers?: readonly string[];

    /**
     * Create a new Table helper.
     * @param page Playwright Page instance.
     * @param selectorOrLocator CSS selector string or Playwright Locator for the table root element.
     * @param headers Optional array of column header names for simplified row verification.
     */
    constructor(page: Page, selectorOrLocator: string | Locator, headers?: readonly string[]) {
        super(page, selectorOrLocator);
        this.headers = headers;
    }

    /**
     * Get all table header texts from thead th elements.
     * @returns Array of header texts (trimmed).
     */
    public async getTableHeaders(): Promise<string[]> {
        logger.info(`[Table>getTableHeaders] Getting all table headers`);
        const thead = this.locator.locator('thead');
        const headerRow = thead.locator('tr').first();
        const headers = headerRow.locator('th');
        const headerTexts = await headers.allTextContents();
        const result = headerTexts.map(text => text.trim());
        logger.info(`[Table>getTableHeaders] Found headers: ${result.join(', ')}`);
        return result;
    }

    /**
     * Click into a text input within a table cell and use the TextBox.selectTextOption helper.
     * @param column 1-based column index of the target cell.
     * @param row 1-based row index of the target cell.
     * @param initialValue The initial visible text to match when selecting the option.
     * @param finalValue The final value to select.
     */
    async setTextSelect(column: number, row: number, initialValue: string, finalValue: string): Promise<void> {
        logger.info(`[Table>setTextSelect] Setting text select in table at column: ${column}, row: ${row} with initial value: ${initialValue} and final value: ${finalValue}`);
        const tbody = this.locator.locator('tbody');
        const targetRow = tbody.locator('tr').nth(row - 1);
        const cell = targetRow.locator('td').nth(column - 1);
        const textInput = cell.locator('input[type="text"]');
        const cellTextBox = new TextBox(this.page, textInput);
        await cellTextBox.click();
        await cellTextBox.selectTextOption(initialValue, finalValue);
    }

    /**
     * Set the value of a text input inside a table cell.
     * @param column 1-based column index.
     * @param row 1-based row index.
     * @param value Text to type into the input.
     */
    public async setTextTable(column: number, row: number, value: string): Promise<void> {
        logger.info(`[Table>setText] Setting text in table at column: ${column}, row: ${row} with value: ${value}`);
        const tbody = this.locator.locator('tbody');
        const targetRow = tbody.locator('tr').nth(row - 1);
        const cell = targetRow.locator('td').nth(column - 1);
        const textInput = cell.locator('input[type="text"]');
        await textInput.fill(value);
    }

    /**
     * Select a value in a <select> control inside a table cell.
     * @param column 1-based column index.
     * @param row 1-based row index.
     * @param value The option value to select.
     */
    async select(column: number, row: number, value: string): Promise<void> {
        logger.info(`[Table>select] Selecting value in table at column: ${column}, row: ${row} with value: ${value}`);
        const tbody = this.locator.locator('tbody');
        const targetRow = tbody.locator('tr').nth(row - 1);
        const cell = targetRow.locator('td').nth(column - 1);
        const selectElement = cell.locator('select');
        await selectElement.selectOption(value);
    }

    /**
     * Click a control inside a table cell. Supported types: 'link', 'checkbox', 'button'.
     * @param column 1-based column index
     * @param row 1-based row index
     * @param type control type: 'link' | 'checkbox' | 'button'
     */
    public async clickTableCell(column: number, row: number, type: 'link' | 'checkbox' | 'button'): Promise<void> {
        logger.info(`[Table>clickTableCell] Clicking ${type} at column: ${column}, row: ${row}`);

        const tbody = this.locator.locator('tbody');
        const targetRow = tbody.locator('tr').nth(row - 1);
        const cell = targetRow.locator('td').nth(column - 1);

        let element: Locator;
        switch (type) {
            case 'link':
                element = cell.locator('a');
                break;
            case 'checkbox':
                element = cell.locator('input');
                break;
            case 'button':
                element = cell.locator('button');
                break;
            default:
                throw new Error(`[Table>clickTableCell] Unsupported control type: ${type}`);
        }

        await element.click();
    }

    /**
     * Select the first option in a <select> control inside a table cell.
     * Skips the first option (index 0) and selects the second option (index 1).
     * @param column 1-based column index.
     * @param row 1-based row index.
     */
    public async selectFirstValue(column: number, row: number): Promise<void> {
        logger.info(`[Table>selectFirstValue] Selecting first value in table at column: ${column}, row: ${row}`);
        const tbody = this.locator.locator('tbody');
        const targetRow = tbody.locator('tr').nth(row - 1);
        const cell = targetRow.locator('td').nth(column - 1);
        const selectElement = cell.locator('select');
        await selectElement.click();
        await selectElement.selectOption({ index: 1 });
        logger.info(`[Table>selectFirstValue] Selected option at index 1 (second option)`);
    }

    /**
     * Find a cell that contains the given text and click the first anchor (<a>) inside it.
     * Throws an error if no clickable link is found for the provided value.
     * @param value Text to search for inside each cell.
     */
    public async clickOnLinkCell(value: string): Promise<this> {
        logger.info(`[Table>clickOnLinkCell] Clicking on link cell with value: ${value}`);
        const tbody = this.locator.locator('tbody');
        const rows = tbody.locator('tr');
        const rowCount = await rows.count();
        let isClicked = false;

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const columns = row.locator('td');
            const columnCount = await columns.count();

            for (let j = 0; j < columnCount; j++) {
                const column = columns.nth(j);
                const cellValue = await column.textContent();
                if (cellValue?.includes(value)) {
                    const link = column.locator('a');
                    if (await link.count() > 0) {
                        await link.click();
                        logger.info(`[Table>clickOnLinkCell] Successfully clicked on link in cell with value: ${value}`);
                        isClicked = true;
                        break;
                    }
                }
            }

            if (isClicked) {
                break;
            }
        }

        if (!isClicked) {
            throw new Error(`[Table>clickOnLinkCell] The cell with value [${value}] was not found in the table or does not contain a clickable link`);
        }

        return this;
    }


    public async doubleClickOnLinkCell(rowIndex: number, columnIndex: number): Promise<this> {
        logger.info(`[Table>doubleClickOnLinkCell] Double-clicking on link cell at row: ${rowIndex}, column: ${columnIndex}`);
        const cell = this.locator.locator(`xpath=./tbody/tr[${rowIndex}]/td[${columnIndex}]`);
        await cell.dblclick();
        return this;
    }


    /**
     * Get the number of rows in the table body.
     * @returns The count of tbody tr elements.
     */
    public async getRowCount(): Promise<number> {
        const rows = this.locator.locator('tbody tr');
        const count = await rows.count();
        logger.info(`[Table>getRowCount] Table has ${count} rows`);
        return count;
    }

    /**
     * Get the column position (1-based index) by searching for a header value.
     * @param headerValue The text value of the header to find.
     * @returns The 1-based column position, or 0 if not found.
     */
    public async getPositionColumn(headerValue: string): Promise<number> {
        logger.info(`[Table>getPositionColumn] Searching for header: ${headerValue}`);
        const thead = this.locator.locator('thead');
        const rows = thead.locator('tr');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const columns = row.locator('th');
            const columnCount = await columns.count();
            logger.info(`[Table>getPositionColumn] Row ${i + 1} has ${columnCount} columns`);

            for (let j = 0; j < columnCount; j++) {
                const column = columns.nth(j);
                const cellValue = (await column.textContent())?.trim() || '';
                const position = j + 1;
                logger.info(`[Table>getPositionColumn] Position ${position}, cell value: ${cellValue}`);

                if (cellValue === headerValue) {
                    logger.info(`[Table>getPositionColumn] Found header '${headerValue}' at position ${position}`);
                    return position;
                }
            }
        }

        logger.info(`[Table>getPositionColumn] Header '${headerValue}' not found`);
        return 0;
    }

    /**
     * Get the row position (1-based index) by searching for a cell value in the tbody.
     * Returns 0 if not found.
     * @param value Text to search for in table cells.
     */
    public async getPositionRow(value: string): Promise<number> {
        logger.info(`[Table>getPositionRow] Searching for value: ${value}`);
        const tbody = this.locator.locator('tbody');
        const rows = tbody.locator('tr');
        const rowCount = await rows.count();

        let rowPosition = 0;

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            rowPosition = i + 1; // 1-based
            const columns = row.locator('td');
            const columnCount = await columns.count();
            logger.info(`[Table>getPositionRow] Row ${rowPosition} has ${columnCount} columns`);

            for (let j = 0; j < columnCount; j++) {
                const column = columns.nth(j);
                const cellValue = (await column.textContent())?.trim() || '';
                logger.info(`[Table>getPositionRow] row position: ${rowPosition} value cell: ${cellValue}`);
                if (cellValue === value || cellValue.includes(value)) {
                    logger.info(`[Table>getPositionRow] Found value '${value}' at row ${rowPosition}`);
                    return rowPosition;
                }
            }
        }

        logger.info(`[Table>getPositionRow] Value '${value}' not found`);
        return 0;
    }

    /**
     * Convenience method that returns both column and row positions using existing helpers.
     * @param columnHeader header text to find column index
     * @param value value to find row index
     */
    public async getPositionColumnRow(columnHeader: string, value: string): Promise<{ column: number; row: number }> {
        const column = await this.getPositionColumn(columnHeader);
        const row = await this.getPositionRow(value);
        return { column, row };
    }

    /**
     * Get the text value from a specific cell in the table.
     * @param column 1-based column index.
     * @param row 1-based row index.
     * @returns The text content of the cell.
     */
    public async getValueCell(column: number, row: number): Promise<string> {
        logger.info(`[Table>getValueCell] Getting value from column: ${column}, row: ${row}`);
        const tbody = this.locator.locator('tbody');
        const targetRow = tbody.locator('tr').nth(row - 1);
        const cell = targetRow.locator('td').nth(column - 1);
        const text = (await cell.textContent())?.trim() || '';
        logger.info(`[Table>getValueCell] Cell value: ${text}`);
        return text;
    }

    /**
     * Check whether a value is displayed anywhere in the table body. Matching is case-sensitive.
     * @param value Text to search for in table cells.
     * @returns Promise that resolves to true when value is found, otherwise false.
     */
    public async isValueDisplayedInTable(value: string): Promise<boolean> {
        logger.info(`[Table>isValueDisplayedInTable] Checking if value is displayed in the table [${value}]`);

        // Use nested Locator APIs instead of string-manipulating the locator to avoid invalid XPath construction
        const tbody = this.locator.locator('tbody');
        logger.info(`[Table>isValueDisplayedInTable] Using nested locator for tbody`);

        const rows = tbody.locator('tr');
        const rowCount = await rows.count();

        const search = value.trim();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const columns = row.locator('td');
            const columnCount = await columns.count();

            for (let j = 0; j < columnCount; j++) {
                const column = columns.nth(j);
                const cellValueRaw = await column.textContent();
                if (!cellValueRaw) continue;
                const cellValue = cellValueRaw.trim();

                if (cellValue === search || cellValue.includes(search)) {
                    logger.info(`[Table>isValueDisplayedInTable] Found value at row ${i + 1} column ${j + 1}`);
                    return true;
                }
            }
        }

        logger.info(`[Table>isValueDisplayedInTable] Value not found: ${value}`);
        return false;
    }

    /**
     * Verify that all rows in a specific column contain the expected value.
     * @param headerName The name of the column header to verify.
     * @param expectedValue The value that should be contained in all cells of this column.
     * @param ignoreCase Whether to perform case-insensitive comparison (default: false).
     * @throws Error if any row does not contain the expected value.
     */
    public async verifyAllRowsInColumnContain(headerName: string, expectedValue: string, ignoreCase: boolean = false): Promise<void> {
        const caseSuffix = ignoreCase ? ' (case-insensitive)' : '';
        logger.info(`[Table>verifyAllRowsInColumnContain] Verifying all rows in column '${headerName}' contain '${expectedValue}'${caseSuffix}`);

        const columnIndex = await this.getPositionColumn(headerName);
        if (columnIndex === 0) {
            throw new Error(`[Table>verifyAllRowsInColumnContain] Column header '${headerName}' not found`);
        }

        const rowCount = await this.getRowCount();
        if (rowCount === 0) {
            throw new Error(`[Table>verifyAllRowsInColumnContain] No rows found in table`);
        }

        const errors: string[] = [];
        const expectedCompare = ignoreCase ? expectedValue.toLowerCase() : expectedValue;

        for (let i = 1; i <= rowCount; i++) {
            const cellValue = await this.getValueCell(columnIndex, i);
            const cellCompare = ignoreCase ? cellValue.toLowerCase() : cellValue;

            if (!cellCompare.includes(expectedCompare)) {
                errors.push(`Row ${i}: expected cell to contain '${expectedValue}'${caseSuffix}, but got '${cellValue}'`);
            }
        }

        if (errors.length > 0) {
            const message = `[Table>verifyAllRowsInColumnContain] Verification failed for column '${headerName}':\n${errors.join('\n')}`;
            logger.error(message);
            throw new Error(message);
        }

        logger.info(`[Table>verifyAllRowsInColumnContain] Successfully verified ${rowCount} rows in column '${headerName}' contain '${expectedValue}'${caseSuffix}`);
    }

    /**
     * Get the text content of a table cell by column name and row number.
     * @param columnName The header text of the column to search for.
     * @param rowNumber 1-based row index in the tbody.
     * @returns The trimmed text content of the cell, or 'null' if column not found or cell is empty.
     */
    public async getCellValueByColumn(columnName: string, rowNumber: number): Promise<string> {
        logger.info(`[Table>getCellValueByColumn] Getting column: ${columnName}, row: ${rowNumber}`);
        const headers = this.locator.locator('thead tr th');
        const headerCount = await headers.count();
        let columnIndex = -1;
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).innerText()).trim();
            if (headerText === columnName) {
                columnIndex = i;
                break;
            }
        }
        if (columnIndex === -1) {
            throw new Error(`[Table>getCellValueByColumn] Column "${columnName}" not found`);
        }
        const cell = this.locator.locator(`tbody tr:nth-child(${rowNumber}) td:nth-child(${columnIndex + 1})`);
        const value = (await cell.textContent())?.trim() ?? '';
        logger.info(`[Table>getCellValueByColumn] Found value: "${value}"`);
        return value === '' ? 'null' : value;
    }

    /**
     * Verifies table rows against expected data using header names defined in the Table constructor.
     * - Requires that headers were provided when creating the Table instance
     * - Collects all tbody tr rows and compares cell values directly
     * - If the expected value is the literal 'IGNORE', that field is skipped
     * - Matching is always substring (contains) and case-sensitive
     * 
     * Expected format: Array of arrays where each inner array represents a row's cell values
     * Example: [['val1', 'val2', 'val3'], ['val4', 'val5', 'val6']]
     * 
     * Throws an Error with aggregated mismatches if any differences are found.
     * @param expectedRows Array of arrays where each inner array contains cell values in header order
     */
    public async verifyRowsInTable(expectedRows: string[][]): Promise<void> {
        const IGNORE = 'IGNORE';

        if (!this.headers) {
            throw new Error('[Table>verifyRows] Headers must be defined in Table constructor to use verifyRowsInTable');
        }

        logger.info(`[Table>verifyRows] Verifying table with ${expectedRows.length} expected rows.`);
        logger.info(`[Table>verifyRows] Headers: ${this.headers.join(' | ')}`);

        const rowLocators = this.locator.locator('tbody tr');
        const rowCount = await rowLocators.count();
        const actualRows: string[][] = [];

        for (let r = 0; r < rowCount; r++) {
            const row = rowLocators.nth(r);
            const cells = row.locator('td');
            const cellCount = await cells.count();
            if (cellCount === 0) continue;

            const rowValues: string[] = [];
            for (let c = 0; c < cellCount; c++) {
                const txt = (await cells.nth(c).textContent()) || '';
                rowValues.push(txt.trim());
            }
            actualRows.push(rowValues);
        }

        logger.info(`[Table>verifyRows] Collected ${actualRows.length} actual data rows.`);

        const errors: string[] = [];

        for (let i = 0; i < expectedRows.length; i++) {
            const expectedRow = expectedRows[i];
            const actualRow = actualRows[i];

            if (!actualRow) {
                errors.push(`Row ${i}: missing actual row`);
                continue;
            }

            for (let col = 0; col < expectedRow.length; col++) {
                const expectedVal = expectedRow[col];
                if (expectedVal === IGNORE) continue;

                const actualVal = actualRow[col] ?? '';
                const headerName = this.headers[col] ?? `Column ${col}`;

                if (!actualVal.includes(expectedVal)) {
                    errors.push(`Row ${i} Col '${headerName}': actual='${actualVal}' does not contain expected='${expectedVal}'`);
                }
            }
        }

        if (errors.length) {
            const message = `[Table>verifyRows] Mismatches found:\n${errors.join('\n')}`;
            logger.error(message);
            throw new Error(message);
        }

        logger.info('[Table>verifyRows] Verification passed with no mismatches.');
    }
}
