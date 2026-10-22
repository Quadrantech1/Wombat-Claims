import { config } from '@config/env-config';
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authStatePath = path.resolve('playwright/.auth/user.json');
const refreshAuth = process.env.PW_REFRESH_AUTH;
const shouldUseAuthState = refreshAuth !== '1' && fs.existsSync(authStatePath);

// Centralized base "use" options (shared across all projects)
const baseUse = {
    baseURL: 'https://cfpet.ephesoft.cloud/dcma/BatchList.html',
    storageState: shouldUseAuthState ? authStatePath : undefined,
    headless: false,
    viewport: { width: 1365, height: 768 },
    actionTimeout: 60_000,
    navigationTimeout: 60_000,
    trace: 'retain-on-failure' as const,
    screenshot: 'only-on-failure' as const,
    video: 'retain-on-failure' as const,
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    timezoneId: 'America/New_York',
    locale: 'en-US'
};

// Desktop baseline (Chrome) – maximize window & common args
const desktopChrome = {
    ...devices['Desktop Chrome'],
    launchOptions: {
        slowMo: config.SLOWMO,
        args: [
            '--start-maximized',
            '--window-size=2120,1400',
            '--no-sandbox',
            '--disable-web-security'
        ]
    }
};

// Mobile emulation
const mobile = {
    ...devices['iPhone 14'],
    launchOptions: {
        slowMo: config.SLOWMO
    }
};

const inDocker = process.env.RUNNING_IN_DOCKER === 'true';
const tag = process.env.TAG || '';
const isProdRelease = tag.includes('ProdRelease') || tag.includes('PreProdRelease');
const isPreCommit = tag.includes('PreCommit');

function getRetries(): number {
    if (isProdRelease) return 0;
    if (isPreCommit || inDocker) return 1;
    return 0;
}
const retries = getRetries();

export default defineConfig({
    testDir: './tests',
    outputDir: './test-results',
    snapshotPathTemplate: './test-files/snapshots/{testFilePath}/{arg}{ext}',
    timeout: 20 * 60_000,
    reportSlowTests: null,
    expect: {
        timeout: 60_000,
        toHaveScreenshot: {
            maxDiffPixels: 0
        }
    },
    retries: retries,
    fullyParallel: true,
    workers: process.env.CI ? 2 : 4,
    reporter: [
        ['html', { outputFolder: './playwright-report/html-report', open: 'never' }],
        ['json', { outputFile: './playwright-report/playwright-results.json', open: 'never' }],
        ['junit', { outputFile: './playwright-report/playwright-results.xml', open: 'never' }],
        // ['allure-playwright', { detail: true }],
        ['list'],
        ['./test-results-reporter.ts']
    ],
    // Base use merged with env extras
    use: { ...baseUse },
    projects: [
        // All tests NOT tagged @Mobile+@API+@Canada run in desktop Chrome
        { name: 'main-tests', testDir: './tests', grepInvert: /@Mobile|@API|@Canada/, use: { ...desktopChrome } },

        // All UI tests tagged @Canada run in desktop Chrome
        { name: 'canada-tests', testDir: './tests/orca-ca', grep: /@Canada/, use: { ...desktopChrome } },

        // All tests tagged @Mobile run in mobile emulation
        { name: 'mobile-tests', testDir: './tests', grep: /@Mobile/, use: { ...mobile } },

        // API-focused (reduced artifacts for speed)
        { name: 'api-tests', testDir: './tests', grep: /@API/, grepInvert: /@Canada/, use: { ...desktopChrome, screenshot: 'off', video: 'off', trace: 'off' } },

        // Canada API tests (reduced artifacts for speed)
        { name: 'canada-api-tests', testDir: './tests/api/canada', grep: /@Canada/, use: { ...desktopChrome, screenshot: 'off', video: 'off', trace: 'off' } },

        // Unit tests (no heavy artifacts)        npx playwright show-report docker-report/playwright-report/html-report
        { name: 'unit-tests', testDir: './unit-test', use: { ...desktopChrome, screenshot: 'off', video: 'off', trace: 'off' } }
    ]
});
