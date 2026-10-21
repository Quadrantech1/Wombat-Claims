import { TextBox } from '@controls/textbox';
import { Button } from '@controls/button';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { AlertSection } from '../common-section/alert-section';
import { timeouts } from '@utils/timeouts-util';

export class VetSearchModal extends BasePage {

  nameTextBox = new TextBox(this.page, "#SearchCriteria_Name");
  phoneTextBox = new TextBox(this.page, "#SearchCriteria_PhoneNo");
  cityTextBox = new TextBox(this.page, "#SearchCriteria_City");
  postalCodeTextBox = new TextBox(this.page, "//input[@name='SearchCriteria.PostalCode']");

  stateProvinceSelect = new Select(this.page, "//select[@id='vet-search-state-prov-select']");
 
  runSearchButton = new Button(this.page, "//button[contains(.,'Run Search')]");
  createNewVetButton = new Button(this.page, "//a[@title='Add New Vet']");
  
  vetsResultTable = new Table(this.page, "//table[@id='vets-table']");
  
  // Alert
  alertSection = new AlertSection(this.page);

  async clickOnSelectButton(row: number, initialSearch: string): Promise<void> {
    logger.info(`[VetSearchModal.clickOnSelectButton] Selecting vet from row: ${row} with initial search: ${initialSearch}`);
    await this.nameTextBox.setText(initialSearch);
    await this.runSearchButton.click();
    const selectButton = new Button(this.page, `(//table[@id='vets-table']//a[@title='Select Vet'])[${row}]`);
    await selectButton.click();
    await this.page.waitForTimeout(timeouts.polling);
    await this.alertSection.successfullyAlertLabel.waitForVisible();
    await this.alertSection.verifySuccessAlertText('Successfully assigned vet to loss');
    logger.info(`[VetSearchModal.clickOnSelectButton] Vet selected successfully`);
  }

  async clickOnSpecificSelectButtonByRow(row: number): Promise<void> {  
    const selectButton = new Button(this.page, `(//table[@id='vets-table']//a[@title='Select Vet'])[${row}]`);
    await selectButton.click();
  }
}