import { expect, test } from '@fixtures/base-fixtures';
import { HamburgerMenuOptions } from '@pages/orca/common-section/menu-top-section';
import { LegacyQuotePageManager } from '@pages/page-managers/legacy-quote-page-manager';
import { OrcaScreenManager } from '@pages/page-managers/orca-page-manager';
import { BrandUrl } from '@utils/brand-util';
import { loginToOrca } from '@utils/login-orca-util';

test('PreProdReleaseOrca > Confirm Orca sign-in succeeds and Admin Dashboard links are displayed',
    { tag: ['@PreProdRelease', '@PreProdOrca'] }, async ({ navigation, page }) => {
        await test.step('Step 1: Confirm Orca sign-in succeeds', async () => {
            const orca = new OrcaScreenManager(page);
            await navigation.openBrandWebPage(BrandUrl.ORCA);
            await loginToOrca(page);

            await orca.menuTopSection.chooseMenuEntry(HamburgerMenuOptions.Admin);
            await orca.adminDashboardPage.confirmLinksDisplayed();
        });
    });

test('PreProdReleaseAKC > Start an AKC quote and stop at checkout',
    { tag: ['@PreProdRelease', '@PreProdAKC'] }, async ({ navigation, page }) => {
        await test.step('Step 1: Start a quote and stop at checkout', async () => {
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


test('PreProdReleasePPI > Start a PPI quote and stop at checkout',
    { tag: ['@PreProdRelease', '@PreProdPPI'] }, async ({ page }) => {
        await test.step('Step 1: Start a quote and stop at checkout', async () => {
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