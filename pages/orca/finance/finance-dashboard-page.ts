import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class FinanceDashboardPage extends BasePage {
    generateInvoicesLink = new Link(this.page, "//a[contains(.,'Generate Invoices')]");
    updateBillingInfoLink = new Link(this.page, "//a[contains(.,'Update Billing Info')]");
    runTransactionsLink = new Link(this.page, "//a[contains(.,'Run Transactions')]");
    transactionHistoryLink = new Link(this.page, "//a[contains(.,'Transaction History')]");
    policyPendingActionLink = new Link(this.page, "//a[contains(.,'Policies Pending Action')]");
    brokerCommissionsLink = new Link(this.page, "//a[contains(.,'Broker Commissions')]");
    affiliateEarningsLink = new Link(this.page, "//a[contains(.,'Affiliate Earnings')]");
    renewPoliciesLink = new Link(this.page, "//a[contains(.,'Renew Policies')]");
    downloadAchResponseFilesLink = new Link(this.page, "//a[contains(.,'Download ACH Response Files')]");
    pendingAchReturnInformationLink = new Link(this.page, "//a[contains(.,'Pending ACH Return Information')]");
    premiumRefundChecksLink = new Link(this.page, "//a[contains(.,'Premium Refund Checks')]");
    checkManagementLink = new Link(this.page, "//a[contains(text(),'Check Management')]");
    renewByPolicy = new Link(this.page, "//a[contains(text(),'Renew By Policy')]");
    filterByStatusSelect = new Select(this.page, "//select[@id='ddlStatus']");
    resultFinanceTable = new Table(this.page, '//table[@id="pending-policies"]');
    transactionsToRunTextbox = new TextBox(this.page, "#transactionsToRun");
    submitAllCheckbox = new Checkbox(this.page, "#allCheckbox");
    paymentTypeSelect = new Select(this.page, "//select[@id='PaymentTypeId']");
    underWriterSelect = new Select(this.page, "//select[@id='UnderwriterId']");
    paymentProviderSelect = new Select(this.page, "#PaymentProviderId");
    submitButton = new Button(this.page, "//div[@class='well']//button[@type='submit']");
    commitCheckbox = new Checkbox(this.page, "#chkCommit");
    runTransactionsResultTable = new Table(this.page, "//div[@id='search-results']/table");
}
