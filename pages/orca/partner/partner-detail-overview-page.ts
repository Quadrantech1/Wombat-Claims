import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { CustomSelectSpan } from '@controls/custom-select';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { getDefaultPartnerDetailOverview, PartnerDetailOverview } from '@data/orca/partner-detail-overview-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class PartnerDetailOverviewPage extends BasePage {
    partnerNameTextBox = new TextBox(this.page, "//input[@id = 'partner-detail-form-display' and @type ='text']");
    partnerCodeTextBox = new TextBox(this.page, "//input[@id = 'partner-detail-form-code' and @type ='text']");
    defaultAffinityGroupSelect = new Select(this.page, "//select[@id='partner-detail-form-affinity-group-id']");
    partnerTypeSelect = new Select(this.page, "//select[@id='partner-detail-form-partner-type-id']");
    npnTextBox = new TextBox(this.page, "//input[@id = 'partner-detail-form-npn']");
    designatedPhoneNumberTextBox = new TextBox(this.page, "#partner-detail-form-designated-phone-number");
    hyperlinkTextBox = new TextBox(this.page, "#partner-detail-form-hyperlink");
    partnerLandingPageHyperlinkLabel = new Label(this.page, "//label[contains(text(),'Partner Landing Page Hyperlink')]");
    countryCodeSelect = new Select(this.page, "#partner-detail-form-country-code");
    partnerDetailSaveButton = new Button(this.page, "#saveButton");
    affiliateTextBox = new TextBox(this.page, "//input[@data-element-to-update=\"AffiliateId\"]");
    activeCheckBox = new Checkbox(this.page, "#partner-detail-form-active");
    editButton = new Button(this.page, "//h5/../button/*");
    affiliateSelect = new CustomSelectSpan(this.page, "//ng-select[@id=\"partner-detail-form-affiliate-id\"]/..//input", "span", "//ng-select[@id=\"partner-detail-form-affiliate-id\"]/..//input");
    accountManagerSelect = new CustomSelectSpan(this.page, "//ng-select[@id=\"partner-detail-form-account-manager-id\"]/..//input", "span", "//ng-select[@id=\"partner-detail-form-account-manager-id\"]/..//input");
    marketChannelSelect = new Select(this.page, this.page.getByLabel('Market Channel'));

    /**
     * Fills partner detail overview details
     * @param partnerDetails - Partial partner detail overview data
     */
    async fillPartnerDetailOverview(partnerDetails?: Partial<PartnerDetailOverview>): Promise<void> {
        const data = { ...getDefaultPartnerDetailOverview(), ...partnerDetails };
        logger.info(`[PartnerDetailOverviewPage.fillPartnerDetailOverview] - Filling partner detail overview`);
        await this.partnerNameTextBox.setText(data.partnerName);
        await this.activeCheckBox.check();
        await this.partnerCodeTextBox.setText(data.partnerCode);
        await this.marketChannelSelect.selectOption(data.marketChannel);
        await this.defaultAffinityGroupSelect.selectOption(data.defaultAffinityGroup);
        await this.partnerTypeSelect.selectOption(data.partnerType);
        await this.npnTextBox.setText(data.npn);
        await this.designatedPhoneNumberTextBox.setText(data.designatedPhone);
        await this.accountManagerSelect.setAndSelectContainsValue("Auto Claims");
    }
}
