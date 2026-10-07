import type { Page } from '@playwright/test';

export class AuthPage {
  constructor(private readonly page: Page) {}

  async signIn(email: string, password: string): Promise<void> {
    const emailInput = this.page.locator(
      'input[type="email"], input[autocomplete="username"], input[name*="email" i], input[id*="email" i]',
    ).first();
    const passwordInput = this.page.locator(
      'input[type="password"], input[autocomplete="current-password"]',
    ).first();

    if (!(await emailInput.isVisible({ timeout: 10000 }).catch(() => false))) {
      throw new Error('Could not find the visible email input on the sign-in page.');
    }
    if (!(await passwordInput.isVisible({ timeout: 10000 }).catch(() => false))) {
      throw new Error('Could not find the visible password input on the sign-in page.');
    }

    await emailInput.fill(email);
    await passwordInput.fill(password);

    const submitButton = this.page.getByRole('button', { name: /sign in|log in|continue/i }).first();
    if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await submitButton.click();
      return;
    }

    const submitInput = this.page.locator('input[type="submit"]').first();
    if (await submitInput.isVisible({ timeout: 500 }).catch(() => false)) {
      await submitInput.click();
      return;
    }

    throw new Error('Could not find a visible sign-in submit button.');
  }
}
