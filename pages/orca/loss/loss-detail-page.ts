import { Button } from '@controls/button';
import { Cell } from '@controls/cell';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { LossDetailApprovedTableData } from '@data/orca/loss-detail-approved-table-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { AlertSection } from '../common-section/alert-section';
import { LoadingSection } from '../common-section/loading-section';
import { AddNewVetModal } from './add-new-vet-modal';
import { EditVetModal } from './edit-a-vet-modal';
import { IncidentModal } from './incident-modal';
import { VetSearchModal } from './vet-search-modal';

export class LossDetailPage extends BasePage {
  loadingSection = new LoadingSection(this.page);

  dateOfServiceTextBox = new TextBox(this.page, "//input[@id='LossDto_DateOfService']");

  petSelect = new Select(this.page, "//select[@id='pet' or @id='group-pet']");
  vetSelect = new Select(this.page, "#vet");

  findVetButton = new Button(this.page, "//a[contains(.,'Find a Vet')]");
  editVetButton = new Button(this.page, "//a[@class='ajax-get span6 btn btn-inverse']");

  incidentsPlusButton = new Button(this.page, "//legend/span/a/i");
  checkMarkButton = new Button(this.page, "//input[@class='add-incident']");
  saveButton = new Button(this.page, "(//div[@class='pull-right']/*[@name='ButtonPressed'])[1]");

  incidentTable = new Table(this.page, '//legend[contains(.,"Incidents")]/..//table');
  approvedTable = new Table(this.page, '//table[@class="table table-bordered loss-incident-lines"]');

  denialReasonHeader = new Label(this.page, "//div[@id='loss']//h3[contains(text(),'Denial Reason')]");
  documentRateVersionLabel = new Label(this.page, '//div[@id="loss"]//div[contains(@class,"control-group")][.//*[normalize-space(.)="Version Number"]]');

  addNewItemButton = new Button(this.page, "#btn-add-line-item");

  procedureColumnCell = new Cell(2, "input", "Procedure");
  quantityColumnCell = new Cell(3, "input", "Quantity");
  descriptionColumnCell = new Cell(4, "input", "Description");
  incidentColumnCell = new Cell(5, "select", "Incident");
  submittedColumnCell = new Cell(8, "input", "Submitted");
  allowedColumnCell = new Cell(9, "input", "Allowed");

  //Locator below only applicable for Canada (Orca CA)
  addTaxButton = new Button(this.page, "//label[@class='checkbox']//input[contains(@id, '__LossIncidentLine_IsTaxExclusive')]");
  addPSTButton = new Button(this.page, "//label[@class='checkbox']//input[contains(@id, '__LossIncidentLine_IsProvincialSalesTaxApplied')]");
  totalWithTaxTextBox = new TextBox(this.page, "//input[contains(@class, 'total-amount-including-tax')]");

  vetSearchModal = new VetSearchModal(this.page);
  incidentModal = new IncidentModal(this.page);
  addNewVetModal = new AddNewVetModal(this.page);
  editVetModal = new EditVetModal(this.page);
  // Alert
  alertSection = new AlertSection(this.page);

  // Overview section buttons
  returnToClaimOverviewButton = new Button(this.page, "(//div[@class='pull-right']/a[@title='Return to Claim'])[1]");
  requestMedicalRecordsOverviewButton = new Button(this.page, "(//div[@class='pull-right']/a[@title='Request Medical Records'])[1]");
  saveOverviewButton = new Button(this.page, "(//div[@class='pull-right']/*[@name='ButtonPressed'])[1]");

  // Approved section buttons
  returnToClaimApprovedButton = new Button(this.page, "(//div[@class='pull-right']/a[@title='Return to Claim'])[last()]");
  requestMedicalRecordsApprovedButton = new Button(this.page, "(//div[@class='pull-right']/a[@title='Request Medical Records'])[last()]");
  saveApprovedButton = new Button(this.page, "(//div[@class='pull-right']/*[@name='ButtonPressed'])[last()]");

  // Deny section controls (used to add denial reasons)
  denyButton = new Button(this.page, "//a[text()=' Deny']");
  createNewDenialReasonButton = new Button(this.page, "//a[text()=' Create a New Denial Reason']");
  saveDenyButton = new Button(this.page, "//button[@class='btn btn-success']");
  cancelDenyButton = new Button(this.page, "//button[@class='btn btn-inverse']");

  /**
   * Get the View button for a specific incident by name (opens in new tab)
   * @param incidentName - The name of the incident (e.g., 'Staph Infection')
   * @returns Button control for use with navigation.clickAndGetNewTab()
   */
  getViewIncidentButton(incidentName: string): Button {
    return new Button(this.page, `//tbody//tr[contains(.,'${incidentName}')]//a[@title='View']`);
  }

  /**
   * this method is to fill the approved table
   * @param approvedData fill data for approved table
   * @param row : default row value = 1
   */
  async fillTheApprovedTable(approvedData?: Partial<LossDetailApprovedTableData>, row: number = 1): Promise<void> {
    logger.info(`[LossDetailPage.fillTheApprovedTable] Filling the approved table with data: ${JSON.stringify(approvedData)}`);
    await this.page.waitForLoadState('networkidle');
    if (approvedData?.procedure !== undefined) {
      await this.approvedTable.setTextSelect(this.procedureColumnCell.position, row, approvedData.procedure, approvedData.procedure);
    }
    if (approvedData?.quantity !== undefined) {
      await this.approvedTable.setTextTable(this.quantityColumnCell.position, row, approvedData.quantity.toString());
    }
    if (approvedData?.description !== undefined) {
      await this.approvedTable.setTextTable(this.descriptionColumnCell.position, row, approvedData.description);
    }

    if (approvedData?.incident !== undefined) {
      if (approvedData.incident == '1') {
        await this.approvedTable.selectFirstValue(this.incidentColumnCell.position, row);
      } else {
        await this.approvedTable.select(this.incidentColumnCell.position, row, approvedData.incident);
      }
    }

    if (approvedData?.submitted !== undefined) {
      await this.approvedTable.setTextTable(this.submittedColumnCell.position, row, approvedData.submitted.toString());
    }
    if (approvedData?.allowed !== undefined) {
      await this.approvedTable.setTextTable(this.allowedColumnCell.position, row, approvedData.allowed.toString());
    }
  }

  /**
   * Search and select a vet using the vet search modal
   * @param state - The state to search in (default: 'Texas')
   * @param searchInitial - The initial search term for vet name (default: 'c')
   * @param row - The row number to select from results (default: 1)
   */
  async searchAndSelectVet(state: string = 'Texas', searchInitial: string = 'c', row: number = 1): Promise<void> {
    logger.info(`[LossDetailPage.searchAndSelectVet] Searching and selecting vet in state: ${state}`);
    await this.findVetButton.waitForVisible();
    await this.findVetButton.click();
    await this.vetSearchModal.stateProvinceSelect.selectValue(state);
    await this.vetSearchModal.clickOnSelectButton(row, searchInitial);
    await this.vetSelect.firstValue();
  }

  /**
   * Search and select a vet using the vet search modal for Canada (Orca CA) - province is chosen by the caller
   * @param province - The province to search in
   * @param searchInitial - The initial search term for vet name (default: 'c')
   * @param row - The row number to select from results (default: 1)
   */
  async searchAndSelectVetCanada(province: string, searchInitial: string = 'c', row: number = 1): Promise<void> {
    logger.info(`[LossDetailPage.searchAndSelectVetCanada] Searching and selecting vet in province: ${province}`);
    await this.findVetButton.waitForVisible();
    await this.findVetButton.click();
    await this.vetSearchModal.stateProvinceSelect.selectValue(province);
    await this.vetSearchModal.clickOnSelectButton(row, searchInitial);
    await this.vetSelect.firstValue();
  }

  /**
   * Fill multiple approved table rows with procedure data
   * @param procedures - Array of procedure data to fill
   * @param saveAfter - Whether to save and verify after filling (default: true)
   */
  async fillMultipleApprovedProcedures(procedures: LossDetailApprovedTableData[]): Promise<void> {
    logger.info(`[LossDetailPage.fillMultipleApprovedProcedures] Filling ${procedures.length} procedures`);
    for (let i = 0; i < procedures.length; i++) {
      await this.fillTheApprovedTable(procedures[i], i + 1);
      if (i < procedures.length - 1) {
        await this.addNewItemButton.click();
      }
    }
    await this.saveApprovedButton.click();
    await this.alertSection.verifySuccessAlertText('Successfully saved loss details');
  }
}