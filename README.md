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

## Extract claim JSON from an image or PDF

From the `Wombat-Claims` directory, run:

```powershell
npm run ocr:claim -- --document "C:\path\to\invoice.pdf" --output "C:\path\to\invoice.json"
```

Omit `--output` to write `<document-name>.json` next to the image or PDF. Use
`--document` for either file type; the legacy `--image` option remains supported for
images. See
[`docs/CLAIM_OCR_INTEGRATION.md`](docs/CLAIM_OCR_INTEGRATION.md) for setup and the
complete integration flow.

`ClaimOcrService` runs the existing Python parser from Playwright code and saves
the claim JSON next to the source document by default. It returns the parsed result and
does not upload the image to a browser or submit a claim:

```typescript
import { ClaimOcrService } from '@services/claim-ocr-service';

const extraction = await new ClaimOcrService().parseDocumentToJson(
    'C:\\path\\to\\invoice.pdf',
    'C:\\path\\to\\invoice.claim.json'
);
console.log(extraction.status, extraction.claim_metadata);
```

By default, the service expects the sibling `bpi_playwright_handoff_repo` directory
and its `.venv-py312` environment. Override these locations with
`CLAIM_OCR_PROJECT_ROOT` and `CLAIM_OCR_PYTHON` when needed. The OCR dependencies
and model files must already be installed in that Python environment. Results remain
`needs_review` until checked against the source invoice; do not use OCR output as
authorization to submit a claim.
