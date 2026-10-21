import { config } from '@config/env-config';
import { LossDetailApprovedTableData } from '@data/orca/loss-detail-approved-table-data';
import { faker } from '@faker-js/faker/locale/en';
import { expect, test } from '@fixtures/base-fixtures';
import { TabClaimOptions } from '@pages/orca/claim/tabs-claim-detail-section';
import { PolicyActionOptionEnum } from '@pages/orca/policy/policy-detail-page';
import { TabPolicyOptions } from '@pages/orca/policy/tabs-policy-detail-section';
import { OrcaPageManager } from '@pages/page-managers/orca-page-manager';
import { chromium } from '@playwright/test';
import { QuoteToolHelper } from '@test-helpers/quote-tool-helper';
import { BrandUrl } from '@utils/brand-util';
import { getDateWithSpecificFormat } from '@utils/date-util';
import { downloadPdf } from '@utils/download-util';
import { generateMailosaurEmail } from '@utils/email-util';
import { loginToOrca } from '@utils/login-orca-util';
import { getTextPDF } from '@utils/pdf-util';
import { getRandomValue } from '@utils/random-values-util';
import { Role } from '@utils/user-credentials-util';

test('Orca > Verify user can enter losses and finalize a claim (claim specialist)', { tag: ['@Sanity', '@Regression', '@Claims', '@23083'] }, async ({ page, context, navigation }) => {
  const quoteToolHelper = new QuoteToolHelper(page);
  const fake_email = generateMailosaurEmail('Sanity', getRandomValue());
  const pet_name = faker.animal.dog();
  let policy_id: string;
  let claim_id: string;
  let orca = new OrcaPageManager(page);

  await test.step('Step 1: Create and backdate policy', async () => {
    policy_id = await quoteToolHelper.createLegacyPolicy('PPI', {
      annualLimit: '$10,000',
      deductible: '$250',
      coinsurance: '20%',
      coverageType: 'custom',
      cardNumber: '4111111111111111',
      email: fake_email,
      petName: pet_name,
      petType: 'dog',
      breed: 'Affenpinscher',
    });
    const yesterday = getDateWithSpecificFormat(-1);
    await navigation.openBrandWebPage(BrandUrl.ORCA);
    await loginToOrca(page, Role.Admin);
    await orca.menuTopSection.searchPolicy(policy_id);
    await orca.policyDetailPage.selectOptionPolicyActions(PolicyActionOptionEnum.BackdateFullTermPolicy);
    await orca.policyDetailPage.backDateSection.setEffectiveDateAndCoveragePeriod(yesterday, 'first');
    await orca.policyDetailPage.backDateSection.saveButton.click();
    await orca.policyDetailPage.backDateSection.saveButton.waitWhileControlDisappears();
    await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully updated effective dates for this policy.');
    await orca.footerSection.logoutButton.click();
    await orca.footerSection.logoutButton.waitWhileControlDisappears();
  });

  await test.step('Step 2: Create claim via helper', async () => {
    claim_id = await quoteToolHelper.createAccountAndClaim('PPI', fake_email);
  });

  await test.step('Step 3: Assign claim and move to Processing', async () => {
    orca = new OrcaPageManager(page);
    await navigation.openBrandWebPage(BrandUrl.ORCA);
    await loginToOrca(page, Role.ClaimSpecialist);
    await orca.menuTopSection.searchClaim(claim_id);
    const currentUserLogged = await orca.footerSection.getUserLogged();
    await orca.claimDetailPage.assistantCustomSelect.selectOptionByPartialText(currentUserLogged);
    await orca.claimDetailPage.saveButton.click();
    await orca.claimDetailPage.tabsClaimDetailSection.clickTabOption(TabClaimOptions.attachmentTab);
    await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.verifyClaimsResultLinkLoaded();
    await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.claimsResultLink.clickAndWait();
    const pdfLink = await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.getLinkForClaimPDFByName('Claims Form');
    expect(pdfLink, 'ERROR, the link for the PDF is empty').not.toBe('');
    await orca.claimDetailPage.submitToProcessingButton.click();
    await orca.claimDetailPage.alertSection.verifySuccessAlertText('Successfully updated 1 claims to claim status 2.');
    expect(await orca.claimDetailPage.statusLabel.getText()).toContain('Processing');
  });

  await test.step('Step 4: Add losses data and reprocess', async () => {
    await orca.claimDetailPage.tabsClaimDetailSection.clickTabOption(TabClaimOptions.processingTab);
    await orca.claimDetailPage.tabsClaimDetailSection.processingTabSection.addLossesButton.click();
    const after_3_days = getDateWithSpecificFormat(3);
    await orca.lossDetailPage.dateOfServiceTextBox.click();
    await orca.lossDetailPage.dateOfServiceTextBox.setTextAndTab(after_3_days);
    await orca.lossDetailPage.saveButton.click();
    await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully saved loss details');
    await orca.lossDetailPage.petSelect.firstValueAndWait();
    await orca.lossDetailPage.searchAndSelectVet();
    await orca.lossDetailPage.saveButton.click();
    await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully saved loss details');
    const approvedData: Partial<LossDetailApprovedTableData> = { procedure: '99999', description: 'Ciprofloxacin', submitted: '100', allowed: '100' };
    await orca.lossDetailPage.fillTheApprovedTable(approvedData);
    await orca.lossDetailPage.saveButton.click();
    await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully saved loss details');
    await orca.lossDetailPage.returnToClaimApprovedButton.click();
    expect(await orca.claimDetailPage.underwriterLabel.getText()).toContain('Independence Pet Insurance Company');
    const statusText = await orca.claimDetailPage.statusLabel.getText();
    expect.soft(['Received', 'Processing'], "ERROR! current status should be: Received or Processing").toContain(statusText);
    if (statusText.includes('Received')) {
      const currentUserLogged = await orca.footerSection.getUserLogged();
      await orca.claimDetailPage.assignToMeButton.click();
      await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully assigned claim ' + claim_id + ' to ' + currentUserLogged);
      await orca.claimDetailPage.submitToProcessingButton.click();
      await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully updated 1 claims to claim status 2');
    }
  });

  await test.step('Step 5: Navigate policy coverage, pet details, and return to claim', async () => {
    await orca.menuTopSection.searchPolicy(policy_id);
    await orca.policyDetailPage.tabsPolicyDetailSection.clickTabOption(TabPolicyOptions.coverageTab);
    await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.activeLink.click();
    expect(await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.coveragePeriodLink.isDisplayed()).toBeTruthy();
    await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.plusPetDetailButton.click();
    await orca.policyDetailPage.tabsPolicyDetailSection.clickTabOption(TabPolicyOptions.petTab);
    await orca.policyDetailPage.tabsPolicyDetailSection.petTabSection.petsTable.waitForVisible();
    await orca.policyDetailPage.tabsPolicyDetailSection.petTabSection.petsTable.clickOnLinkCell(pet_name);
    expect(await orca.petDetailPage.petDetailLabel.isDisplayed()).toBeTruthy();
    await orca.menuTopSection.searchClaim(claim_id);
    await orca.claimDetailPage.tabsClaimDetailSection.clickTabOption(TabClaimOptions.processingTab);
    await orca.claimDetailPage.tabsClaimDetailSection.processingTabSection.clickOnViewDeleteCellForPet(pet_name, false);
  });

  await test.step('Step 6: Add incident, finalize losses and download EOB', async () => {
    await orca.lossDetailPage.incidentsPlusButton.clickAndWait();
    await orca.lossDetailPage.incidentModal.createIncident();
    await orca.lossDetailPage.approvedTable.selectFirstValue(orca.lossDetailPage.incidentColumnCell.position, 1);
    await orca.lossDetailPage.saveApprovedButton.click();
    await orca.lossDetailPage.saveOverviewButton.click();
    await orca.lossDetailPage.alertSection.verifySuccessAlertText('Successfully saved loss details');
    await orca.lossDetailPage.returnToClaimOverviewButton.click();
    await orca.claimDetailPage.setAdjusterNoteInFrame('This is a test');
    await orca.claimDetailPage.saveButton.click();
    await orca.claimDetailPage.finalizeAllLossesButton.click();
    await orca.claimDetailPage.alertSection.verifySuccessAlertText('Successfully finalized 1 loss(es)');
    const EOB_link = await orca.claimDetailPage.previewEOBButton.getAttribute('href');
    await downloadPdf(page, config.URL_ORCA + EOB_link, policy_id.toString(), 'EOB.pdf');
    const pdfText = await getTextPDF(policy_id.toString(), 'EOB.pdf');
    expect(pdfText).toContain('PPI-CLAIM-EOB');
    const currentTabsBeforeEOB = context.pages();
    await navigation.clickAndGetNewTab(orca.claimDetailPage.previewEOBButton);
    const currentTabsAfterEOB = context.pages();
    expect(currentTabsAfterEOB.length).toBe(currentTabsBeforeEOB.length + 1);
    await context.close();
  });

  await test.step('Step 7: Complete processing and approve claim in new context', async () => {
    const browser = await chromium.launch();
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    orca = new OrcaPageManager(newPage);
    await newPage.goto(BrandUrl.ORCA);
    await loginToOrca(newPage, Role.ClaimSpecialist);
    await orca.menuTopSection.searchClaim(claim_id);
    const currentUserLogged = await orca.footerSection.getUserLogged();
    await orca.claimDetailPage.auditorCustomSelect.selectOptionByPartialText(currentUserLogged);
    await orca.claimDetailPage.saveButton.click();
    await orca.claimDetailPage.completeProcessingButton.click();
    await orca.claimDetailPage.alertSection.verifySuccessAlertText('Successfully updated 1 claims to claim status');
    expect(await orca.claimDetailPage.statusLabel.getText()).toContain('In Audit');
    await orca.claimDetailPage.approveButton.clickAndWait();
    await orca.claimDetailPage.alertSection.verifySuccessAlertText('Claim completed successfully.');
    const statusText = await orca.claimDetailPage.statusLabel.getText();
    expect(['Finalized', 'Ready to Issue']).toContain(statusText);
    await newContext.close();
    await browser.close();
  });
});
