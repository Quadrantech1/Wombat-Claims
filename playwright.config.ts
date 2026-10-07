import { defineConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authStatePath = path.resolve('playwright/.auth/user.json');
const refreshAuth = process.env.PW_REFRESH_AUTH;
const shouldUseAuthState = refreshAuth !== '1' && fs.existsSync(authStatePath);

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 1200000,
  fullyParallel: true,
  reportSlowTests: null,
  use: {
    baseURL: 'https://cfpet.ephesoft.cloud/dcma/BatchList.html',
    storageState: shouldUseAuthState ? authStatePath : undefined,
    headless: false,
    viewport: { width: 1365, height: 768 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
