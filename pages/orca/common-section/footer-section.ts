import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { Page } from '@playwright/test';

export class FooterSection extends BasePage {

  logoutButton = new Button(this.page,"//a[text()='Log Out']");
  loggedInAsLabel = new Label(this.page,"//footer//div[contains(text(),'Logged in as')]");
  serverDataBaseAsLabel = new Label(this.page,"//footer//div[contains(text(),'Environment')]");
  signatureLabel = new Label(this.page,"//footer//div[contains(text(),'PetPartners, Inc.')]");

  constructor( page: Page) {
    super(page);
  }
  
  public async getUserLogged(): Promise<string> {
    let value = await this.loggedInAsLabel.getText();
    value = value.replace("Logged in as", "").replace(/ |:/g, "");
    return value;
  }
}