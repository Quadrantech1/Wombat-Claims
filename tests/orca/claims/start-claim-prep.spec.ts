import { test } from '@fixtures/api-fixtures';
import { HamburgerMenuOptions } from '@pages/orca/common-section/menu-top-section';
import { TabPolicyOptions } from '@pages/orca/policy/tabs-policy-detail-section';
import { OrcaPageManager } from '@pages/page-managers/orca-page-manager';
import { BrandUrl } from '@utils/brand-util';
import { getDateWithSpecificFormat } from '@utils/date-util';
import { loginToOrca } from '@utils/login-orca-util';

test('Orca > Verify preReq for start claim prep', { tag: ['@Regression', '@Orca', '@ClaimsTest'] }, async ({ page, navigation }) => {
    let orca: OrcaPageManager;
    let policy_id: string;
    let tomorrow_date: string;
    let future_date: string;
    let nameOnClaimsDetails: string;


    await test.step('Step 1: Login to Orca and navigate to claims home page', async () => {
        orca = new OrcaPageManager(page);
        tomorrow_date = getDateWithSpecificFormat(1);
        future_date = getDateWithSpecificFormat(30); // 30 days from now
        await navigation.openBrandWebPage(BrandUrl.ORCA);
        await loginToOrca(page);
        await orca.menuTopSection.hamburgerMenuTabs.click();
        // await orca.menuTopSection.claimsAngularTab.click();
        // await orca.menuTopSection.searchPolicy(policy_id);
        await orca.menuTopSection.hamburgerMenuTabs.click();
        await orca.menuTopSection.clickMenuOptionUsingHamburgerIcon(HamburgerMenuOptions.Claims);
    });

    await test.step('Step 2: Click on start claim prep', async () => {
        // await orca.claimDashboard.startPreparingClaimButton.clickAndWait();
        await orca.claimDashboard.startPreparingClaimButton.clickAndWait();
        await page.waitForTimeout(2000);
        await page.reload();
        await orca.claimDashboard.assignedLink.clickAndWait();
        await orca.claimDashboard.assignedTable.clickFirstRow();
        await orca.claimDashboard.assignedTable.waitForDisappear();
    });
    await test.step('Step 4: Create new claim with default settings', async () => {
        // await orca.policyDetailPage.tabsPolicyDetailSection.claimTabSection.addNewClaimButton.clickAndWait();
        nameOnClaimsDetails = (await orca.claimDetailPage.getNameOnClaimsDetails()).toString();

        await orca.claimDetailPage.returnToPolicyButton.clickAndWait();
        await orca.policyDetailPage.tabsPolicyDetailSection.clickTabOption(TabPolicyOptions.customerTab);
        // await orca.policyDetailPage.c
        await page.goBack();
    });


});
