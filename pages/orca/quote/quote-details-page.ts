import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { AlertSection } from '../common-section/alert-section';

export class QuoteDetailsPage extends BasePage {
  petTableMakeChangesButton = new Button(this.page, "a#btn-edit-coverage");
  plusButton = new Button(this.page, "div.plus");
  covPetDetailsTable = new Table(this.page, "table.table-striped.table-bordered.coverages");
  coverageDetailsTable = new Table(this.page, "table.table-striped.table-bordered");
  /**
   * Coverage Summary table.
   * Columns: Product Name | Incident Limit | Deductible | Deductible Frequency | Coinsurance | Coverage Limit | Option | Premiums
   */
  coverageSummaryTable = new Table(
    this.page,
    "td[id$='-summary'] table.table.table-striped.table-bordered",
    ['Product Name', 'Incident Limit', 'Deductible', 'Deductible Frequency', 'Coinsurance', 'Coverage Limit', 'Option', 'Premiums'] as const
  );

  saveButton = new Button(this.page, "#quote-actions button:has-text('Save'):not(:has-text('policy'))");
  returnToPolicyButton = new Button(this.page, "#quote-actions a:has-text('Return to Policy')");

  addPetButton = new Button(this.page, "a:has-text('Add Pet')");
  newPetOption = new Button(this.page, "a:has-text('New Pet')");
  existingPetOption = new Button(this.page, "a:has-text('Existing Pet')");
  groupDropDown = new Select(this.page, "#affinity-group-select");

  saveQuoteToPolicy = new Button(this.page, "#createQuoteBtn");
  productNameInCoverageSummaryTableLabel = new Label(this.page, "//strong[text()='AccidentCare' or text()='CompanionCare']");

  alertSection = new AlertSection(this.page);
  /**
   * Clicks the Cancel Coverage button in the row for the given pet name.
   * @param petNameInTable Pet name as shown in the table
   */
  async clickCancelButtonInRow(petNameInTable: string): Promise<void> {
    logger.info(`[QuoteDetailsPage.clickCancelButtonInRow] - Clicking Cancel Coverage for pet: ${petNameInTable}`);
    const rowCancelLocator = this.page.locator(
      `xpath=//tr[.//td//div//div[normalize-space(text())='${petNameInTable}']]//a[contains(normalize-space(.),'Cancel Coverage')]`
    );
    await new Button(this.page, rowCancelLocator).waitForVisible();
    await new Button(this.page, rowCancelLocator).click();
  }

  /**
   * Gets the message in the row for the given pet name.
   * @param petNameInTable Pet name as shown in the table
   */
  async getMessageInPetNameRow(petNameInTable: string): Promise<string> {
    logger.info(`[QuoteDetailsPage.getMessageInPetNameRow] - Getting message for pet: ${petNameInTable}`);
    return await new Label(this.page, `//td/div/div[contains(.,'${petNameInTable}')]//strong`).getText();
  }

  /**
   * Gets the premium value for a newly added pet by row index (1-based).
   * @param row Row index (1-based)
   */
  async getPremiumValueForNewAddedPets(row: number): Promise<string> {
    logger.info(`[QuoteDetailsPage.getPremiumValueForNewAddedPets] - Getting premium value for row: ${row}`);
    return await new Label(this.page, `(//tr[contains(@id,'coverage')]/td[contains(text(),'/ mo')])[${row}]`).getText();
  }

  /**
   * Clicks the Make Changes button in the given row (1-based).
   * @param row Row index (1-based)
   */
  async clickMakeChangesButtonInRow(row: number): Promise<void> {
    logger.info(`[QuoteDetailsPage.clickMakeChangesButtonInRow] - Clicking Make Changes for row: ${row}`);
    await new Button(this.page, `(//a[@id="btn-edit-coverage"])[${row}]`).click();
  }

  /**
   * Clicks the Make Changes button in the coverage period table for the given pet name.
   * @param petName Pet name as shown in the table
   */
  async clickMakeChangesButtonInCoveragePeriodTable(petName: string): Promise<void> {
    logger.info(`[QuoteDetailsPage.clickMakeChangesButtonInCoveragePeriodTable] - Clicking Make Changes for pet: ${petName}`);
    await new Button(this.page, `//td[contains(.,'${petName}')]/..//a[@title='Make Changes']`).click();
  }

  /**
   * Clicks the plus (expand) toggle for the given pet name within the coverage period table row.
   * Uses a scoped CSS selector with :has() to find the correct row by pet name.
   * @param petName Pet name as displayed in the UI
   */
  async clickPlusByPetNameInCoveragePeriodTable(petName: string): Promise<void> {
    logger.info(`[QuoteDetailsPage.clickPlusByPetNameInCoveragePeriodTable] - Clicking plus toggle for pet: ${petName}`);
    const plusButton = new Button(this.page, `.row-fluid:has(.span11:has-text("${petName}")) .toggle.plus`);
    await plusButton.click();
  }

}
