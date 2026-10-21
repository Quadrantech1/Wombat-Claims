import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { getDefaultOwnerInfoData, type OwnerInfoData } from '@data/wombat/owner-info-data';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { LoadingCoverBarSection } from '../common/loading-cover-bar-section';

export class SalesOwnerTabSection extends BasePage {

    /******************  owner information Tab************************/
    brandSelect = new Select(this.page, '#brand');
    marketSourceTextBox = new TextBox(this.page, '#marketSourceDescription');
    priorityCodeTextBox = new TextBox(this.page, '#priorityCodeDescription');
    firstNameTextBox = new TextBox(this.page, '#owner-first-name');
    lastNameTextBox = new TextBox(this.page, '#owner-last-name');
    street1TextBox = new TextBox(this.page, '#street1');
    street2TextBox = new TextBox(this.page, '#street2');
    zipTextBox = new TextBox(this.page, '#zip');
    stateSelect = new Select(this.page, '#state');
    cityTextBox = new TextBox(this.page, '#city');
    primaryPhoneTextBox = new TextBox(this.page, '#phone');
    phoneUseSelect = new Select(this.page, '#phoneUse');
    emailTextBox = new TextBox(this.page, '#email');
    efectiveDateTextBox = new TextBox(this.page, '#effectiveDate');
    preferredLanguageSelect = new Select(this.page, '//div[contains(text(),"Preferred Language")]/../mat-select');
    payrollDeductionCheckBox = new Checkbox(this.page, '#payrollDeduction');
    addPetButton = new Button(this.page, '//span[text()="Add Pet"]');

    yesPaperlessRadioButton = new Button(this.page, '//label[contains(.,\'Yes\')]');
    noPaperlessRadioButton = new Button(this.page, '//label[contains(.,\'No\')]');


    async fillOwnerInformationForm(ownerInfoData: OwnerInfoData): Promise<void> {
        const formData = { ...getDefaultOwnerInfoData(), ...ownerInfoData };
        logger.info('[SalesOwnerTabSection.fillOwnerInformationForm] Filling owner information form with data: ' + JSON.stringify(formData));
        await this.page.waitForTimeout(timeouts.veryShort);
        await this.brandSelect.waitForVisible();
        const loadingCoverBarSection = new LoadingCoverBarSection(this.page);
        await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
        if (formData.brand) {
            await this.brandSelect.selectOptionSpan(formData.brand);
            await this.page.waitForTimeout(timeouts.veryShort);
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
        }
        if (formData.marketSource) {
            await this.marketSourceTextBox.setText(formData.marketSource);
            const marketSourceOption = this.page.getByText(formData.marketSource, { exact: false });
            await marketSourceOption.click();
            await this.page.waitForTimeout(timeouts.veryShort);
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
        }
        if (formData.priorityCode) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.priorityCodeTextBox.setText(formData.priorityCode);
        }
        if (formData.firstName) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.firstNameTextBox.setText(formData.firstName);
        }
        if (formData.lastName) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.lastNameTextBox.setText(formData.lastName);
        }
        if (formData.street1) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.street1TextBox.setText(formData.street1);
        }
        if (formData.street2) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.street2TextBox.setText(formData.street2);
        }
        if (formData.zip) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.zipTextBox.setText(formData.zip);
        }
        if (formData.state) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.stateSelect.selectOptionSpan(formData.state, "@class='mat-option-text'");
        }
        if (formData.city) {
            await this.cityTextBox.setText(formData.city);
        }
        if (formData.primaryPhone) {
            await this.primaryPhoneTextBox.setText(formData.primaryPhone);
        }
        if (formData.phoneUse) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.phoneUseSelect.selectOptionSpan(formData.phoneUse);
        }
        if (formData.email) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.emailTextBox.setText(formData.email);
        }
        if (formData.effectiveDate) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.efectiveDateTextBox.setText(formData.effectiveDate);
        }
        if (formData.preferredLanguage) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.preferredLanguageSelect.selectOptionSpan(formData.preferredLanguage);
        }

        if (formData.payrollDeduction) {
            await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
            await this.payrollDeductionCheckBox.check();
        }
        await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);
        await this.priorityCodeTextBox.click();
        await this.emailTextBox.click();
    }


    async verifyDataInOwnerInformationForm(ownerInfoData: OwnerInfoData): Promise<void> {
        const formData = { ...getDefaultOwnerInfoData(), ...ownerInfoData };
        logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying owner information form with data: ' + JSON.stringify(formData));
        await this.page.waitForTimeout(timeouts.veryShort);
        await this.brandSelect.waitForVisible();
        const loadingCoverBarSection = new LoadingCoverBarSection(this.page);
        await loadingCoverBarSection.waitForLoadingBarToDisappear(timeouts.fourMinutes);

        if (formData.brand) {
            const brand = await this.brandSelect.getText();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual brand: [' + brand + '] vs expected: [' + formData.brand + ']');
            expect.soft(brand).toContain(formData.brand);
        }
        if (formData.marketSource) {
            const marketSource = await this.marketSourceTextBox.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual market source: [' + marketSource + '] vs expected: [' + formData.marketSource + ']');
            expect.soft(marketSource, `The Market Source Control has the value [${marketSource}] instead of [${formData.marketSource}]`).toContain(formData.marketSource);
        }
        if (formData.priorityCode) {
            const priorityCode = await this.priorityCodeTextBox.getText();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual priority code: [' + priorityCode + '] vs expected: [' + formData.priorityCode + ']');
            expect.soft(priorityCode, `The Priority Code Control has the value [${priorityCode}] instead of [${formData.priorityCode}]`).toContain(formData.priorityCode);
        }
        if (formData.firstName) {
            const firstName = await this.firstNameTextBox.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual first name: [' + firstName + '] vs expected: [' + formData.firstName + ']');
            expect.soft(firstName, `The First Name Control has the value [${firstName}] instead of [${formData.firstName}]`).toContain(formData.firstName);
        }
        if (formData.lastName) {
            const lastName = await this.lastNameTextBox.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual last name: [' + lastName + '] vs expected: [' + formData.lastName + ']');
            expect.soft(lastName, `The Last Name Control has the value [${lastName}] instead of [${formData.lastName}]`).toContain(formData.lastName);
        }
        if (formData.street1) {
            const street1 = await this.street1TextBox.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual street 1: [' + street1 + '] vs expected: [' + formData.street1 + ']');
            expect.soft(street1, `The Street 1 Control has the value [${street1}] instead of [${formData.street1}]`).toContain(formData.street1);
        }
        if (formData.street2) {
            const street2 = await this.street2TextBox.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual street 2: [' + street2 + '] vs expected: [' + formData.street2 + ']');
            expect.soft(street2, `The Street 2 Control has the value [${street2}] instead of [${formData.street2}]`).toContain(formData.street2);
        }
        if (formData.zip) {
            const zip = await this.zipTextBox.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual zip: [' + zip + '] vs expected: [' + formData.zip + ']');
            expect.soft(zip, `The Zip Control has the value [${zip}] instead of [${formData.zip}]`).toContain(formData.zip);
        }
        if (formData.state) {
            const state = await this.stateSelect.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual state: [' + state + '] vs expected: [' + formData.state + ']');
            expect.soft(state, `The State Control has the value [${state}] instead of [${formData.state}]`).toContain(formData.state);
        }
        if (formData.city) {
            const city = await this.cityTextBox.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual city: [' + city + '] vs expected: [' + formData.city + ']');
            expect.soft(city, `The City Control has the value [${city}] instead of [${formData.city}]`).toContain(formData.city);
        }
        if (formData.primaryPhone) {
            const primaryPhone = await this.primaryPhoneTextBox.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual primary phone: [' + primaryPhone + '] vs expected: [' + formData.primaryPhone + ']');
            expect.soft(primaryPhone, `The Primary Phone Control has the value [${primaryPhone}] instead of [${formData.primaryPhone}]`).toContain(formData.primaryPhone);
        }
        if (formData.phoneUse) {
            const phoneUse = await this.phoneUseSelect.getText();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual phone use: [' + phoneUse + '] vs expected: [' + formData.phoneUse + ']');
            expect.soft(phoneUse, `The Phone Use Control has the value [${phoneUse}] instead of [${formData.phoneUse}]`).toContain(formData.phoneUse);
        }
        if (formData.email) {
            const email = await this.emailTextBox.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual email: [' + email + '] vs expected: [' + formData.email + ']');
            expect.soft(email, `The Email Control has the value [${email}] instead of [${formData.email}]`).toContain(formData.email);
        }
        if (formData.effectiveDate) {
            const effectiveDate = await this.efectiveDateTextBox.getValue();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual effective date: [' + effectiveDate + '] vs expected: [' + formData.effectiveDate + ']');
            expect.soft(effectiveDate, `The Effective Date Control has the value [${effectiveDate}] instead of [${formData.effectiveDate}]`).toContain(formData.effectiveDate);
        }
        if (formData.preferredLanguage) {
            const preferredLanguage = await this.preferredLanguageSelect.getTextOptionSelected();
            logger.info('[SalesOwnerTabSection.verifyDataInOwnerInformationForm] Verifying actual preferred language: [' + preferredLanguage + '] vs expected: [' + formData.preferredLanguage + ']');
            expect.soft(preferredLanguage, `The Preferred Language Control has the value [${preferredLanguage}] instead of [${formData.preferredLanguage}]`).toContain(formData.preferredLanguage);
        }

    }
}

