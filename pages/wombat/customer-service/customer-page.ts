import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { RadioButton } from '@controls/radio-button';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { BillingInformationSection } from './billing-information-section';
import { ClaimViewSection } from './claim-view-section';
import { CustomerInformationSection } from './customer-information-section';
import { CustomerNotesSection } from './customer-notes-section';
import { CustomerPetInformationSection } from './customer-pet-information-section';
import { PaymentInfoSection } from './payment-info-section';
import { LoadingCoverBarSection } from '../common/loading-cover-bar-section';

export class CustomerPage extends BasePage {
    customerSearchTextBox = new TextBox(this.page, '#mat-input-3');
    searchButton = new Button(this.page, "//button[contains(.,'search')]");
    notesButton = new Button(this.page, "//button[contains(.,'Notes')]");
    filesButton = new Button(this.page, "//button[contains(.,'Files')]");
    scriptsButton = new Button(this.page, "//button[contains(.,'Scripts')]");
    // Customer Information
    customerInfoLabel = new Label(this.page, "//div[@class='custName']");
    customerAccountNoLabel = new Label(this.page, "//span[@class='accountNo-text']");
    customerInfoButton = new Button(this.page, "#btncustInfo");
    // Billing
    navigateBillingIconButton = new Button(this.page, "//mat-icon[text()='assignment']");
    billingInfoButton = new RadioButton(this.page, "#btnBillingInfo");

    // Reimbursements

    // Pet Information
    petInfoButton = new Button(this.page, "#btnaccountInfo");

    // Invoices
    invoicesInfoButton = new Button(this.page, "#btnbillingView");
    // Claims
    claimsInfoButton = new Button(this.page, "#btnClaims");


    // section
    customerInformationSection = new CustomerInformationSection(this.page);
    customerNotesSection = new CustomerNotesSection(this.page);
    customerPetInformationSection = new CustomerPetInformationSection(this.page);
    paymentInfoSection = new PaymentInfoSection(this.page);
    billingInformationSection = new BillingInformationSection(this.page);
    claimViewSection = new ClaimViewSection(this.page);

    // 
    backButton = new Button(this.page, "//customer-info-widget//div[contains(text(),'Back')]");

    loadingCoverBarSection = new LoadingCoverBarSection(this.page);
    async checkIfAllSectionAreDisplayed(): Promise<boolean> {
        let customerInformationLabel = new Label(this.page, "//mat-card-title[contains(.,'Customer Information')]");
        let billingLabel = new Label(this.page, "//mat-card-title[contains(.,'Billing')]");
        let reimbursementsLabel = new Label(this.page, "//mat-card-title[contains(.,'Reimbursements')]");
        let petInformationLabel = new Label(this.page, "//mat-card-title[contains(.,'Pet Information')]");
        let invoicesLabel = new Label(this.page, "//mat-card-title[contains(.,'Invoices')]");
        let claimsLabel = new Label(this.page, "//mat-card-title[contains(.,'Claims')]");

        const sections = [
            customerInformationLabel,
            billingLabel,
            reimbursementsLabel,
            petInformationLabel,
            invoicesLabel,
            claimsLabel,
        ];

        const results = await Promise.all(sections.map((section) => section.isDisplayed()));
        const allDisplayed = results.every(Boolean);
        logger.info(`[CustomerPage>checkIfAllSectionAreDisplayed] All sections displayed: ${allDisplayed}`);
        return allDisplayed;
    }

    async isSuccessMessageDisplayed(message: string): Promise<boolean> {
        let successMessageLabel = new Label(this.page, `//custom-snack-bar/p[contains(text(),'${message}')]`);
        const isDisplayed = await successMessageLabel.isDisplayed();
        logger.info(`[CustomerPage>isSuccessMessageDisplayed] Success message displayed: ${isDisplayed}, message: "${message}"`);
        return isDisplayed;
    }

}
