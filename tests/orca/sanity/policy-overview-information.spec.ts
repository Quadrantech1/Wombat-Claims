import { expect, test } from '@fixtures/base-fixtures';
import { OrcaPageManager } from '@pages/page-managers/orca-page-manager';
import { QuoteToolHelper } from '@test-helpers/quote-tool-helper';
import { BrandFullName, BrandUrl } from '@utils/brand-util';
import { getDateWithSpecificFormat } from '@utils/date-util';
import { loginToOrca } from '@utils/login-orca-util';

test('Orca > Verify user can look up a policy information', { tag: ['@Sanity', '@Regression', '@Policy', '@11305'] }, async ({ page, navigation }) => {
  const quoteToolHelper = new QuoteToolHelper(page);
  let policy_id: string;
  let orca = new OrcaPageManager(page);

  await test.step('Step 1: Create policy via helper', async () => {
    policy_id = await quoteToolHelper.createLegacyPolicy('PPI', {
      annualLimit: '$10,000',
      deductible: '$250',
      coinsurance: '20%',
      coverageType: 'custom',
      cardNumber: '4111111111111111',
    });
  });

  await test.step('Step 2: Login and navigate to policy', async () => {
    await navigation.openBrandWebPage(BrandUrl.ORCA);
    await loginToOrca(page);
    await orca.menuTopSection.searchPolicy(policy_id);
  });

  await test.step('Step 3: Verify overview information', async () => {
    const today_date = getDateWithSpecificFormat(0, 'M/d/yyyy');
    const expectedValues: { [key: string]: string } = {
      'Policy No': policy_id,
      'Market Channel': BrandFullName.PPI,
      'Created On': today_date,
      'Status': 'Active',
      'Delivery Type': 'Email',
      'Payment Frequency': 'Monthly',
      'Hold Payment': 'No',
      'Sold By:': 'web server',
      'Partner': 'PetPartners',
      'Linked Policy(ies)': 'N/A',
    };
    for (const [control, expected] of Object.entries(expectedValues)) {
      const value = await orca.policyDetailPage.getValueFromControl(control);
      expect(value.trim()).toBe(expected);
    }
  });
});
