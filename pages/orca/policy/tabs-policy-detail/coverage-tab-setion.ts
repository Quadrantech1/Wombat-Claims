import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { Page, expect } from '@playwright/test';
import { extractFirstAmount, extractTotalAmount } from '@utils/amounts-util';
import { logger } from '@utils/logger-util';

export class CoverageTabSection extends BasePage {
  activeLink = new Link(this.page, "//a[text()='Active']");
  upcomingLink = new Link(this.page, "//a[text()='Upcoming']");
  expiredLink = new Link(this.page, "//a[text()='Expired']");
  premiumTrackerLink = new Link(this.page, "//a[contains(text(),'Premium Tracker')]");

  activePetDetailTable = new Table(this.page, "(//*[contains(@id,'coverage') and contains (@id,'active')]//div/div/table)[1]");
  upcomingPetDetailTable = new Table(this.page, "(//div[contains(@id,'coverages') and contains(@id,'upcoming')]//div/div/table)[1]");
  pastPetDetailTable = new Table(this.page, "(//div[contains(@id,'coverages') and contains(@id,'past')]//div/div/table)[1]");
  expiredPetDetailTable = new Table(this.page, "(//div[contains(@id,'coverages') and contains(@id,'expired')]//div/div/table)[1]");
  activeSecondPetDetailTable = new Table(this.page, "//tr[@class='warning']//../parent::table");
  activateSummaryPetDetailTable = new Table(this.page, "(//*[contains(@id,'coverage') and contains (@id,'active')]//table//table)[1]");
  upcomingSummaryPetDetailTable = new Table(this.page, "//*[contains(@id,'coverage') and contains (@id,'upcoming')]//table//table");
  upcomingCoverageProductTable = new Table(this.page, "//div[contains(@id,'coverages') and contains(@id,'upcoming')]//table[ancestor::td[contains(@id,'coverage') and contains(@id,'summary')]]");
  /**
   * Product Details table.
   * Columns: Product | Benefit | Annual Limit Applied | Annual Limit Remaining
   */
  productDetailTable = new Table(
    this.page,
    "//h3[text()='Product Details']/../table",
    ['Product', 'Benefit', 'Annual Limit Applied', 'Annual Limit Remaining'] as const
  );

  activateSecondSummaryPetDetailTable = new Table(this.page, "//tr[@class='warning']//../parent::table//table");
  /**
   * Premium Tracker table.
   * Columns: CP Id | Effective On | End on | Net Premium | Billed Premium
   */
  premiumTrackerTable = new Table(
    this.page,
    "//table[@id='search-results']",
    ['CP Id', 'Effective On', 'End on', 'Net Premium', 'Billed Premium'] as const
  );

  activatedByLabel = new Label(this.page, "//div[@class='accordion-body in collapse']//div[contains(@class,'row-fluid')][contains(text(),'Activated By')]");
  resultLabel = new Label(this.page, "//div[@class='accordion-body in collapse']//div[contains(@class,'row-fluid')][contains(text(),'Sold By')]");
  pastCoverageLink = new Link(this.page, "(//a[text()='Past'])[1]");
  premiumAmountLabel = new Label(this.page, "//strong[contains(text(),'Premium Amount:')]");
  premiumActiveMontlyAmountLabel = new Label(this.page, "//div[contains(@id,'active-coverages')]//strong[contains(text(),'Premium Amount:') and contains(text(),'Service Fee')]");
  premiumActiveYearlyAmountLabel = new Label(this.page, "//div[contains(@id,'active-coverages')]//strong[contains(text(),'Premium Amount:') and contains(text(),'/yr')]");
  coveragePeriodLabel = new Label(this.page, "//h3[contains(text(),'Coverage Period')]");
  premiumUpcomingMontlyAmountLabel = new Label(this.page, "//div[contains(@id,'upcoming-coverages')]//strong[contains(text(),'Premium Amount:') and contains(text(),'Service Fee')]");
  premiumUpcomingYearlyAmountLabel = new Label(this.page, "//div[contains(@id,'upcoming-coverages')]//strong[contains(text(),'Premium Amount:') and contains(text(),'/yr')]");
  changesUpcomingLabel = new Link(this.page, "//a[contains(text(),'Upcoming')]/../../..//div[contains(text(),'Changes')]");
  coveragePeriodLink = new Link(this.page, "//div[contains(@id,'active-coverages') or contains(@id,'upcoming-coverages') ]//h3[contains(text(),'Coverage Period ')]");
  plusPetDetailButton = new Button(this.page, "(//a[text()='Active' or text()='Upcoming']/parent::*/parent::*/parent::div//div[contains(@class,'plus')])[1]");
  makeChangesUpcomingButton = new Button(this.page, this.page.getByRole('link', { name: 'Make Changes' }).first());
  makeChangesActivateButton = new Button(this.page, "//div[contains(@id,'active-coverages')]//div/a[contains(text(),'Make Changes')]");
  makeChangesOption = new Label(this.page, "//div[contains(@class,'accordion-body in')]//ul[contains(@class,'dropdown-menu')]//a[@id='btn-make-changes' or normalize-space(text())='Make Changes']");
  transferSaleOption = new Label(this.page, "//li/a[contains(text(),'Transfer Sale')]");
  /**
 * Products table.
 * Columns: Product Name | Incident Limit | Deductible | Deductible Frequency | Coinsurance | Coverage Limit | Option | Premiums
 */
  productNameTable = new Table(this.page, "//td[contains(@id,'coverage')]//table",
    ['Product Name', 'Incident Limit', 'Deductible', 'Deductible Frequency', 'Coinsurance', 'Coverage Limit', 'Option', 'Premiums'] as const
  );

  premiumTolerance = 0.05;

  viewPetDetailsTableButtonByPetName(petName: string): Button {
    return new Button(this.page, `//a[text()='${petName}']/ancestor::td//div[contains(@class, 'toggle')]`);
  }

  async clickPetNameLinkTable(petName: string): Promise<void> {
    const petNameLink = new Link(this.page, `//div[contains(@id,'coverages')]//a[text()='${petName}']`);
    await petNameLink.click();
  }

  async getTheCpId(site: string): Promise<string> {
    const cpId = new Label(this.page, `//a[text()='${site}']/../../..//span[contains(.,'CP ID')]`);
    const text = await cpId.getText();
    return text.replace('CP ID:', '').replace(' ', '').replace('MakeChanges', '').replace('\n', '').replace('Make Changes', '').trim();
  }

  /**
   * Gets the numeric CP ID shown in the given coverage section (e.g. "CP ID: 96724") of the Coverage tab.
   * @param section Coverage section link text: 'Active' or 'Upcoming'
   * @throws Error when no CP ID is found in the section text
   */
  async getCpIdBySection(section: 'Active' | 'Upcoming'): Promise<string> {
    const text = await new Label(this.page, `//a[text()='${section}']/../../..//span[contains(.,'CP ID')]`).getText();
    const cpId = text.match(/CP ID:\s*(\d+)/)?.[1];
    if (!cpId) {
      throw new Error(`[CoverageTabSection.getCpIdBySection] - CP ID was not found in ${section} coverage section text: ${text}`);
    }
    return cpId;
  }

  /**
   * Gets the cancellation detail message for a specific pet from the warning table
   * @param petName - The name of the pet
   * @returns The cancellation details text including Cancelled Effective, Reason, and Type
   */
  async getCancelDetailMessageInTable(petName: string): Promise<string> {
    const label = new Label(this.page, `//tr[@class="warning"]//div[normalize-space(text())="${petName}"]/ancestor::tr/td[last()]`);
    const text = await label.getText();
    return text.replace(/\s+/g, ' ').trim();
  }

  getAmountFromPremiumText(premiumText: string): number {
    let amount = 0;
    const textWithoutCommas = premiumText.replace(/,/g, '');
    const matches = textWithoutCommas.match(/-?\d*\.?\d+/g);
    if (matches) {
      amount = parseFloat(matches[matches.length - 1]);
    }
    return amount;
  }

  async getPremiumsValuesFromPetBasedCoverageId(coverageId: string): Promise<string> {
    const locator = `//*[@id="coverage-${coverageId}"]//*[contains(.,'mo')]`;
    const premiumValueForPet = new Label(this.page, locator);
    return await premiumValueForPet.getText();
  }

  static async checkIfPolicyTermIsDisplayedInPosition(page: Page, position: string, policyTerm: string): Promise<boolean> {
    const locator = `//div[@id='coverages-accordion'][${position}]//a[contains(text(),'${policyTerm}')]`;
    const policyTermLink = new Label(page, locator);
    return await policyTermLink.isDisplayed();
  }

  addCommasToValue(valueWithoutCommas: string): string {
    const [integerPart, decimalPart = ''] = valueWithoutCommas.split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
  }

  async getNetPremium(cpId: string): Promise<number> {
    const netPremiumLabel = new Label(this.page, `//table[@id='search-results']//td[text()='${cpId}']/following-sibling::td[3]`);
    const text = await netPremiumLabel.getText();
    return this.getAmountFromPremiumText(text);
  }

  async getBilledPremium(cpId: string): Promise<number> {
    const billedPremiumLabel = new Label(this.page, `//table[@id='search-results']//td[text()='${cpId}']/following-sibling::td[4]`);
    const text = await billedPremiumLabel.getText();
    return this.getAmountFromPremiumText(text);
  }

  async verifyNetPremiumEqualsBilledPremium(cpId: string): Promise<void> {
    const netPremium = await this.getNetPremium(cpId);
    const billedPremium = await this.getBilledPremium(cpId);
    expect(Math.abs(netPremium - billedPremium)).toBeLessThan(this.premiumTolerance);
  }

  async getCoveragePeriod(section: string): Promise<string> {
    logger.info(`[CoverageTabSection.getCoveragePeriod] - Getting coverage period for section: ${section}`);
    return await new Label(this.page, `//div[contains(@id,"${section.toLowerCase()}-coverages")]//h3[contains(text(),'Coverage Period')]`).getText();
  }

  /**
   * Gets the displayed value (e.g. "0 Days", "No Coverage", "6 Months") for a waiting period
   * shown under the "Waiting Periods" panel of the Plan Overview section.
   * @param waitingPeriodName Label text of the waiting period (e.g. 'Illness', 'Injury', 'Orthopedic')
   * @param section Which coverage panel to read from: 'active' or 'upcoming'
   */
  async getWaitingPeriodValue(waitingPeriodName: string, section: 'active' | 'upcoming'): Promise<string> {
    logger.info(`[CoverageTabSection.getWaitingPeriodValue] - Getting ${waitingPeriodName} waiting period value for section: ${section}`);
    return await new Label(this.page, `//*[contains(@id,'coverage') and contains(@id,'${section}')]//strong[text()='${waitingPeriodName}']/ancestor::div[@class='control-group'][1]/div[@class='controls']`).getText();
  }

  /**
   * Returns the Product Details table scoped to a specific coverage section, so Active and
   * Upcoming panels (which can both be present in the DOM at once) don't collide.
   * Columns: Product | Benefit | Annual Limit Applied | Annual Limit Remaining
   */
  productDetailTableInSection(section: 'active' | 'upcoming'): Table {
    return new Table(
      this.page,
      `//*[contains(@id,'coverage') and contains(@id,'${section}')]//h3[text()='Product Details']/../table`,
      ['Product', 'Benefit', 'Annual Limit Applied', 'Annual Limit Remaining'] as const
    );
  }

  async petStatusByPetName(status: string, petName: string): Promise<string> {
    logger.info(`[CoverageTabSection.petStatusByPetName] - Getting pet status [${status}] for ${petName}`);
    return await new Label(this.page, `//a[.="${petName}"]/ancestor::tbody/tr/td[contains(text(),"${status}")]`).getText();
  }

  async cancellationStatusByPetName(status: string, petName: string): Promise<string> {
    logger.info(`[CoverageTabSection.cancellationStatusByPetName] - Getting cancellation status [${status}] for ${petName}`);
    return await new Label(this.page, `//a[text()="${petName}"]/ancestor::tbody/tr/td//div/strong[contains(text(),"${status}")]`).getText();
  }

  async getMasterPolicyTerm(termPeriod: number): Promise<string> {
    logger.info(`[CoverageTabSection.getMasterPolicyTerm] - Getting master policy term for: ${termPeriod}`);
    const text = await new Label(this.page, `//div[@id="coverages-accordion"]//a[contains(text(), "Policy Term - ${termPeriod}")]`).getText();
    return text.replace(/\s/g, ' ');
  }

  /**
   * Gets the upcoming yearly premium amount from the premium summary label.
   * Parses the premium text and extracts the yearly amount with dollar sign.
   * @returns The yearly premium amount as a string (e.g., "$378.61")
   */
  async getUpcomingYearlyPremiumAmount(): Promise<string> {
    const premiumText = (await this.premiumUpcomingYearlyAmountLabel.getText()).trim();
    return extractFirstAmount(premiumText);
  }

  /**
   * Gets the upcoming monthly premium amount including service fee.
   * Parses text like "Premium Amount: $112.74 /mo + $3.00 Service Fee" and returns "$115.74"
   * @returns The total monthly premium amount as a string (e.g., "$115.74")
   */
  async getUpcomingMonthlyPremiumAmount(): Promise<string> {
    const premiumText = (await this.premiumUpcomingMontlyAmountLabel.getText()).trim();
    return extractTotalAmount(premiumText);
  }

  /**
 * Verifies pet details in the Coverage tab table (Active or Upcoming)
 * Extracts data from the complex HTML structure and compares with expected values
 * Only checks fields that are provided in the expectedPets array (non-undefined values)
 * @param expectedPets Array of expected pet details. Each pet can have: petName, breed, species, age, effectiveDate
 * @param section Which table to verify: 'active' (default) or 'upcoming'
 * @example
 * // Check only petName and species
 * await verifyCoveragePetDetails([{ petName: 'Pet 1', species: '(Cat)' }], 'active');
 * 
 * // Check all fields
 * await verifyCoveragePetDetails([{ petName: 'Pet 1', breed: 'Mixed', species: '(Dog)', age: '5', effectiveDate: '10/7/2025' }], 'active');
 */
  async verifyCoveragePetDetails(
    expectedPets: Array<{
      petName?: string;
      breed?: string;
      species?: string;
      age?: string;
      effectiveDate?: string;
    }>,
    section: 'active' | 'upcoming' | 'past' = 'active'
  ): Promise<void> {
    logger.info(`[CoverageTabSection.verifyCoveragePetDetails] - Verifying ${expectedPets.length} pets in ${section} tab`);
    const errors: string[] = [];
    let targetTable;
    if (section === 'active') {
      targetTable = this.activePetDetailTable;
    } else if (section === 'past') {
      targetTable = this.pastPetDetailTable;
    } else {
      targetTable = this.upcomingPetDetailTable;
    }

    for (let i = 0; i < expectedPets.length; i++) {
      const expected = expectedPets[i];
      const rowNumber = i + 1;

      const cellLocator = targetTable.getLocator().locator(`tbody tr:nth-child(${rowNumber}) td:nth-child(1)`);
      const cellText = await cellLocator.textContent();

      if (!cellText) {
        errors.push(`Row ${rowNumber}: Unable to read cell content`);
        continue;
      }

      const lines = cellText.split('\n').map((line: string) => line.trim()).filter((line: string) => line);

      let actualPetName = '';
      let actualBreed = '';
      let actualSpecies = '';
      let actualAge = '';
      let actualEffectiveDate = '';

      for (const line of lines) {
        if (line.includes('Breed:')) {
          actualBreed = line.replace('Breed:', '').trim();
        } else if (line.startsWith('(') && line.endsWith(')')) {
          actualSpecies = line;
        } else if (line.includes('Age:')) {
          actualAge = line.replace('Age:', '').trim();
        } else if (line.includes('Effective On:')) {
          actualEffectiveDate = line.replace('Effective On:', '').trim();
        } else if (!actualPetName && line && !line.includes(':') && !line.includes('Breed') && !line.includes('Age') && !line.includes('Effective')) {
          // First non-label line is the pet name (e.g., "Theo", "Pet 1")
          actualPetName = line;
        }
      }

      // Only verify fields that are provided (not undefined)
      if (expected.petName !== undefined && actualPetName !== expected.petName) {
        errors.push(`Row ${rowNumber} Pet Name: expected='${expected.petName}', actual='${actualPetName}'`);
      }
      if (expected.breed !== undefined && actualBreed !== expected.breed) {
        errors.push(`Row ${rowNumber} Breed: expected='${expected.breed}', actual='${actualBreed}'`);
      }
      if (expected.species !== undefined && actualSpecies !== expected.species) {
        errors.push(`Row ${rowNumber} Species: expected='${expected.species}', actual='${actualSpecies}'`);
      }
      if (expected.age !== undefined && actualAge !== expected.age) {
        errors.push(`Row ${rowNumber} Age: expected='${expected.age}', actual='${actualAge}'`);
      }
      if (expected.effectiveDate !== undefined && actualEffectiveDate !== expected.effectiveDate) {
        errors.push(`Row ${rowNumber} Effective Date: expected='${expected.effectiveDate}', actual='${actualEffectiveDate}'`);
      }
    }

    if (errors.length > 0) {
      const errorMsg = `[CoverageTabSection.verifyCoveragePetDetails] Validation errors:\n${errors.join('\n')}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    logger.info(`[CoverageTabSection.verifyCoveragePetDetails] - Verification passed for ${expectedPets.length} pets in ${section} tab`);
  }

  /**
   * Verifies that each expected pet exists somewhere in the Coverage tab table (Active or Upcoming),
   * regardless of row order. Only checks fields that are provided (non-undefined values).
   * @param expectedPets Array of expected pet details to find in the table
   * @param section Which table to verify: 'active' (default) or 'upcoming'
   */
  async verifyCoveragePetDetailsUnordered(
    expectedPets: Array<{
      petName?: string;
      breed?: string;
      species?: string;
      age?: string;
      effectiveDate?: string;
    }>,
    section: 'active' | 'upcoming' = 'active'
  ): Promise<void> {
    logger.info(`[CoverageTabSection.verifyCoveragePetDetailsUnordered] - Verifying ${expectedPets.length} pets in ${section} tab (unordered)`);
    const targetTable = section === 'active' ? this.activePetDetailTable : this.upcomingPetDetailTable;

    const rows = targetTable.getLocator().locator('tbody tr');
    const rowCount = await rows.count();

    const actualPets: Array<{ petName: string; breed: string; species: string; age: string; effectiveDate: string }> = [];

    for (let i = 0; i < rowCount; i++) {
      const cellText = await rows.nth(i).locator('td:nth-child(1)').textContent();
      if (!cellText) continue;

      const lines = cellText.split('\n').map((line: string) => line.trim()).filter((line: string) => line);
      let petName = '', breed = '', species = '', age = '', effectiveDate = '';

      for (const line of lines) {
        if (line.includes('Breed:')) {
          breed = line.replace('Breed:', '').trim();
        } else if (line.startsWith('(') && line.endsWith(')')) {
          species = line;
        } else if (line.includes('Age:')) {
          age = line.replace('Age:', '').trim();
        } else if (line.includes('Effective On:')) {
          effectiveDate = line.replace('Effective On:', '').trim();
        } else if (!petName && line && !line.includes(':') && !line.includes('Breed') && !line.includes('Age') && !line.includes('Effective')) {
          petName = line;
        }
      }

      actualPets.push({ petName, breed, species, age, effectiveDate });
    }

    const errors: string[] = [];

    for (const expected of expectedPets) {
      const match = actualPets.find(actual =>
        (expected.petName === undefined || actual.petName === expected.petName) &&
        (expected.breed === undefined || actual.breed === expected.breed) &&
        (expected.species === undefined || actual.species === expected.species) &&
        (expected.age === undefined || actual.age === expected.age) &&
        (expected.effectiveDate === undefined || actual.effectiveDate === expected.effectiveDate)
      );

      if (!match) {
        const expectedStr = JSON.stringify(expected);
        errors.push(`No row found matching: ${expectedStr}`);
      }
    }

    if (errors.length > 0) {
      const errorMsg = `[CoverageTabSection.verifyCoveragePetDetailsUnordered] Validation errors:\n${errors.join('\n')}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    logger.info(`[CoverageTabSection.verifyCoveragePetDetailsUnordered] - Verification passed for ${expectedPets.length} pets in ${section} tab`);
  }
}