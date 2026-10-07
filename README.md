# Claims Playwright framework

This project uses Playwright Test with page objects and reusable fixtures.

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

`npm test` runs all specs in `tests/`. Tests launch Chromium in headed mode by default,
matching the existing document-review workflow.
