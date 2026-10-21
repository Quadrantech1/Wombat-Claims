import { Button } from '@controls/button';
import { BasePage } from '@pages/base-page';
import { SalesAddRemovePetTabSection } from './sales-add-remove-pet-tab-section';

import { SalesOwnerTabSection } from './sales-owner-tab-section';
import { SalesSummaryTabSection } from './sales-summary-tab-section';
import { TopSalesSection } from './top-sales-section';
import { SalesEnrollmentTabSection } from './sales-enrrollment-tab-section';
import { LoadingCoverBarSection } from '../common/loading-cover-bar-section';

export class SalesPage extends BasePage {

    ownerInformationTab = new Button(this.page, "//li[contains(text(),'Owner')]");
    addRemovePetTab = new Button(this.page, "//li[contains(text(),'Add / Remove Pet')]");
    enrollmentInformationTab = new Button(this.page, "//li[contains(text(),'Enrollment Information')]");
    summaryTab = new Button(this.page, "//li[contains(text(),'Summary')]");


    salesOwnerInformationTabSection = new SalesOwnerTabSection(this.page);
    salesEnrollmentTabSection = new SalesEnrollmentTabSection(this.page);
    salesAddRemovePetTabSection = new SalesAddRemovePetTabSection(this.page);
    salesSummaryTabSection = new SalesSummaryTabSection(this.page);

    topSalesSection = new TopSalesSection(this.page);

    loadingCoverBarSection = new LoadingCoverBarSection(this.page);

}

