import { OppPdfDownloadPage } from '@pages/marketing-sites/opp/opp-pdf-download-page';
import { OppResourcesPage } from '@pages/marketing-sites/opp/opp-resources-page';
import { Page } from '@playwright/test';
import { BasePageManager } from './base-page-manager';

export class MarketingPageManager extends BasePageManager {

    readonly opp: {
        resourcesPage: OppResourcesPage;
        pdfDownloadPage: OppPdfDownloadPage;
    };

    constructor(page: Page) {
        super(page);
                this.opp = {
            resourcesPage: new OppResourcesPage(page),
            pdfDownloadPage: new OppPdfDownloadPage(page),
        };
    }
    forPage(newPage: Page): MarketingPageManager {
        return new MarketingPageManager(newPage);
    }
}
