import { Button } from '@controls/button';
import { CustomSelectSpan } from '@controls/custom-select';
import { Iframe } from '@controls/iframe';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { getDateWithSpecificFormat } from '@utils/date-util';
import { logger } from '@utils/logger-util';
import { AlertSection } from '../common-section/alert-section';
import { TabsClaimDetailSection } from './tabs-claim-detail-section';


export class ClaimDetailPage extends BasePage {

  // Overview Information Section
  adjusterCustomSelect = new CustomSelectSpan(
    this.page,
    "//span[@id='select2-assistant-sysuser-id-container']",
    "ul[@class='select2-results__options']/li",
    "//input[@class='select2-search__field']"
  );

  auditorCustomSelect = new CustomSelectSpan(
    this.page,
    "//span[@id='select2-auditor-sysuser-id-container']",
    "ul[@class='select2-results__options']/li",
    "//input[@class='select2-search__field']"
  );

  assistantCustomSelect = new CustomSelectSpan(
    this.page,
    "//span[@id='select2-assistant-sysuser-id-container']",
    "ul[@class='select2-results__options']/li",
    "//input[@class='select2-search__field']"
  );

  processorCustomSelect = new CustomSelectSpan(
    this.page,
    "//span[@id='select2-processor-sysuser-id-container']",
    "ul[@class='select2-results__options']/li",
    "//input[@class='select2-search__field']"
  );

  returnToPolicyButton = new Button(this.page, "//div[@class='row-fluid'][1]//*[contains(text(),'Return to Policy')]");
  submitToProcessingButton = new Button(this.page, "//div[@class='row-fluid'][1]//*[contains(text(),'Submit to Processing')]");
  moveClaimsButton = new Button(this.page, "//div[@class='row-fluid'][1]//*[contains(text(),'Move Claims')]");
  placeOnHoldButton = new Button(this.page, "//div[@class='row-fluid'][1]//*[contains(text(),'Place On Hold')]");
  saveButton = new Button(this.page, "//div[@class='row-fluid'][1]//*[contains(text(),'Save')]");
  finalizeAllLossesButton = new Button(this.page, "//div[@class='row-fluid'][1]//*[contains(text(),'Finalize All Loss(es)')]");
  previewEOBButton = new Button(this.page, "//div[@class='row-fluid'][1]//*[contains(text(),'Preview EOB')]");
  completeProcessingButton = new Button(this.page, "//div[@class='row-fluid'][1]//*[contains(text(),'Complete Processing')]");
  assignToMeButton = new Button(this.page, "//div[@class='row-fluid'][1]//a[contains(.,' Assign to Me')]");
  approveButton = new Button(this.page, "//div[@class='row-fluid'][1]//a[contains(.,'Approve')]");
  doNotIssueButton = new Button(this.page, "//input[@id='do-not-issue']");
  closeDNIAlertButton = new Button(this.page, "//button[@id='closeDNIAlert']");
  reopenClaimButton = new Button(this.page, "//div[@class='row-fluid'][1]//*[contains(text(),'Reopen Claim')]");
  regenerateDocumentsButton = new Button(this.page, "//a[@id='btn-regenerate-docs-claim']");
  regenerateDocumentByClaimDropdown = new Select(this.page, "//select[@id='select-document-type']");
  regenerateButton = new Button(this.page, "//button[@id='btn-regenerate-docs']");

  receivedOnTextBox = new TextBox(this.page, "//input[@id='ClaimDto_ReceivedOn' and @type='text']");

  tabsClaimDetailSection = new TabsClaimDetailSection(this.page);
  adjusterNoteTextBoxFrame = new TextBox(this.page, '//body[@data-id="adjuster-note"]');

  //labels
  statusLabel = new Label(this.page, "//div/strong[text()='Status']/parent::*/parent::*/div[@class='controls']");
  underwriterLabel = new Label(this.page, "//div/strong[text()='Underwriter']/parent::*/parent::*/div[@class='controls']");
  claimNumberLabel = new Label(this.page, "//input[@id='ClaimDto_ClaimId']/parent::div");
  partnerLabel = new Label(this.page, "//div/strong[text()='Partner']/parent::*/parent::*/div[@class='controls']");
  policyHolderAddressLabel = new Label(this.page, "//div[@id='claim-details']//address");
  prop103IndicatorLabel = new Label(this.page, "//*[text()[contains(normalize-space(.),'filed under Prop103')]]");
  nameOnClaimsDetailsLabel = new Label(this.page, "//div[@id='claim-details']//address/strong");
  // Alert
  alertSection = new AlertSection(this.page);

  async createClaimDefault(): Promise<void> {
    logger.info("[ClaimDetailPage>createClaimDefault] Creating a claim with default values");
    await this.assistantCustomSelect.firstValue();
    await this.processorCustomSelect.firstValue();
    await this.adjusterCustomSelect.firstValue();
    await this.auditorCustomSelect.firstValue();
    await this.receivedOnTextBox.click();
    await this.receivedOnTextBox.setText(getDateWithSpecificFormat(0));
    await this.saveButton.click();
    await this.submitToProcessingButton.click();
    await this.alertSection.verifySuccessAlertText("Successfully updated 1 claims to claim status");
    logger.info("[ClaimDetailPage>createClaimDefault] Claim created successfully");
  }

  async getNameOnClaimsDetails(): Promise<String> {
    logger.info("[ClaimDetailPage>getNameOnClaimsDetails] Getting name on claims details");
    logger.info("[ClaimDetailPage>getNameOnClaimsDetails] Retrieving text from nameOnClaimsDetailsLabel " + await this.nameOnClaimsDetailsLabel.getText());
    return await this.nameOnClaimsDetailsLabel.getText();
  }

  /**
   * Escribe un valor en el textbox dentro del iframe 'adjuster-note_ifr' usando Playwright.
   * @param value El valor a escribir (se reemplazan valores comunes si es necesario)
   */
  public async setAdjusterNoteInFrame(value: string): Promise<void> {
    logger.info("[ClaimDetailPage.setAdjusterNoteInFrame] set text in adjuster note: " + value);
    let iframe = new Iframe(this.page, "#adjuster-note_ifr");
    await iframe.textBox('//body[@data-id="adjuster-note"]').setText(value);
  }

  /**
   * Finalize all losses and complete claim processing workflow
   * This method handles the common pattern of finalizing losses, completing processing, and approving
   */
  public async finalizeAndCompleteProcessing(): Promise<void> {
    logger.info("[ClaimDetailPage.finalizeAndCompleteProcessing] Finalizing all losses and completing processing");
    await this.finalizeAllLossesButton.clickAndWait();
    await this.alertSection.verifySuccessAlertText('Successfully finalized');
    await this.completeProcessingButton.clickAndWait();
    await this.alertSection.verifySuccessAlertText('Successfully updated 1 claims to claim status');
  }
}