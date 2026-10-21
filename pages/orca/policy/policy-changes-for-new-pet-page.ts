import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';

export class PolicyChangesForNewPetPage extends BasePage {
    petNameTextBox = new TextBox(this.page, '#Pet_Pet_PetName');
    petDateOfBrithTextBox = new TextBox(this.page, '#Pet_Pet_Dob');
    petBrithMonthSelect = new Select(this.page, '.ui-datepicker-month');
    petBrithYearSelect = new Select(this.page, "//select[@class='ui-datepicker-year']");
    petBrithDate = new Button(this.page, "//a[normalize-space()='14']");
    genderOfthePet = new Select(this.page, '#gender-select');
    speciesOfThePet = new Select(this.page, '#species-select');
    breedOfThePet = new Select(this.page, '#breed-select');
    hereDitaryPlusCheckBox = new Checkbox(this.page, '#CoverageProducts_1__IsSelected');
    supportPlusCheckBox = new Checkbox(this.page, '#CoverageProducts_2__IsSelected');
    alternativePlusCheckBox = new Checkbox(this.page, '#CoverageProducts_3__IsSelected');
    examPlusCheckBox = new Checkbox(this.page, '#CoverageProducts_5__IsSelected');
    defenderPlusCheckBox = new Checkbox(this.page, '#CoverageProducts_6__IsSelected');
    defenderCheckBox = new Checkbox(this.page, '#CoverageProducts_7__IsSelected');
    returnPolicyButton = new Button(this.page, "//div[@id='quote-actions']//a[@class='btn btn-inverse'][normalize-space()='Return to Policy']");
    saveButtonButton = new Button(this.page, "//button[normalize-space()='Save']");
}
