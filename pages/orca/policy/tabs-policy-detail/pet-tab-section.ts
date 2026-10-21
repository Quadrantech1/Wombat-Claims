import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { Locator } from '@playwright/test';
import { logger } from '@utils/logger-util';
export class PetTabSection extends BasePage {

  petsTable = new Table(this.page, '//div[@id="pets-table"]/div/table[@id="search-results"]');
  deductibleTable = new Table(this.page, '//div[@id="deductible-tracker-accordion"]//table');
  deductibleTrackerLink = new Link(this.page, "//a[contains(.,'Deductible Tracker')]");

  async getPetValuesByColumn(columnName: string, rowNumber: number): Promise<string> {
    logger.info(`[GroupPetTabSection.getPetValuesByColumn] - Getting column: ${columnName}, row: ${rowNumber} from petsTable`);
    return await this.petsTable.getCellValueByColumn(columnName, rowNumber);
  }

  async getPetIdByPetName(petName: string): Promise<string> {
    logger.info(`[PetTabSection.getPetIdByPetName] - Getting pet ID for pet: ${petName}`);
    const petLinkHref = await this.getPetRowByName(petName).locator('a').first().getAttribute('href');
    const petIdMatch = petLinkHref?.match(/[?&]groupPetId=(\d+)/) ?? petLinkHref?.match(/\d+(?!.*\d)/);
    if (!petIdMatch) {
      throw new Error(`[PetTabSection.getPetIdByPetName] - Pet ID was not found for pet: ${petName}`);
    }

    return petIdMatch[1] ?? petIdMatch[0];
  }

  async clickPetByName(petName: string): Promise<void> {
    logger.info(`[PetTabSection.clickPetByName] - Opening pet detail for pet: ${petName}`);
    await this.getPetRowByName(petName).locator('a').first().click();
  }

  private getPetRowByName(petName: string): Locator {
    return this.petsTable.getLocator().locator('tbody tr').filter({ hasText: petName }).first();
  }

  /**
   * Verifies pet details in the Pet(s) tab table
   * Uses standard table structure with headers
   * Only checks fields that are provided in the expectedPets array (non-undefined values)
   * @param expectedPets Array of expected pet details. Each pet can have: petName, breed, species, age, createdOn
   * @example
   * // Check only petName and species
   * await verifyPetsTabDetails([{ petName: 'Pet 1', species: 'Cat' }]);
   * 
   * // Check all fields
   * await verifyPetsTabDetails([{ petName: 'Pet 1', breed: '', species: 'Cat', age: '0', createdOn: '11/6/2025' }]);
   */
  async verifyPetsTabDetails(
    expectedPets: Array<{
      petName?: string;
      breed?: string;
      species?: string;
      age?: string;
      createdOn?: string;
    }>
  ): Promise<void> {
    logger.info(`[GroupPetTabSection.verifyPetsTabDetails] - Verifying ${expectedPets.length} pets in Pet(s) tab`);
    const errors: string[] = [];

    for (let i = 0; i < expectedPets.length; i++) {
      const expected = expectedPets[i];
      const rowNumber = i + 1;

      const row = this.petsTable.getLocator().locator(`tbody tr:nth-child(${rowNumber})`);

      const actualPetName = (await row.locator('td:nth-child(1)').textContent())?.trim() ?? '';
      const actualBreed = (await row.locator('td:nth-child(2)').textContent())?.trim() ?? '';
      const actualSpecies = (await row.locator('td:nth-child(3)').textContent())?.trim() ?? '';
      const actualAge = (await row.locator('td:nth-child(4)').textContent())?.trim() ?? '';
      const actualCreatedOn = (await row.locator('td:nth-child(5)').textContent())?.trim() ?? '';

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
      if (expected.createdOn !== undefined && actualCreatedOn !== expected.createdOn) {
        errors.push(`Row ${rowNumber} Created On: expected='${expected.createdOn}', actual='${actualCreatedOn}'`);
      }
    }

    if (errors.length > 0) {
      const errorMsg = `[GroupPetTabSection.verifyPetsTabDetails] Validation errors:\n${errors.join('\n')}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    logger.info(`[GroupPetTabSection.verifyPetsTabDetails] - Verification passed for ${expectedPets.length} pets`);
  }

  /**
   * Verifies that each expected pet exists somewhere in the Pet(s) tab table,
   * regardless of row order. Only checks fields that are provided (non-undefined values).
   * @param expectedPets Array of expected pet details to find in the table
   */
  async verifyPetsTabDetailsUnordered(
    expectedPets: Array<{
      petName?: string;
      breed?: string;
      species?: string;
      age?: string;
      createdOn?: string;
    }>
  ): Promise<void> {
    logger.info(`[GroupPetTabSection.verifyPetsTabDetailsUnordered] - Verifying ${expectedPets.length} pets in Pet(s) tab (unordered)`);

    const rows = this.petsTable.getLocator().locator('tbody tr');
    const rowCount = await rows.count();

    const actualPets: Array<{ petName: string; breed: string; species: string; age: string; createdOn: string }> = [];

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      actualPets.push({
        petName: (await row.locator('td:nth-child(1)').textContent())?.trim() ?? '',
        breed: (await row.locator('td:nth-child(2)').textContent())?.trim() ?? '',
        species: (await row.locator('td:nth-child(3)').textContent())?.trim() ?? '',
        age: (await row.locator('td:nth-child(4)').textContent())?.trim() ?? '',
        createdOn: (await row.locator('td:nth-child(5)').textContent())?.trim() ?? '',
      });
    }

    const errors: string[] = [];

    for (const expected of expectedPets) {
      const match = actualPets.find(actual =>
        (expected.petName === undefined || actual.petName === expected.petName) &&
        (expected.breed === undefined || actual.breed === expected.breed) &&
        (expected.species === undefined || actual.species === expected.species) &&
        (expected.age === undefined || actual.age === expected.age) &&
        (expected.createdOn === undefined || actual.createdOn === expected.createdOn)
      );

      if (!match) {
        errors.push(`No row found matching: ${JSON.stringify(expected)}`);
      }
    }

    if (errors.length > 0) {
      const errorMsg = `[GroupPetTabSection.verifyPetsTabDetailsUnordered] Validation errors:\n${errors.join('\n')}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    logger.info(`[GroupPetTabSection.verifyPetsTabDetailsUnordered] - Verification passed for ${expectedPets.length} pets`);
  }

}