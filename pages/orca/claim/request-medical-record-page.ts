import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { MedicalRecordData, getDefaultMedicalRecord } from '@data/orca/medical-record-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class RequestMedicalRecordPage extends BasePage {

    requestTypeDropdown = new Select(this.page, '#request-type-id');
    petDropdown = new Select(this.page, '#pet-id');
    vetDropdown = new Select(this.page, '#vet-id');
    requestLink = new Link(this.page, '#requests-link');

    requestSearch = new TextBox(this.page, '//input[@placeholder="Search for Requests"]');

    allMrsButton = new Button(this.page, '//a[text()="All MRs"]');

    medicalRecordTable = new Table(this.page, '//*[@id="requests"]/div/table');
    resetButton = new Button(this.page, '//a[@title="Reset Claim Status To Requested Medical Records"]');
    petIsRequiredLabel = new Label(this.page, '//li[text()="Pet is required."]');
    petIsRequiredLabelGroup = new Label(this.page, '//li[text()="Group Pet is required."]');

    // Page buttons (no maps - access directly)
    medicalRecordButton = new Button(this.page, '//a[text()=" Request Medical Records"]');
    createNewButton = new Button(this.page, '//a[text()=" Create New"]');
    saveModalButton = new Button(this.page, 'div[class="modal-footer"] button[type="submit"]');
    sendButton = new Button(this.page, '//*[@id="form0"]/div//button[@type="submit"]');

    // Send Request Popup
    selDelMethod = new Select(this.page, '#delivery-method');
    txtDeliverTo = new TextBox(this.page, '#deliver-to');
    lblMRReqId = new Label(this.page, '//div[contains(text(),"Request Id")]/following-sibling::div[@class="controls"]');

    // Tabs / attachment labels (explicit properties)
    attachmentsLink = new Link(this.page, '//a[@id="attachments-link"]');
    reqDetailsAttachmentDocTypeLabel_RequestMedicalRecords = new Label(this.page, '//div[@class="span3 edit" and contains(text(),"Request Medical Records")]');
    reqDetailsAttachmentDocTypeLabel_RequestMedicalRecordsNotice = new Label(this.page, '//div[@class="span3 edit" and contains(text(),"Request Medical Records Notice")]');
    reqLink = new Link(this.page, '//a[contains(text(),"Requests -")]');

    /**
     * Gets the requested records textarea element based on a 1-based index.
     * @param index 1-based index (e.g., 1 for RequestedRecords[0], 2 for RequestedRecords[1])
     * @returns TextBox control for the requested records textarea
     */
    public getRequestedRecordsTextArea(index: number): TextBox {
        const zeroBasedIndex = index - 1;
        logger.info(`[RequestMedicalRecordPage.getRequestedRecordsTextArea] - Getting textarea for index ${index} (RequestedRecords[${zeroBasedIndex}])`);
        return new TextBox(this.page, `//textarea[@id='RequestedRecords[${zeroBasedIndex}]']`);
    }

    public async getLinkForReqDetailsPDF(nameDocument: string): Promise<string> {
        logger.info(`[RequestMedicalRecordPage.getLinkForReqDetailsPDF] - Getting href for document: ${nameDocument}`);
        const linkReqDetailsPDF = new Link(this.page, `(//div[normalize-space()='${nameDocument}']/..//a[contains(.,'.pdf')])`);
        // wait for it to be visible (15s)
        await linkReqDetailsPDF.waitForVisible(timeouts.veryShort);
        const href = await linkReqDetailsPDF.getAttribute('href');
        if (!href) throw new Error(`[RequestMedicalRecordPage.getLinkForReqDetailsPDF] - href not found for document: ${nameDocument}`);
        return href;
    }

    /**
     * Fill out the Request Medical Records form using provided data or defaults.
     * If pet or vet are undefined, the first available value will be selected.
     * @param data Partial data to override defaults
     */
    public async fillOutRequestMedicalRecordsForm(data?: Partial<MedicalRecordData>): Promise<void> {
        const formData: MedicalRecordData = { ...getDefaultMedicalRecord(), ...data };

        logger.info(`[RequestMedicalRecordPage.fillOutRequestMedicalRecordsForm] - Filling form with data: ${JSON.stringify(formData)}`);

        // Request Type - always set from defaults/overrides
        await this.requestTypeDropdown.waitForVisible(timeouts.short);
        await this.requestTypeDropdown.selectValue(formData.requestTypeDropdown);

        // Pet selection - if undefined select first value
        if (formData.pet) {
            await this.petDropdown.selectValue(formData.pet);
        } else {
            await this.petDropdown.firstValue();
        }

        if (formData.requestTypeDropdown !== 'Customer') {
            // Vet selection - if undefined select first value
            if (formData.vet) {
                await this.vetDropdown.selectValue(formData.vet);
            } else {
                await this.vetDropdown.firstValue();
            }
        }
        // Search text - always set from defaults/overrides
        await this.requestSearch.selectTextOption(formData.requestSearch, formData.requestSearch);
        logger.info('[RequestMedicalRecordPage.fillOutRequestMedicalRecordsForm] - Finished filling form');
    }

    async verifyReqLinkIsPresent(): Promise<void> {
        try {
            await this.reqLink.isDisplayed();
            logger.info('[RequestMedicalRecordPage.verifyReqLinkIsPresent] - Attachments are present and request link is visible');
        } catch (error) {
            logger.warn('[RequestMedicalRecordPage.verifyReqLinkIsPresent] - Request link not found, retrying after page reload');
            await this.page.waitForTimeout(timeouts.polling);
            await this.page.reload();
            await this.attachmentsLink.clickAndWait();
            await this.reqLink.isDisplayed();
            logger.info('[RequestMedicalRecordPage.verifyReqLinkIsPresent] - Attachments are present and request link is visible after retry');
        }
    }

}
