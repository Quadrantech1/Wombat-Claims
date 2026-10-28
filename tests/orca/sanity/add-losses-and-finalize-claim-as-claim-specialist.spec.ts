import { config } from '@config/env-config';
import { LossDetailApprovedTableData } from '@data/orca/loss-detail-approved-table-data';
import { faker } from '@faker-js/faker/locale/en';
import { expect, test } from '@fixtures/base-fixtures';
import { TabClaimOptions } from '@pages/orca/claim/tabs-claim-detail-section';
import { PolicyActionOptionEnum } from '@pages/orca/policy/policy-detail-page';
import { TabPolicyOptions } from '@pages/orca/policy/tabs-policy-detail-section';
import { OrcaScreenManager } from '@pages/page-managers/orca-page-manager';
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

test('Orca > Claim specialist can record losses and finalize a claim', { tag: ['@Sanity', '@Regression', '@Claims', '@23083'] }, async ({ page, context, navigation }) => {
  const quoteToolHelper = new QuoteToolHelper(page);
  const fake_email = generateMailosaurEmail('Sanity', getRandomValue());
  const pet_name = faker.animal.dog();
  let policy_id: string;
  let claim_id: string;
  let orca = new OrcaScreenManager(page);

  await test.step('Step 1: Set up a policy and backdate it', async () => {
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
    await orca.menuTopSection.lookupPolicy(policy_id);
    await orca.policyDetailPage.chooseOptionFromPolicyActions(PolicyActionOptionEnum.BackdateFullTermPolicy);
    await orca.policyDetailPage.backDateSection.applyEffectiveDateAndCoveragePeriod(yesterday, 'first');
    await orca.policyDetailPage.backDateSection.saveButton.click();
    await orca.policyDetailPage.backDateSection.saveButton.waitWhileControlDisappears();
    await orca.lossDetailPage.alertSection.confirmSuccessAlertMessage('Successfully updated effective dates for this policy.');
    await orca.footerSection.logoutButton.click();
    await orca.footerSection.logoutButton.waitWhileControlDisappears();
  });

  await test.step('Step 2: Open a claim using the helper', async () => {
    claim_id = await quoteToolHelper.createAccountAndClaim('PPI', fake_email);
  });

  await test.step('Step 3: Assign the claim and advance it to Processing', async () => {
    orca = new OrcaScreenManager(page);
    await navigation.openBrandWebPage(BrandUrl.ORCA);
    await loginToOrca(page, Role.ClaimSpecialist);
    await orca.menuTopSection.lookupClaim(claim_id);
    const currentUserLogged = await orca.footerSection.currentLoggedInUser();
    await orca.claimDetailPage.assistantCustomSelect.selectOptionByPartialText(currentUserLogged);
    await orca.claimDetailPage.saveButton.click();
    await orca.claimDetailPage.tabsClaimDetailSection.openTab(TabClaimOptions.attachmentTab);
    await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.confirmClaimResultLinkLoaded();
    await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.claimsResultLink.clickAndWait();
    const pdfLink = await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.claimPdfLinkNamed('Claims Form');
    expect(pdfLink, 'ERROR, the link for the PDF is empty').not.toBe('');
    await orca.claimDetailPage.submitToProcessingButton.click();
    await orca.claimDetailPage.alertSection.confirmSuccessAlertMessage('Successfully updated 1 claims to claim status 2.');
    expect(await orca.claimDetailPage.statusLabel.getText()).toContain('Processing');
  });

  await test.step('Step 4: Enter loss data and run reprocessing', async () => {
    await orca.claimDetailPage.tabsClaimDetailSection.openTab(TabClaimOptions.processingTab);
    await orca.claimDetailPage.tabsClaimDetailSection.processingTabSection.addLossesButton.click();
    const after_3_days = getDateWithSpecificFormat(3);
    await orca.lossDetailPage.dateOfServiceTextBox.click();
    await orca.lossDetailPage.dateOfServiceTextBox.setTextAndTab(after_3_days);
    await orca.lossDetailPage.saveButton.click();
    await orca.lossDetailPage.alertSection.confirmSuccessAlertMessage('Successfully saved loss details');
    await orca.lossDetailPage.petSelect.firstValueAndWait();
    await orca.lossDetailPage.findAndChooseVet();
    await orca.lossDetailPage.saveButton.click();
    await orca.lossDetailPage.alertSection.confirmSuccessAlertMessage('Successfully saved loss details');
    const approvedData: Partial<LossDetailApprovedTableData> = { procedure: '99999', description: 'Ciprofloxacin', submitted: '100', allowed: '100' };
    await orca.lossDetailPage.populateApprovedTable(approvedData);
    await orca.lossDetailPage.saveButton.click();
    await orca.lossDetailPage.alertSection.confirmSuccessAlertMessage('Successfully saved loss details');
    await orca.lossDetailPage.returnToClaimApprovedButton.click();
    expect(await orca.claimDetailPage.underwriterLabel.getText()).toContain('Independence Pet Insurance Company');
    const statusText = await orca.claimDetailPage.statusLabel.getText();
    expect.soft(['Received', 'Processing'], "ERROR! current status should be: Received or Processing").toContain(statusText);
    if (statusText.includes('Received')) {
      const currentUserLogged = await orca.footerSection.currentLoggedInUser();
      await orca.claimDetailPage.assignToMeButton.click();
      await orca.lossDetailPage.alertSection.confirmSuccessAlertMessage('Successfully assigned claim ' + claim_id + ' to ' + currentUserLogged);
      await orca.claimDetailPage.submitToProcessingButton.click();
      await orca.lossDetailPage.alertSection.confirmSuccessAlertMessage('Successfully updated 1 claims to claim status 2');
    }
  });

  await test.step('Step 5: Visit policy coverage and pet details, then go back to the claim', async () => {
    await orca.menuTopSection.lookupPolicy(policy_id);
    await orca.policyDetailPage.tabsPolicyDetailSection.openTab(TabPolicyOptions.coverageTab);
    await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.activeLink.click();
    expect(await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.coveragePeriodLink.isDisplayed()).toBeTruthy();
    await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.plusPetDetailButton.click();
    await orca.policyDetailPage.tabsPolicyDetailSection.openTab(TabPolicyOptions.petTab);
    await orca.policyDetailPage.tabsPolicyDetailSection.petTabSection.petsTable.waitForVisible();
    await orca.policyDetailPage.tabsPolicyDetailSection.petTabSection.petsTable.clickOnLinkCell(pet_name);
    expect(await orca.petDetailPage.petDetailLabel.isDisplayed()).toBeTruthy();
    await orca.menuTopSection.lookupClaim(claim_id);
    await orca.claimDetailPage.tabsClaimDetailSection.openTab(TabClaimOptions.processingTab);
    await orca.claimDetailPage.tabsClaimDetailSection.processingTabSection.pressViewDeleteCellForPet(pet_name, false);
  });

  await test.step('Step 6: Attach an incident, finalize losses and download the EOB', async () => {
    await orca.lossDetailPage.incidentsPlusButton.clickAndWait();
    await orca.lossDetailPage.incidentModal.raiseIncident();
    await orca.lossDetailPage.approvedTable.selectFirstValue(orca.lossDetailPage.incidentColumnCell.position, 1);
    await orca.lossDetailPage.saveApprovedButton.click();
    await orca.lossDetailPage.saveOverviewButton.click();
    await orca.lossDetailPage.alertSection.confirmSuccessAlertMessage('Successfully saved loss details');
    await orca.lossDetailPage.returnToClaimOverviewButton.click();
    await orca.claimDetailPage.writeAdjusterNoteInFrame('This is a test');
    await orca.claimDetailPage.saveButton.click();
    await orca.claimDetailPage.finalizeAllLossesButton.click();
    await orca.claimDetailPage.alertSection.confirmSuccessAlertMessage('Successfully finalized 1 loss(es)');
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

  await test.step('Step 7: Finish processing and approve the claim in a separate context', async () => {
    const browser = await chromium.launch();
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    orca = new OrcaScreenManager(newPage);
    await newPage.goto(BrandUrl.ORCA);
    await loginToOrca(newPage, Role.ClaimSpecialist);
    await orca.menuTopSection.lookupClaim(claim_id);
    const currentUserLogged = await orca.footerSection.currentLoggedInUser();
    await orca.claimDetailPage.auditorCustomSelect.selectOptionByPartialText(currentUserLogged);
    await orca.claimDetailPage.saveButton.click();
    await orca.claimDetailPage.completeProcessingButton.click();
    await orca.claimDetailPage.alertSection.confirmSuccessAlertMessage('Successfully updated 1 claims to claim status');
    expect(await orca.claimDetailPage.statusLabel.getText()).toContain('In Audit');
    await orca.claimDetailPage.approveButton.clickAndWait();
    await orca.claimDetailPage.alertSection.confirmSuccessAlertMessage('Claim completed successfully.');
    const statusText = await orca.claimDetailPage.statusLabel.getText();
    expect(['Finalized', 'Ready to Issue']).toContain(statusText);
    await newContext.close();
    await browser.close();
  });
});
