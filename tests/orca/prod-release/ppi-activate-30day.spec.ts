import { expect, test } from '@fixtures/base-fixtures';
import { HamburgerMenuOptions } from '@pages/orca/common-section/menu-top-section';
import { TabPolicyOptions } from '@pages/orca/policy/tabs-policy-detail-section';
import { LegacyQuotePageManager } from '@pages/page-managers/legacy-quote-page-manager';
import { OrcaPageManager } from '@pages/page-managers/orca-page-manager';
import { MailosaurService } from '@services/mailosaur-service';
import { BrandFullName, BrandUrl } from '@utils/brand-util';
import { getDateWithSpecificFormat, getYearsAgoDate, getYesterdayDate } from '@utils/date-util';
import { generateMailosaurEmail } from '@utils/email-util';
import { loginToOrca } from '@utils/login-orca-util';
import { buildWeeklyThirtyDayPetData } from '@utils/prod-test-data-util';
import { getRandomValue } from '@utils/random-values-util';
import { timeouts } from '@utils/timeouts-util';

test('ProdReleasePPI > Activate 30 day coverage and verify Orca, Attachments and Email',
    { tag: ['@OrcaWebApp', '@ProdRelease', '@ProdReleasePPI'] }, async ({ navigation, page, context }) => {
        const orca = new OrcaPageManager(page);
        const mailosaurService = new MailosaurService();
        const randomValue = getRandomValue();
        const todayDateFormatted = getDateWithSpecificFormat(0, 'M/d/yyyy');

        const weeklyProfile = buildWeeklyThirtyDayPetData('ppi-30-day');
        const testData = {
            petName: 'TestPet' + randomValue,
            age: weeklyProfile.age,
            breed: weeklyProfile.breed,
            zipCode: weeklyProfile.zipCode,
            species: weeklyProfile.species,
            email: generateMailosaurEmail('Test', randomValue.concat('_4')),
            registrationNo: `Test${randomValue}4`
        };
        let policyId = '';

        await test.step('Step 1: Create McLead registration for PPI via Orca', async () => {
            await navigation.openBrandWebPage(BrandUrl.ORCA);
            await loginToOrca(page);

            await orca.menuTopSection.clickMenuOption(HamburgerMenuOptions.Mclead);
            await orca.mcLeadDetailsPage.addRegistrationsButton.click();

            await orca.mcLeadRegistrationPage.fillRegistration({
                petDetails: {
                    registrationNo: testData.registrationNo,
                    registrationDate: getYesterdayDate(),
                    petName: testData.petName,
                    marketChannel: BrandFullName.PPI,
                    dateOfBirth: getYearsAgoDate(testData.age),
                    breed: testData.breed,
                    species: testData.species,
                },
                customerDetails: {
                    firstName: `FN${randomValue}`,
                    lastName: `LN${randomValue}`,
                    address1: `${randomValue} Test St`,
                    city: 'TestCity',
                    postalCode: testData.zipCode,
                    email: testData.email,
                    phone: '123' + randomValue
                }
            });
            await orca.mcLeadRegistrationPage.addRegistrationButton.click(timeouts.long);
            await expect(page.getByText('Successfully added registration')).toBeVisible();
        });

        await test.step('Step 2: Create PPI 30 day cert using Orca Mclead registration', async () => {
            const ppiTab = await context.newPage();
            await ppiTab.goto(BrandUrl.PPI + '?au=orcaautomationtesting', { waitUntil: 'domcontentloaded' });
            const quote = new LegacyQuotePageManager(ppiTab);
            await expect(quote.getQuotePage.lookUpPetButton.getLocator()).toBeVisible();
            await expect(quote.getQuotePage.lookUpPetButton.getLocator()).toBeEnabled();
            await quote.getQuotePage.lookUpPetButton.click();
            await quote.getQuotePage.registrationNumberTextBox.setText(testData.registrationNo);
            await quote.getQuotePage.zipCodeRegistrationTextBox.setText(testData.zipCode);
            await quote.getQuotePage.lookUpPetButton.click();
            await expect(quote.getQuotePage.zipCodeTextBox.getLocator()).toBeDisabled();

            await quote.getQuotePage.customerSourceSelect.selectValue('Web');
            await quote.getQuotePage.chooseCoverageButton.click();

            await expect(quote.coveragePage.customizeYourPlanLabel.getLocator()).toBeVisible();

            await quote.coveragePage.activateInitial30Day.click();
            await expect(quote.completeEnrollmentPage.enrollNowButton.getLocator()).toBeVisible();

            const policyTotal = await quote.completeEnrollmentPage.policyOverviewCostLabel.getText();
            expect(policyTotal).toContain('0.00');

            await quote.completeEnrollmentPage.checkAgreementOptions();
            await quote.completeEnrollmentPage.enrollNowButton.click(timeouts.long);

            await expect(quote.congratulationsEnrollmentPage.congratulationsLabel.getLocator()).toBeVisible();

            policyId = await quote.congratulationsEnrollmentPage.getPolicyNumber();
        });

        await test.step('Step 3: Verify policy details in Orca app', async () => {
            await orca.menuTopSection.hamburgerMenuTabs.click();
            await orca.menuTopSection.searchPolicy(policyId);
            expect(await orca.policyDetailPage.getValueFromControl('Policy No')).toContain(policyId);
            expect(await orca.policyDetailPage.getValueFromControl('Market Channel')).toBe(BrandFullName.PPI);
            expect(await orca.policyDetailPage.getValueFromControl('Created On')).toBe(todayDateFormatted);
            expect(await orca.policyDetailPage.getValueFromControl('Status')).toBe('Active');
            expect(await orca.policyDetailPage.getValueFromControl('Delivery Type')).toBe('Email');
            expect(await orca.policyDetailPage.getValueFromControl('Payment Frequency')).toBe('Monthly');
            expect(await orca.policyDetailPage.getValueFromControl('Hold Payment')).toBe('No');
            expect(await orca.policyDetailPage.getValueFromControl('Partner')).toBe('PetPartners');
        });

        await test.step('Step 4: Verify Coverage & Premium tracker', async () => {
            await orca.policyDetailPage.tabsPolicyDetailSection.clickTabOption(TabPolicyOptions.coverageTab);
            await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.upcomingLink.click();
            await orca.policyDetailPage.tabsPolicyDetailSection.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears(timeouts.default);
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.upcomingPetDetailTable.isValueDisplayedInTable(testData.petName)).toBeTruthy();
            const cpId = await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.getTheCpId('Upcoming');
            const tomorrow = getDateWithSpecificFormat(1, 'M/d/yyyy');
            const futureDate = getDateWithSpecificFormat(30, 'M/d/yyyy');
            await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.premiumTrackerLink.click();
            await orca.policyDetailPage.tabsPolicyDetailSection.coverageTabSection.premiumTrackerTable.verifyRowsInTable([
                [cpId, tomorrow, futureDate, 'IGNORE', 'IGNORE']
            ]);
        });

        await test.step('Step 5: Verify Transactions', async () => {
            await orca.policyDetailPage.tabsPolicyDetailSection.clickTabOption(TabPolicyOptions.transactionTab);
            await orca.policyDetailPage.tabsPolicyDetailSection.loadingSection.loadingSpinnerTableValueIcon.waitWhileControlDisappears(timeouts.default);
            await orca.policyDetailPage.tabsPolicyDetailSection.transactionTabSection.transactionTypeTable.verifyRowsInTable([
                ['IGNORE', 'IGNORE', 'N/A', 'Invoice', todayDateFormatted, 'IGNORE', 'IGNORE'],
                ['IGNORE', 'Payment (Capture)', 'Certificate Payment', 'Certificate Payment', todayDateFormatted, 'IGNORE', '$0.00']
            ]);
        });

        await test.step('Step 6: Verify email and attachment content', async () => {
            const subject = `Policy: ${policyId} Welcome to the Family!`;
            expect(await mailosaurService.hasEmailWithSubject(testData.email, subject, timeouts.long)).toBeTruthy();
            const welcomeAttachmentsList = await mailosaurService.getAttachmentsList(testData.email, subject);
            const expectedWelcomeAttachments = ['Welcome - 30 Day.pdf', 'Declarations Page.pdf', 'Terms and Conditions.pdf', 'Generic Cover Page.pdf', 'E-Consent Notice.pdf', 'Privacy Policy.pdf'];

            for (const attachment of expectedWelcomeAttachments) {
                expect(welcomeAttachmentsList).toContain(attachment);
            }
        });

        await test.step('Step 7: Verify Attachments in Orca', async () => {
            await orca.policyDetailPage.tabsPolicyDetailSection.clickTabOption(TabPolicyOptions.attachmentTab);
            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.verifyTerm1AndOtherAttachmentsLoaded();
            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.term1Link.click();
            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.termsAndConditionsLink.click();
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.verifyDocumentHasText('Terms and Conditions', 'Terms and Conditions', policyId)).toBeTruthy();

            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.documentsAndLettersLink.click();
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.verifyDocumentHasText('Privacy Policy', 'This Privacy Notice is provided for your information', policyId)).toBeTruthy();

            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.declarationsLink.click();
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.verifyDocumentHasText('Declarations', ['POLICY DECLARATIONS PAGE', String(policyId)], policyId)).toBeTruthy();

            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.otherLink.click();
            await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.otherDocumentsAndLettersLink.click();
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.verifyDocumentHasText('Welcome Letter', ['Welcome to the PetPartners, Inc. Family!', String(policyId)], policyId)).toBeTruthy();
            expect(await orca.policyDetailPage.tabsPolicyDetailSection.attachmentTabSection.verifyDocumentHasText('E-Consent Notice', 'CONSUMER CONSENT TO THE ELECTRONIC DELIVERY OF RECORDS & DOCUMENTS', policyId)).toBeTruthy();
        });

        await test.step('Step 8: Update policy status to void', async () => {
            await orca.policyDetailPage.statusSelect.selectOption('Void');
            await orca.policyDetailPage.saveButton.click();
            expect(await orca.policyDetailPage.alertSection.successfullyAlertLabel.getText()).toContain('Successfully updated Policy details');
        });

        await test.info().attach('PPI 30 Day policyId: ' + policyId, { body: Buffer.from(JSON.stringify(testData, null, 2)), contentType: 'application/json' });
    });
