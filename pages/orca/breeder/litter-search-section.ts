import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class LitterSearchSection extends BasePage {
    // Text Inputs
    litterRegistrationNoTextBox = new TextBox(this.page, "//input[@id='LitterSearchCriteria_LitterRegNo']");

    // Buttons
    runSearchButton = new Button(this.page, "//button[@class='btn btn-success']");
    addLitterButton = new Button(this.page, "//a[@href='/Breeder/LitterDetail?litterId=0']");
    changeBreederButton = new Button(this.page, "//a[@class='ajax-get pull-right btn btn-primary']");
    runSearchDetailsButton = new Button(this.page, "//button[@class='btn btn-success pull-right']");

    // Labels/Tabs
    litterDetailsTab = new Label(this.page, "//a[@id='litter-search-link']");

    // Links
    litterRegNoLink = new Link(this.page, "a.selector");
}
