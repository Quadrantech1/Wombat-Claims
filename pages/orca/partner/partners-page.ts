import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { LoadingSection } from './../common-section/loading-section';

export class PartnersPage extends BasePage {
    addPartnerLink = new Link(this.page, "//a[contains(text(),'Add Partner')]");
    groupBillingDashboardLink = new Link(this.page, "//a[contains(text(),'Group Billings')]");
    addGroupBillingLink = new Link(this.page, "//a[contains(text(),'Add Group Billing')]");
    partnerNameTextBox = new TextBox(this.page, "//input[@id = 'SearchCriteria_Display' and @type ='text']");
    partnerCodeTextBox = new TextBox(this.page, "#SearchCriteria_Code");
    marketChannelSelect = new Select(this.page, "#SearchCriteria_MarketChannelId");
    partnersRunSearchButton = new Button(this.page, "#btn-run-search");
    clearSearchButton = new Button(this.page, "//a[contains(text(),'Clear')]");
    partnerResultTable = new Table(this.page, "//table[@id='partners-table']");
    affiliateNamePartnerTextBox = new TextBox(this.page, "#SearchCriteria_AffiliateName");
    defaultAffinityGroupSelect = new Select(this.page, this.page.getByLabel('Default Affinity Group'));
    loadingSection = new LoadingSection(this.page);
}
