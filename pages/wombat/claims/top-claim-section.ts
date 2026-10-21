import { Button } from '@controls/button';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class TopClaimSection extends BasePage {
    searchButton = new TextBox(this.page, '#top-menu-Item-Search');
    preprocessingButton = new Button(this.page, "#top-menu-Item-Preprocessing");
    recordsRequestingButton = new Button(this.page, "//span[text()='Records Requesting']");
    processingButton = new Button(this.page, "#top-menu-Item-Processing");
    estimateButton = new Button(this.page, "#top-menu-Item-Estimate");
    appealsButton = new Button(this.page, "#top-menu-Item-Appeals");
    verificationButton = new Button(this.page, "#top-menu-Item-Verification");
}

