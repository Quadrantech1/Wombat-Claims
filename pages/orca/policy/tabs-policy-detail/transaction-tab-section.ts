import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export enum FinanceActions {
    IssueInvoiceCreditMemo = 'Issue Invoice / Credit Memo',
    MoveMoney = 'Move Money',
    ApplyCheckPayment = 'Apply Check Payment',
    ForceGenerateInvoices = 'Force Generate Invoices',
    RecordChargeback = 'Record Chargeback'
}

export class TransactionTabSection extends BasePage {
    /**
     * Transaction table.
     * Columns: CP ID | Transaction Type | Payment Type | Description | Created On | Amount | Balance
     */
    transactionTypeTable = new Table(
        this.page,
        "//div[@id='trans-table']/table[@id='transactions-table']",
        ['CP ID', 'Transaction Type', 'Payment Type', 'Description', 'Created On', 'Amount', 'Balance'] as const
    );
    invoiceDetailsTable = new Table(this.page, "//div[@id='dialog-content']//table[@id='transactions-table']");

    // Links
    certificateInvoiceLink = new Link(this.page, "//a[contains(text(),'Certificate Invoice')]");
    certificateCreditLink = new Link(this.page, "//a[contains(text(),'Certificate Credit')]");

    // Labels
    totalBalanceTransactionTable = new Label(this.page, "//table[@id='transactions-table']//strong[contains(text(), 'Balance:')]/../following-sibling::td");

    // Buttons
    closeInvoiceDetailsButton = new Button(this.page, "//*[@id='dialog-content']//button[@class='btn btn-inverse']");
    actionsButton = new Button(this.page, "//div[@id='transactions']//a[contains(text(),'Actions')]");
    generateInvoicesButton = new Button(this.page, "//button[contains(text(),'Generate Invoices')]");
    saveButton = new Button(this.page, "//div[@id='dialog'] //button[contains(normalize-space(), 'Save')]");

    // Selects
    coveragePeriodIdSelect = new Select(this.page, "//*[@id='CoveragePeriodId']");

    /**
     * Returns a button within the Actions dropdown by its visible action name.
     * @param actionName Visible text of the action option.
     */
    getActionByActionName(actionName: FinanceActions): Button {
        return new Button(this.page, `//div[@id='transactions']//a[contains(text(),'Actions')]/following-sibling::ul//a[contains(text(),'${actionName}')]`);
    }

    /**
     * Inputs an amount in the textbox located in the row that contains the provided description.
     * @param description Row cell text used to identify the row.
     * @param amount Amount string to set.
     */
    async inputAmountInTextBox(description: string, amount: string): Promise<void> {
        logger.info(`[TransactionTabSection.inputAmountInTextBox] - Setting amount '${amount}' for description '${description}'`);
        const textBox = new TextBox(this.page, `//td[contains(text(), '${description}')]/..//input[@type='text']`);
        await textBox.clear();
        await textBox.setText(amount);
    }

    /**
     * Gets the latest (last) transaction row matching the given transactionType and returns the text in the specified column (by header name).
     * @param transactionType Transaction type text used to locate matching rows.
     * @param columnName Header name whose column value should be returned.
     */
    async getPaymentCaptureLatestTransaction(transactionType: string, columnName: string): Promise<string> {
        logger.info(`[TransactionTabSection.getPaymentCaptureLatestTransaction] - Getting latest '${transactionType}' value for column '${columnName}'`);
        const columnPosition = await this.getColumnIndexByHeader(columnName);
        if (columnPosition === -1) {
            throw new Error(`[TransactionTabSection.getPaymentCaptureLatestTransaction] - Column '${columnName}' not found`);
        }
        const cellLabel = new Label(this.page, `(//tr[.//td[normalize-space(text()) = '${transactionType}']])[last()]/td[${columnPosition}]`);
        return await cellLabel.getText();
    }

    /**
     * Processes values that might contain comparison operators (> or <) and applies specific arithmetic rules.
     * Example inputs: "> 120.00" or "< 150".
     *  - If starts with '>' => returns original * -1.1 (negative, 10% more)
     *  - If starts with '<' => returns original * -0.9 (negative, 10% less)
     * Otherwise returns the trimmed original value.
     * @param value Raw input string.
     * @returns Processed value as string with 2 decimal places when transformed.
     */
    processValueWithOperators(value: string): string {
        logger.info(`[TransactionTabSection.processValueWithOperators] - Processing value '${value}'`);
        const processedValue = value.trim();

        const format = (num: number) => num.toFixed(2);

        if (processedValue.startsWith('>')) {
            const variableName = processedValue.substring(1).trim();
            const originalAmount = parseFloat(variableName);
            return format(originalAmount * -1.1);
        }
        if (processedValue.startsWith('<')) {
            const variableName = processedValue.substring(1).trim();
            const originalAmount = parseFloat(variableName);
            return format(originalAmount * -0.9);
        }
        return processedValue;
    }

    /**
     * Helper to derive 1-based column index for a given header name within the transactionTypeTable.
     * Performs exact match after trimming header cell text.
     * @param headerName Name of the header to search.
     * @returns 1-based index or -1 if not found.
     */
    private async getColumnIndexByHeader(headerName: string): Promise<number> {
        logger.info(`[TransactionTabSection.getColumnIndexByHeader] - Searching for header '${headerName}'`);
        const headerCells = this.transactionTypeTable.getLocator().locator('thead tr th');
        const count = await headerCells.count();
        for (let i = 0; i < count; i++) {
            const text = (await headerCells.nth(i).innerText()).trim();
            if (text === headerName) {
                return i + 1; // convert to 1-based index
            }
        }
        logger.warning(`[TransactionTabSection.getColumnIndexByHeader] - Header '${headerName}' not found among ${count} headers`);
        return -1;
    }
}
