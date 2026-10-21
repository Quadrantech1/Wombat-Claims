import { test as base } from '@fixtures/base-fixtures';

type AspcaFixtures = {
    mockReCaptchaScore: void;
};

// ASPCA/Sidney's invisible reCAPTCHA v3 scores automated browsers low (~0.1), keeping "See My Rates"
// disabled below the site's score threshold. We only have UI access (no API team access to the verify
// endpoint), so every Sidney/ASPCA test auto-intercepts that call and raises the score before it reaches the page.
export const test = base.extend<AspcaFixtures>({
    mockReCaptchaScore: [async ({ page }, use) => {
        await page.route('**/api/q/reCaptcha/**', async (route) => {
            const response = await route.fetch();
            const body = await response.json();
            await route.fulfill({ response, json: { ...body, success: true, score: 0.9 } });
        });
        await use();
    }, { auto: true }],
});

export { expect } from '@fixtures/base-fixtures';
