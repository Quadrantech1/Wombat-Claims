import { expect, test } from '@fixtures/base-fixtures';
import { HamburgerMenuOptions } from '@pages/orca/common-section/menu-top-section';
import { LegacyQuotePageManager } from '@pages/page-managers/legacy-quote-page-manager';
import { OrcaPageManager } from '@pages/page-managers/orca-page-manager';
import { BrandUrl } from '@utils/brand-util';
import { loginToOrca } from '@utils/login-orca-util';

test('PreProdReleaseOrca > Verify Orca login is successful and Admin Dashboard links are visible',
    { tag: ['@PreProdRelease', '@PreProdOrca'] }, async ({ navigation, page }) => {
        await test.step('Step 1: Verify Orca login is successful', async () => {
            const orca = new OrcaPageManager(page);
            await navigation.openBrandWebPage(BrandUrl.ORCA);
            await loginToOrca(page);

            await orca.menuTopSection.clickMenuOption(HamburgerMenuOptions.Admin);
            await orca.adminDashboardPage.verifyLinksAreVisible();
        });
    });

test('PreProdReleaseAKC > Create a quote and drop at checkout AKC',
    { tag: ['@PreProdRelease', '@PreProdAKC'] }, async ({ navigation, page }) => {
        await test.step('Step 1: Create a quote and drop at checkout', async () => {
            const quote = new LegacyQuotePageManager(page);
            await navigation.openBrandWebPage(BrandUrl.AKC + '?au=orcaautomationtesting');
            await quote.getQuotePage.fillGetQuote({
                petName: 'PreProdReleaseTestPPI',
                email: 'PreProdReleaseTestPPI@yopmail.com'
            });
            await quote.getQuotePage.customerSourceSelect.selectOption('Email');
            await quote.getQuotePage.clickChooseCoverage();
            await quote.coveragePage.addToCartButton.click();
            await expect(quote.completeEnrollmentPage.enrollNowButton.getLocator()).toBeVisible();
        });
    });


test('PreProdReleasePPI > Create a quote and drop at checkout PPI',
    { tag: ['@PreProdRelease', '@PreProdPPI'] }, async ({ page }) => {
        await test.step('Step 1: Create a quote and drop at checkout', async () => {
            const quote = new LegacyQuotePageManager(page);
            await page.goto(BrandUrl.PPI + '?au=orcaautomationtesting', { waitUntil: 'domcontentloaded' });

            await quote.getQuotePage.fillGetQuote({
                petName: 'PreProdReleaseTestPPI',
                email: 'PreProdReleaseTestPPI@yopmail.com'
            });
            await quote.getQuotePage.customerSourceSelect.selectOption('Email');
            await quote.getQuotePage.clickChooseCoverage();
            await quote.coveragePage.addToCartButton.click();
            await expect(quote.completeEnrollmentPage.enrollNowButton.getLocator()).toBeVisible();
        });
    });