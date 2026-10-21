import { LossDetailApprovedTableData } from '@data/orca/loss-detail-approved-table-data';
import { expect, test } from '@fixtures/base-fixtures';
import { TabPolicyOptions } from '@pages/orca/policy/tabs-policy-detail-section';
import { OrcaPageManager } from '@pages/page-managers/orca-page-manager';
import { QuoteToolHelper } from '@test-helpers/quote-tool-helper';
import { BrandUrl } from '@utils/brand-util';
import { getDateWithSpecificFormat } from '@utils/date-util';
import { loginToOrca } from '@utils/login-orca-util';
import { timeouts } from '@utils/timeouts-util';

test('Orca > Verify finalize claims (Admin)', { tag: ['@Sanity', '@Regression', '@Claims', '@14353'] }, async ({ page, context, navigation }) => {
  const quoteToolHelper = new QuoteToolHelper(page);
  let policy_id: string;
  let orca = new OrcaPageManager(page);
  const tomorrow_date = getDateWithSpecificFormat(1);

  await test.step('Step 1: Create policy', async () => {
    policy_id = await quoteToolHelper.createLegacyPolicy('PPI', {
      annualLimit: '$10,000',
      deductible: '$250',
      coinsurance: '20%',
      coverageType: 'custom',
      cardNumber: '4111111111111111',
    });
  });

  await test.step('Step 2: Login, navigate and create claim', async () => {
    await navigation.openBrandWebPage(BrandUrl.ORCA);
    await loginToOrca(page);
    await orca.menuTopSection.searchPolicy(policy_id);
    await orca.policyDetailPage.tabsPolicyDetailSection.clickTabOption(TabPolicyOptions.coverageTab);
    await orca.policyDetailPage.tabsPolicyDetailSection.clickTabOption(TabPolicyOptions.claimTab);
    await orca.policyDetailPage.tabsPolicyDetailSection.claimTabSection.addNewClaimButton.clickAndWait();
    await orca.claimDetailPage.createClaimDefault();
  });

  await test.step('Step 3: Add loss details with service date and select veterinarian', async () => {
    await orca.claimDetailPage.tabsClaimDetailSection.processingTabSection.addLossesButton.click();
    await orca.lossDetailPage.dateOfServiceTextBox.click();
    await orca.lossDetailPage.dateOfServiceTextBox.setTextAndTab(tomorrow_date);
    await orca.lossDetailPage.saveButton.click();
    await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully saved loss details');
    await orca.lossDetailPage.petSelect.firstValueAndWait();
    // Selects the first available veterinarian
    await orca.lossDetailPage.searchAndSelectVet();
    await orca.lossDetailPage.saveButton.click();
    await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully saved loss details');
  });

  await test.step('Step 4: Fill approved table and create incident', async () => {
    const approvedData: Partial<LossDetailApprovedTableData> = { procedure: '99999', description: 'Ciprofloxacin', submitted: '100', allowed: '100' };
    await orca.lossDetailPage.fillTheApprovedTable(approvedData);
    await orca.lossDetailPage.saveButton.click();
    await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully saved loss details');
    await orca.lossDetailPage.incidentsPlusButton.click();
    await orca.lossDetailPage.loadingSection.loadingSpinnerAddIncidentIcon.waitForDisappear(timeouts.long);
    await orca.lossDetailPage.incidentModal.createIncident();
    await orca.lossDetailPage.approvedTable.selectFirstValue(orca.lossDetailPage.incidentColumnCell.position, 1);
    await orca.lossDetailPage.saveApprovedButton.click();
    await orca.lossDetailPage.saveOverviewButton.click();
    await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully saved loss details');
    await orca.lossDetailPage.returnToClaimOverviewButton.click();
  });

  await test.step('Step 5: Finalize claim processing and open EOB', async () => {
    await orca.claimDetailPage.setAdjusterNoteInFrame('This is a test');
    await orca.claimDetailPage.saveButton.click();
    await orca.claimDetailPage.finalizeAndCompleteProcessing();
    const currentTabsBeforeEOB = context.pages();
    await navigation.clickAndGetNewTab(orca.claimDetailPage.previewEOBButton);
    const currentTabsAfterEOB = context.pages();
    expect(currentTabsAfterEOB.length).toBe(currentTabsBeforeEOB.length + 1);
  });
});
