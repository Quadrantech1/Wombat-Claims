import { Button } from '@controls/button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export enum HamburgerMenuOptions {
  Admin = 'Admin',
  Affiliate = 'Affiliate',
  Breeder = 'Breeder',
  Claims = 'Claims',
  Customer = 'Customer',
  Finance = 'Finance',
  Partner = 'Partner',
  Mclead = 'Mclead',
  Policy = 'Policy',
  Receiving = 'Receiving',
  Vet = 'Vet',
  MarketChannels = 'Market Channels',
  Certificates = 'Certificate',

}

export class MenuTopSection extends BasePage {

  //Tabs
  claimsAngularTab = new Button(this.page, "//nav[@class='top-nav layout__container']/*/li/a[contains(text(),' Claims ')]");
  policyTab = new Button(this.page, '//li[@id="policy-nav-li"]//a');
  hamburgerMenuTabs = new Button(this.page, this.page.locator('#orca-nav-dropdown-a, #navbar-dropdown-menu'));

  // search section
  searchPoliciesTextBox = new TextBox(this.page, "//input[@placeholder='Search ']");
  selectSearchPolicyOrClaim = new Select(this.page, "//select[@id='optSearch']");
  goButton = new Button(this.page, "//button[@id='btnSearch' or @id='btnSearchGroup']");

  // search section angular
  searchPoliciesTextBoxAngular = new TextBox(this.page, "//input[@placeholder='Search Policies']");
  goButtonAngular = new Button(this.page, "//input[@placeholder='Search Policies']/../button");

  async searchPolicy(policy: string | number): Promise<void> {
    logger.info("MenuTopSection>searchPolicy > search policy: " + policy);
    await this.selectSearchPolicyOrClaim.selectOption('Policy');
    await this.searchPoliciesTextBox.setText(String(policy));
    await this.goButton.clickAndWait();
  }

  async searchPolicyAngular(policy: string | number): Promise<void> {
    logger.info("[MenuTopSection>searchPolicyAngular] > search policy: " + policy);
    await this.searchPoliciesTextBoxAngular.setText(String(policy));
    await this.goButtonAngular.clickAndWait();
  }

  async searchClaim(claim: string | number): Promise<void> {
    logger.info("[MenuTopSection>searchClaim] > search claim: " + claim);
    await this.selectSearchPolicyOrClaim.selectOption('Claim');
    await this.searchPoliciesTextBox.setText(String(claim));
    await this.goButton.clickAndWait();
  }

  async clickMenuOption(option: HamburgerMenuOptions): Promise<void> {
    logger.info("[MenuTopSection>clickMenuOption] - Clicking on Menu Option: " + option);
    await this.page.waitForLoadState('load');
    if (await this.hamburgerMenuTabs.isDisplayed()) {
      await this.clickMenuOptionUsingHamburgerIcon(option);
    } else {
      await this.clickMenuOptionUsingTopMenu(option);
    }
  }

  async clickMenuOptionUsingTopMenu(option: HamburgerMenuOptions): Promise<void> {
    logger.info(`[MenuTopSection>clickMenuOptionUsingTopMenu] - Clicking on Top Menu Option: ${option}`);

    const isAngularTopMenu = await this.page.locator('//nav[@class="top-nav layout__container"]').count() > 0;
    let optionMenu;
    logger.info(`[MenuTopSection>clickMenuOptionUsingTopMenu] - isAngularTopMenu: ${isAngularTopMenu}`);
    if (isAngularTopMenu) {
      logger.info("[MenuTopSection.clickMenuOptionUsingTopMenu] - Using hover for Angular dropdown");
      optionMenu = new Button(this.page, `//li/a[@routerlinkactive='active-link' and contains(text(),'${option}')]`);
    } else {
      logger.info("[MenuTopSection>click Legacy Menu] - Using click for legacy dropdown");
      optionMenu = new Button(this.page, `//a[not(contains(@id,'nav-dropdown')) and not(@ngbdropdownitem) and text()='${option}']`);
    }
    await optionMenu.click();
  }

  async clickMenuOptionUsingHamburgerIcon(option: HamburgerMenuOptions): Promise<void> {
    logger.info("[MenuTopSection>clickOnHamburgerIcon] - Opening Hamburger Menu");
    await this.page.waitForLoadState('load');

    // Check if it's the new Angular dropdown (has ngbdropdown attribute)
    const isAngularDropdown = await this.page.locator('#navbar-dropdown-menu').count() > 0;
    let optionMenu;
    if (isAngularDropdown) {
      logger.info("[MenuTopSection> click Angular Hamburger Menu] - Using hover for Angular dropdown");
      await this.hamburgerMenuTabs.hover();
      optionMenu = new Button(this.page, `//div/a[@routerlinkactive='active-link' and contains(text(),'${option}')]`);
    } else {
      logger.info("[MenuTopSection>click Legacy Hamburger Menu] - Using click for legacy dropdown");
      await this.hamburgerMenuTabs.click();
      optionMenu = new Button(this.page, `//a[(contains(@id,'nav-dropdown') or @ngbdropdownitem or contains(@class,'dropdown-item')) and normalize-space(.)='${option}']`);
    }
    await optionMenu.click();
  }
}

