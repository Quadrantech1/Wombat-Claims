import { Button } from '@controls/button';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class TopSalesSection extends BasePage {
    verificationButton = new TextBox(this.page, '#top-menu-Item-Verification');
    returnToQuoteButton = new Button(this.page, "#top-menu-Item-Return to Quote");
    startQuoteButton = new Button(this.page, "//button[contains(.,'Start Quote')]");
}

