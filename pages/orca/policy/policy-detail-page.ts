import { TabsPolicyDetailSection } from './tabs-policy-detail-section';

import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { extractTotalAmount } from '@utils/amounts-util';
import { logger } from '@utils/logger-util';
import { AlertSection } from '../common-section/alert-section';
import { BackDateSection } from './back-date-modal';
import { MoveClaimDialog } from './move-claim-dialog';

export enum PolicyActionOptionEnum {
  DoNotRenew = 'Do Not Renew',
  ChangeEffectiveDate = 'Change Effective Date',
  BackdateFullTermPolicy = 'Backdate Full Term Policy',
  CancelEntirePolicy = 'Cancel Entire Policy',
  CreateFollowup = 'Create Followup',
  GenerateWelcomeDocuments = 'Generate Welcome Documents',
  GeneratePolicyTermDocuments = 'Generate Policy Term Documents',
  Reinstate = 'Re-Instate',
}
export class PolicyDetailPage extends BasePage {
  // Overview Information Section
  statusSelect = new Select(this.page, "//select[@id='PolicyDetails_Policy_PolicyStatusId']");
  policyStatusLabel = new Label(this.page, "//input[@id='PolicyDetails_Policy_PolicyStatusId']/parent::*");
  deliveryTypeSelect = new Select(this.page, "//select[@id='PolicyDetails_Policy_DeliveryTypeId']");
  paymentFrequencySelect = new Select(this.page, "//select[@id='PolicyDetails_Policy_PaymentFrequencyId']");
  holdPaymentSelect = new Select(this.page, "//select[@name='HoldPaymentReProcessingId']");

  linkedPolicyTextBox = new TextBox(this.page, "#PolicyDetails_Policy_LinkedPolicy");
  linkedGroupCertificateLink = new Link(this.page, "//strong[contains(.,'Linked Group Certificate')]/../..//a");
  upcomingTransactionLabel = new Label(this.page, "//strong[text()='Upcoming Transaction: ']/following-sibling::span");
  paymentAmountLabel = new Label(this.page, "//strong[text()='Payment amount: ']/parent::div");

  saveButton = new Button(this.page, this.page.getByRole('button', { name: 'Save' }));
  discardChangesButton = new Button(this.page, "//a[contains(.,'Discard Changes')]");
  submitForApprovalButton = new Button(this.page, "//a[contains(.,'Submit for Approval')]");
  approveChangesButton = new Button(this.page, "//a[contains(.,'Approve Changes')]");
  approveCancellationButton = new Button(this.page, this.page.getByRole('link', { name: 'Approve Cancellation' }));
  policyActionButton = new Button(this.page, "//a[contains(.,'Policy Actions')]");
  policyCancelButton = new Button(this.page, "//a[@title='Cancel Entire Policy']");
  editPaymentButton = new Button(this.page, "//a[@id='btn-view-pmt-options']");

  // Tabs Section
  tabsPolicyDetailSection = new TabsPolicyDetailSection(this.page);

  //commons
  alertSection = new AlertSection(this.page);
  backDateSection = new BackDateSection(this.page);
  moveClaimDialog = new MoveClaimDialog(this.page);
  
  /**
   * Gets the total payment amount including service fee from the policy detail page.
   * Parses text like "Payment amount: $31.55 + $3.00 Service Fee" and returns "$34.55"
   * @returns The total payment amount as a string (e.g., "$34.55")
   */
  async getPaymentAmount(): Promise<string> {
    const rawText = (await this.paymentAmountLabel.getText()).trim();
    return extractTotalAmount(rawText);
  }



  public async selectOptionPolicyActions(option: PolicyActionOptionEnum): Promise<void> {
    await this.policyActionButton.click();
    const optionLabel = new Label(this.page, `//a[contains(.,'${option}')]`);
    await optionLabel.click();
  }

  public async getValueFromControl(nameControl: string): Promise<string> {
    logger.info('[PolicyDetailPage.getValueFromControl] Getting value from control: ' + nameControl);
    if (
      nameControl.includes('Policy No') ||
      nameControl.includes('Market Channel') ||
      nameControl.includes('Created On') ||
      nameControl.includes('Pet Cloud Status') ||
      nameControl.includes('Linked Policy(ies)') ||
      nameControl.includes('Partner') ||
      nameControl.includes('Sold By:')
    ) {
      const labelControl = new Label(this.page, `//strong[contains(text(),'${nameControl}')]/../../div[@class='controls']`);
      logger.info('[PolicyDetailPage.getValueFromControl] Label control found for: ' + nameControl + ', getting text: ' + await labelControl.getText());
      return await labelControl.getText();
    } else if (
      nameControl.includes('Status') ||
      nameControl.includes('Delivery Type') ||
      nameControl.includes('Payment Frequency') ||
      nameControl.includes('Hold Payment')
    ) {
      const selectControl = new Select(this.page, `//strong[contains(text(),'${nameControl}')]/../../div[@class='controls']/select`);
      logger.info('[PolicyDetailPage.getValueFromControl] Select control found for: ' + nameControl + ', getting selected text: ' + await selectControl.getTextOptionSelected());
      return await selectControl.getTextOptionSelected();
    } else {
      logger.error('[PolicyDetailPage.getValueFromControl] Control not found for: ' + nameControl);
      throw new Error(`ERROR the control [${nameControl}] does not exist`);
    }
  }
}