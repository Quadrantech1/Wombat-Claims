import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class QuoteApiPage extends BasePage {
    zipCodeTextBox = new TextBox(this.page, "//input[@formcontrolname='zipCode']");
    marketChannelSelect = new Select(this.page, "//select[@formcontrolname='marketChannelId']");
    emailTextBox = new TextBox(this.page, "//input[@formcontrolname='email']");
    setZipCodeButton = new Button(this.page, "//button[text()='Set Zip Code']");
    addNewpetButton = new Button(this.page, "//button[text()='Add New Pet']");
    editZipCodeButton = new Button(this.page, "//button[text()='Edit']");
    nextButton = new Button(this.page, "//button[text()='Next']");
    petInfoTable = new Table(this.page, "//table[contains(@class,'table table-striped mt-2')]");
    finishButton = new Button(this.page, "//button[text()='Finish']");
    policyIdLabel = new Label(this.page, "//span[contains(text(),'New policy was created')]/following-sibling::h3/b");
    gotoPolicyButton = new Button(this.page, "//button[normalize-space()='Go To Policy']");
    orcaIconLabel = new Label(this.page, "//span[@id='top-nav-orca-span']");

    /**
     * Fills out main information for quote API
     */
    async filloutMainInformation(quoteAPIMainInformation: { zipCode: string; marketChannel: string; email: string }): Promise<void> {
        logger.info(`[QuoteApiPage.filloutMainInformation] - Filling main information`);
        await this.zipCodeTextBox.setText(quoteAPIMainInformation.zipCode);
        await this.setZipCodeButton.click();
        await this.editZipCodeButton.click();
        await this.marketChannelSelect.selectOption(quoteAPIMainInformation.marketChannel);
        await this.emailTextBox.setText(quoteAPIMainInformation.email.toLowerCase());
    }
}
