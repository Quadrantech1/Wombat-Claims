import { expect, test } from '@fixtures/base-fixtures';
import { HamburgerMenuOptions } from '@pages/orca/common-section/menu-top-section';
import { TabPolicyOptions } from '@pages/orca/policy/tabs-policy-detail-section';
import { OrcaScreenManager } from '@pages/page-managers/orca-page-manager';
import { MailosaurService } from '@services/mailosaur-service';
import { BrandFullName, BrandUrl } from '@utils/brand-util';
import { getDateWithSpecificFormat } from '@utils/date-util';
import { generateMailosaurEmail } from '@utils/email-util';
import { loginToOrca } from '@utils/login-orca-util';
import { buildWeeklyQuotePolicyPetData } from '@utils/prod-test-data-util';
import { getRandomValue } from '@utils/random-values-util';
import { timeouts } from '@utils/timeouts-util';

test('ProdReleasePPI > Create a policy via Quote API, then validate Orca records, attachments and email',
    { tag: ['@OrcaWebApp', '@ProdRelease', '@ProdReleasePPI'] }, async ({ navigation, page }) => {
        const orca = new OrcaScreenManager(page);
        const mailosaurService = new MailosaurService();
        const randomValue = getRandomValue();
        const todayDateFormatted = getDateWithSpecificFormat(0, 'M/d/yyyy');

        const weeklyProfile = buildWeeklyQuotePolicyPetData('ppi-quote-api');
        const testData = {
            petName: 'Test' + randomValue,
            age: weeklyProfile.age,
            breed: weeklyProfile.breed,
            zipCode: weeklyProfile.zipCode,
            species: weeklyProfile.species,
            email: generateMailosaurEmail('Test', randomValue.concat('_5')),
        };

        const context = {} as { policyId: string; cookies: any[] };


        await test.step('Step 1: Issue a policy through the Quote API flow', async () => {
            await navigation.openBrandWebPage(BrandUrl.ORCA);
            await loginToOrca(page);

            await orca.menuTopSection.chooseMenuEntry(HamburgerMenuOptions.Admin);
            await orca.adminDashboardPage.confirmLinksDisplayed();
            await orca.adminDashboardPage.quoteApiLink.click();

            await orca.quoteApiPage.populateMainDetails({
                zipCode: testData.zipCode,
                marketChannel: 'PET - PetPartners, Inc.',
                email: testData.email
            });

            await orca.quoteApiPage.addNewpetButton.click();
            await orca.quoteApiPetCreationPage.populatePetDetailsForm({
                petName: testData.petName,
                petBreed: testData.breed,
                petType: testData.species,
                petAge: String(testData.age)
            });

            await orca.quoteApiPetCreationPage.nextButton.click();
            await orca.quoteApiCustomInfoPage.deductibleSelect.selectOption('$250');
            await orca.quoteApiCustomInfoPage.coinsuranceSelect.selectOption('20%');
            await orca.quoteApiCustomInfoPage.annualLimitsSelect.selectOption('$10,000');
            await orca.quoteApiCustomInfoPage.incidentLimitsSelect.selectOption('Unlimited');
            await orca.quoteApiCustomInfoPage.chooseCoverageType(testData.age);
            await orca.quoteApiPetCreationPage.createButton.click();
            await orca.quoteApiPetCreationPage.nextButton.click();
            await orca.quoteApiBillingPage.populateFieldsButton.click();
            await orca.quoteApiBillingPage.nextButton.click();
            context.policyId = (await orca.quoteApiPage.policyIdLabel.getText()).trim();
            expect(context.policyId).not.toBe('');
            await orca.quoteApiPage.gotoPolicyButton.click();
        });

        await test.step('Step 2: Validate policy information in the Orca application', async () => {
            expect(await orca.policyDetailPage.readControlValue('Policy No')).toContain(context.policyId);
            expect(await orca.policyDetailPage.readControlValue('Market Channel')).toBe(BrandFullName.PPI);
            expect(await orca.policyDetailPage.readControlValue('Created On')).toBe(todayDateFormatted);
            expect(await orca.policyDetailPage.readControlValue('Status')).toBe('Active');
            expect(await orca.policyDetailPage.readControlValue('Delivery Type')).toBe('Email');
            expect(await orca.policyDetailPage.readControlValue('Payment Frequency')).toBe('Monthly');
            expect(await orca.policyDetailPage.readControlValue('Hold Payment')).toBe('No');
            expect(await orca.policyDetailPage.readControlValue('Partner')).toBe('N/A');
        });

        await test.step('Step 3: Validate the Coverage & Premium tracker', async () => {
            await orca.policyDetailPage.tabsPolicyDetailSection.openTab(TabPolicyOptions.coverageTab);
            await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.upcomingLink.click();
            await orca.policyDetailPage.tabsPolicyDetailSection.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears(timeouts.default);
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.upcomingPetDetailTable.isValueDisplayedInTable(testData.petName)).toBeTruthy();
            const cpId = await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.readCpId('Upcoming');
            const tomorrow = getDateWithSpecificFormat(1, 'M/d/yyyy');
            const futureDate = getDateWithSpecificFormat(365, 'M/d/yyyy');
            await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.premiumTrackerLink.click();
            await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.premiumTrackerTable.verifyRowsInTable([
                [cpId, tomorrow, futureDate, 'IGNORE', 'IGNORE']
            ]);
        });

        await test.step('Step 4: Modify the policy coverage', async () => {
            await orca.policyDetailPage.tabsPolicyDetailSection.openTab(TabPolicyOptions.coverageTab);
            await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.upcomingLink.click();
            await orca.policyDetailPage.tabsPolicyDetailSection.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears(timeouts.default);
            await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.makeChangesUpcomingButton.click();
            await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.makeChangesOption.click();
            await orca.quoteDetailsPage.petTableMakeChangesButton.clickAndWait('networkidle', timeouts.long);
            await orca.policyMakeChangesPage.chooseLimitForCurrentPlan('Deductible', '$100');
            await orca.policyMakeChangesPage.chooseLimitForCurrentPlan('Deductible Frequency', 'Annual Term');
            await orca.policyMakeChangesPage.chooseLimitForCurrentPlan('Coinsurance', '20%');
            await orca.policyMakeChangesPage.chooseLimitForCurrentPlan('Coverage Limit', '$10,000');
            await orca.policyMakeChangesPage.chooseLimitForCurrentPlan('Incident Limit', 'Unlimited');
            await orca.policyMakeChangesPage.saveButtonMakeChangesPage.clickAndWait();
            await orca.quoteDetailsPage.saveButton.clickAndWait();
            await orca.quoteDetailsPage.pressPlusForPetInCoverageTable(testData.petName);
            await expect(orca.quoteDetailsPage.productNameInCoverageSummaryTableLabel.getLocator()).toBeVisible();
            const expectedRows = [['IGNORE', 'Unlimited', '$100', 'Annual Term', '20%', '$10,000', 'IGNORE', 'IGNORE']];
            await orca.quoteDetailsPage.coverageSummaryTable.verifyRowsInTable(expectedRows);
            await orca.quoteDetailsPage.returnToPolicyButton.click();
            await orca.policyDetailPage.discardChangesButton.click();
            await orca.policyDetailPage.alertSection.yesRemoveDialogButton.click();
            await orca.policyDetailPage.alertSection.confirmSuccessAlertMessage('Successfully discarded all quote changes');
        });

        await test.step('Step 5: Validate email body and attachment content', async () => {
            const subject = `Policy: ${context.policyId} Welcome to the Family!`;
            expect(await mailosaurService.hasEmailWithSubject(testData.email, subject, timeouts.long)).toBeTruthy();
            const welcomeAttachmentsList = await mailosaurService.getAttachmentsList(testData.email, subject);
            const expectedWelcomeAttachments = ['Welcome Letter.pdf', 'Declarations Page.pdf', 'Terms and Conditions.pdf', 'Generic Cover Page.pdf', 'E-Consent Notice.pdf', 'Privacy Policy.pdf'];

            for (const attachment of expectedWelcomeAttachments) {
                expect(welcomeAttachmentsList).toContain(attachment);
            }
        });

        await test.step('Step 6: Validate attachments listed in Orca', async () => {
            await orca.policyDetailPage.tabsPolicyDetailSection.openTab(TabPolicyOptions.attachmentTab);
            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.confirmTerm1AndOtherAttachmentsLoaded();

            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.term1Link.click();
            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.termsAndConditionsLink.click();
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.confirmDocumentContainsText('Terms and Conditions', 'Terms and Conditions', context.policyId)).toBeTruthy();

            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.documentsAndLettersLink.click();
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.confirmDocumentContainsText('Privacy Policy', 'This Privacy Notice is provided for your information', context.policyId)).toBeTruthy();

            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.declarationsLink.click();
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.confirmDocumentContainsText('Declarations', ['POLICY DECLARATIONS PAGE', String(context.policyId)], context.policyId)).toBeTruthy();

            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.otherLink.click();
            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.otherDocumentsAndLettersLink.click();
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.confirmDocumentContainsText('Welcome Letter', ['WELCOME TO THE PetPartners, Inc. FAMILY!', String(context.policyId)], context.policyId)).toBeTruthy();
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.confirmDocumentContainsText('E-Consent Notice', 'CONSUMER CONSENT TO THE ELECTRONIC DELIVERY OF RECORDS & DOCUMENTS', context.policyId)).toBeTruthy();
        });

        await test.step('Step 7: Change the policy status to void', async () => {
            await orca.policyDetailPage.statusSelect.selectOption('Void');
            await orca.policyDetailPage.saveButton.click();
            expect(await orca.policyDetailPage.alertSection.successfullyAlertLabel.getText()).toContain('Successfully updated Policy details');
        });

        await test.info().attach('ppi-quote-api policyId:' + context.policyId, { body: Buffer.from(JSON.stringify(testData, null, 2)), contentType: 'application/json' });

    });
