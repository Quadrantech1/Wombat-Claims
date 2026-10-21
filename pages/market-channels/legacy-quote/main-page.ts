import { BasePage } from '@pages/base-page';
import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';

export class MainPage extends BasePage {
    // TextBoxes
    petNameTextBox = new TextBox(this.page, "#pet-name");
    zipCodeTextBox = new TextBox(this.page, "#zipcode");

    // Buttons
    getQuoteButton = new Button(this.page, "//header//div/a[text()='Get Quote' or text()='GET A QUOTE']");
    getQuoteFooterButton = new Button(this.page, "//button[text()='Get Quote']");
    activateCoverageButton = new Button(this.page, '//a[@class="button activate__certificate"]');
    activateCoverageCertificateButton = new Button(this.page, "//header[contains(@class,'blue-header')]//a[@title='Activate Coverage']");

    // Links
    loginLink = new Link(this.page, "//a[text()='Login']");
    activateCertificateLink = new Link(this.page, "//a[text()='ACTIVATE COVERAGE']");

    // Selects
    signUpPopUpClose = new Select(this.page, "//div[@title ='Close']");
}
