import { ClaimPage } from '@pages/wombat/claims/claim-page';
import { LeftMenuSection } from '@pages/wombat/common/left-menu-section';
import { CustomerPage } from '@pages/wombat/customer-service/customer-page';
import { CustomerServiceDashboardPage } from '@pages/wombat/customer-service/customer-service-dashboard-page';
import { LoginPage } from '@pages/wombat/login/login-page';
import { SalesPage } from '@pages/wombat/sales/sales-page';
import { Page } from '@playwright/test';
import { BasePageManager } from './base-page-manager';

export class WombatPageManager extends BasePageManager {

    //   readonly mainPage: MainPage;
    readonly loginPage: LoginPage;
    readonly leftMenuSection: LeftMenuSection;
    readonly customerPage: CustomerPage;
    readonly customerServiceDashboardPage: CustomerServiceDashboardPage;

    readonly salesPage: SalesPage;
    readonly claimPage: ClaimPage;

    constructor(page: Page) {
        super(page);
        this.loginPage = new LoginPage(page);
        this.leftMenuSection = new LeftMenuSection(page);
        this.customerPage = new CustomerPage(page);
        this.customerServiceDashboardPage = new CustomerServiceDashboardPage(page);
        this.salesPage = new SalesPage(page);
        this.claimPage = new ClaimPage(page);
    }
    /**
     * Create a new manager for a different page (e.g., new tab)
     * @param newPage - The new page instance
     * @returns New WombatPageManager instance
     */
    forPage(newPage: Page): WombatPageManager {
        return new WombatPageManager(newPage);
    }
}