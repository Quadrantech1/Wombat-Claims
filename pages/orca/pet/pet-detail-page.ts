import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { AlertSection } from '../common-section/alert-section';
import { TabsPetDetailSection } from './tabs-pet-detail-section';

export class PetDetailPage extends BasePage {

  petDetailLabel = new Label(this.page, "//h2[text()='Pet Detail']");

  // TextBox controls
  petNameTextBox = new TextBox(this.page, "//input[@id='Pet_PetName']");
  callNameTextBox = new TextBox(this.page, "#Pet_CallName");
  dobTextBox = new TextBox(this.page, "#Pet_Dob");
  registrationNoTextBox = new TextBox(this.page, "#Pet_RegistrationNumber");

  // Select controls
  genderSelect = new Select(this.page, "#Pet_GenderId");
  speciesSelect = new Select(this.page, "#Pet_SpeciesId");
  breedSelect = new Select(this.page, "#breed-select");
  waitingPeriodWaiverSelect = new Select(this.page, "//select[@id='waiting-period-waiver-select']");

  // Buttons
  saveButton = new Button(this.page, "//button[contains(.,'Save')]");

  // Links - from Java
  viewMcLeadDetailButton = new Link(this.page, "//a[contains(.,'View McLead Detail')]");

  // Alert
  alertSection = new AlertSection(this.page);

  // Tab section
  tabsPetDetailSection = new TabsPetDetailSection(this.page);
}