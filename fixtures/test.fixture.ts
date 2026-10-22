import { test as base, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { OnlineProviderReviewPage } from '../pages/online-provider-review.page';

type FrameworkFixtures = {
  authPage: AuthPage;
  reviewPage: OnlineProviderReviewPage;
};

export const test = base.extend<FrameworkFixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  reviewPage: async ({ page }, use) => {
    await use(new OnlineProviderReviewPage(page));
  },
});

export { expect };
