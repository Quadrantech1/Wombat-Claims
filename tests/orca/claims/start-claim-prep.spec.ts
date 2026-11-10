import { test } from '@fixtures/api-fixtures';
import { TabClaimOptions } from '@pages/orca/claim/tabs-claim-detail-section';
import { HamburgerMenuOptions } from '@pages/orca/common-section/menu-top-section';
import { TabPolicyOptions } from '@pages/orca/policy/tabs-policy-detail-section';
import { OrcaScreenManager } from '@pages/page-managers/orca-page-manager';
import { BrandUrl } from '@utils/brand-util';
import { getDateWithSpecificFormat } from '@utils/date-util';
import { downloadPdf } from '@utils/download-util';
import { loginToOrca } from '@utils/login-orca-util';

const claimAttachmentsFolder = 'claim-attachments';

test('Orca > Confirm prerequisites are met before preparing to start a claim', { tag: ['@Regression', '@Orca', '@ClaimsTest'] }, async ({ page, navigation }) => {
    let orca: OrcaScreenManager;
    let policy_id: string;
    let tomorrow_date: string;
    let future_date: string;
    let nameOnClaimsDetails: string;


    await test.step('Step 1: Sign in to Orca and open the claims home page', async () => {
        orca = new OrcaScreenManager(page);
        tomorrow_date = getDateWithSpecificFormat(1);
        future_date = getDateWithSpecificFormat(30); // 30 days from now
        await navigation.openBrandWebPage(BrandUrl.ORCA);
        await loginToOrca(page);
        await orca.menuTopSection.hamburgerMenuTabs.click();
        // await orca.menuTopSection.claimsAngularTab.click();
        // await orca.menuTopSection.searchPolicy(policy_id);
        await orca.menuTopSection.hamburgerMenuTabs.click();
        await orca.menuTopSection.chooseEntryFromHamburger(HamburgerMenuOptions.Claims);
    });

    await test.step('Step 2: Launch the start-claim preparation flow', async () => {
        await orca.claimDashboard.startPreparingClaimButton.clickAndWait();
        await orca.claimDashboard.assignedLink.clickAndWait();
        await orca.claimDashboard.assignedTable.clickFirstRow();
        await orca.claimDashboard.assignedTable.waitForDisappear();
    });
    await test.step('Step 4: Open a fresh claim using default settings', async () => {
        // await orca.policyDetailPage.tabsPolicyDetailSection.claimTabSection.addNewClaimButton.clickAndWait();
        nameOnClaimsDetails = (await orca.claimDetailPage.readNameFromClaimDetails()).toString();

        await orca.claimDetailPage.tabsClaimDetailSection.openTab(TabClaimOptions.attachmentTab);
        await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.confirmClaimResultLinkLoaded();
        await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.claimsResultLink.clickAndWait();

        const claimsFormLink = await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.claimPdfLinkNamed('Claims', 'Claims Form');
        await downloadPdf(page, claimsFormLink, claimAttachmentsFolder, 'claims-form.pdf');

        const invoiceLink = await orca.claimDetailPage.tabsClaimDetailSection.attachmentTabSection.claimPdfLinkNamed('Uploaded Files', 'Uploaded File');
        await downloadPdf(page, invoiceLink, claimAttachmentsFolder, 'invoice.pdf');

        await orca.claimDetailPage.returnToPolicyButton.clickAndWait();
        await orca.policyDetailPage.tabsPolicyDetailSection.openTab(TabPolicyOptions.customerTab);
        // await orca.policyDetailPage.c
        await page.goBack();
    });


});