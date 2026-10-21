import { BasePage } from '@pages/base-page';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { logger } from '@utils/logger-util';
import { expect } from '@playwright/test';

export class ConditionalClaimRuleDetailsPage extends BasePage {

  selectIncidentType = new Select(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemIncidentType']//span[@class='dropdown-btn']");
  searchIncidentType = new TextBox(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemIncidentType']//input[@aria-label='multiselect-search']");
  btnSelectAllIncidentType = new Button(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemIncidentType']//button[contains(text(),'Select all')]");

  selectIncidentClass = new Select(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemIncidentClass']//span[@class='dropdown-btn']");
  searchIncidentClass = new TextBox(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemIncidentClass']//input[@aria-label='multiselect-search']");
  btnSelectAllIncidentClass = new Button(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemIncidentClass']//button[contains(text(),'Select all')]");

  selectProcedure = new Select(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemProcedure']//span[@class='dropdown-btn']");
  searchProcedure = new TextBox(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemProcedure']//input[@aria-label='multiselect-search']");
  btnSelectAllProcedure = new Button(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemProcedure']//button[contains(text(),'Select all')]");

  selectedItemClaimCondition = new Select(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemClaimCondition']//span[@class='dropdown-btn']");
  searchClaimCondition = new TextBox(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemClaimCondition']//input[@aria-label='multiselect-search']");
  chkBoxSelectClaimCondition = new Button(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemClaimCondition']//ul[@class='item2']/." );

  selectedItemProduct = new Select(this.page, "//pp-multi-select-dropdown[@name='selectedItemProduct']//span[@class='dropdown-btn']");
  searchItemProduct = new TextBox(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemProduct']//input[@aria-label='multiselect-search']");
  chkBoxSelectItemProduct = new Button(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemProduct']//ul[@class='item2']/." );

  searchMasterRateSheet = new TextBox(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemMasterRateSheet']//input[@aria-label='multiselect-search']");
  searchMasterRateSheetValue  = new TextBox(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemMasterRateSheet']//input[@aria-label='multiselect-search']");

  selectedItemClaimDenialCode = new Select(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemClaimDenialCode']//span[@class='dropdown-btn']");
  searchClaimDenialCode = new TextBox(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemClaimDenialCode']//input[@aria-label='multiselect-search']");
  chkBoxSelectedItemClaimDenialCode = new Button(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemClaimDenialCode']//ul[@class='item2']/." );

  selectedItemMasterRateSheet = new Select(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemMasterRateSheet']//span[@class='dropdown-btn']");
  searchItemMasterRateSheet = new TextBox(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemMasterRateSheet']//input[@aria-label='multiselect-search']");
  btnSelectAllItemMasterRateSheet = new Button(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemMasterRateSheet']//button[contains(text(),'Select all')]");

  selectBenefitSchedule = new Select(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemBenefitSchedule']//span[@class='dropdown-btn']");
  searchBenefitSchedule = new TextBox(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemBenefitSchedule']//input[@aria-label='multiselect-search']");
  btnSelectAllBenefitSchedule = new Button(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemBenefitSchedule']//button[contains(text(),'Select all')]");

  selectMasterRateSheet = new Select(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemMasterRateSheet']//span[@class='dropdown-btn']");
  btnSelectAllMasterRateSheet = new Button(this.page, "//pp-multi-select-dropdown[@name= 'selectedItemMasterRateSheet']//button[contains(text(),'Select all')]");

  btnSave = new Button(this.page, "//button[@id='saveButton']");
  incidentCheckbox = new Checkbox(this.page, "//label[text()=' Incident ']/preceding-sibling::input");
  incidentClassCheckbox = new Checkbox(this.page, "//label[text()=' Incident Class ']/preceding-sibling::input");
  procedueCheckbox = new Checkbox(this.page, "//label[text()=' Procedure ']/preceding-sibling::input");
  alertClaimRule = new Label(this.page, "//div[@class='alert alert-danger center-middle']");
  pleaseWait = new Label(this.page, "//span[text()='Please wait...']");

  /**
   * Selects an incident type checkbox by option name
   * @param option Option label to select
   */
  async checkBoxSelectIncidentType(option: string): Promise<void> {
    logger.info(`[ConditionalClaimRuleDetailsPage.checkBoxSelectIncidentType] - Selecting incident type: ${option}`);
    await new Checkbox(this.page, `//div[contains(@class, 'multiselect-dropdown')]//input[@aria-label='${option}']`).check();
  }
}
