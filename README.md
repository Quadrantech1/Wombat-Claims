# Claims Playwright framework

This repository contains the PPI Claims Playwright automation framework and supports
the conversion of QA automation from Selenium to Playwright. It combines the existing
automation suite with the claims document-validation page objects and reusable fixtures.

## Structure

- `components/` reusable UI components, including transaction-table interactions
- `fixtures/` extended Playwright fixtures for page objects
- `pages/` page objects for authentication and review/validation
- `tests/` Playwright specs
- `test-data/` non-secret test URLs and input data
- `utils/` shared test utilities
- `playwright.config.ts` browser, timeout, and saved-auth configuration

## Setup

```powershell
npm install
npm run install:browsers
Copy-Item .env.example .env
```

Set `EPHESOFT_EMAIL` and `EPHESOFT_PASSWORD` in `.env` before creating an authenticated
storage state. The generated `playwright/.auth/user.json` is ignored by Git.

## Run

```powershell
npm run test:auth-setup
npm run test:online-provider
npm run typecheck
```

`npm test` runs the existing suite through `test-runner.ts`. The focused scripts run
the authentication setup and online-provider validation specs. Playwright launches
Chromium in headed mode by default, matching the existing document-review workflow.
