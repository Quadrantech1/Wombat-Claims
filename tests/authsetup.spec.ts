import { test } from '../fixtures/test.fixture';
import fs from 'fs';
import path from 'path';
import authData from '../test-data/online-provider.json';

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

const envPath = path.resolve(__dirname, '..', '.env');
loadEnvFile(envPath);

const authStatePath = path.resolve('playwright/.auth/user.json');
const email = process.env.EPHESOFT_EMAIL;
const password = process.env.EPHESOFT_PASSWORD;

test.use({ storageState: undefined });

test('refreshes authenticated storage state', async ({ page, authPage }) => {
  if (!email || !password) {
    throw new Error('Set EPHESOFT_EMAIL and EPHESOFT_PASSWORD before refreshing the Playwright auth state.');
  }

  // Refresh auth state by removing any previous file before saving the new one.
  if (fs.existsSync(authStatePath)) {
    fs.rmSync(authStatePath, { force: true });
  }

  await page.context().clearCookies();
  await page.goto(authData.authUrl);
  await authPage.signIn(email, password);

  fs.mkdirSync(path.dirname(authStatePath), { recursive: true });
  await page.context().storageState({ path: authStatePath });
});