import { Button } from '@controls/button';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { AddRemovePetData, getDefaultAddRemovePetData } from '@data/wombat/add-remove-pet-data';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { LoadingCoverBarSection } from '../common/loading-cover-bar-section';

export class SalesAddRemovePetTabSection extends BasePage {

    /********************* * Add Remove Pet Tab ************************/

    nameTextBox = new TextBox(this.page, '#txtpetName');
    speciesSelect = new Select(this.page, "//div[contains(text(),'Species')]/..//mat-select");
    breedSelect = new Select(this.page, '#txtbreedId');
    ageSelect = new Select(this.page, "//div[contains(text(),'Age')]/..//mat-select");
    maleGenderRadioButton = new RadioButton(this.page, '//span[contains(text(),"Male")]/..');
    femaleGenderRadioButton = new RadioButton(this.page, '//span[contains(text(),"Female")]/..');

    yesSpayedNeuteredRadioButton = new RadioButton(this.page, '//span[contains(text(),"Yes")]/..');
    noSpayedNeuteredRadioButton = new RadioButton(this.page, '//span[contains(text(),"No")]/..');

    addPetSubmitButton = new Button(this.page, '//button[contains(.,"Add Pet")]');
    selectPlanButton = new Button(this.page, '//button[contains(.,"Select Plan")]');

    // accident only coverage
    accidentOnlyCoverageCheckBox = new Button(this.page, "//span[contains(text(),'Accident Only Coverage')]");
    annualLimitAccidentOnlySelect = new Select(this.page, "//span[contains(text(),'Accident Only Coverage')]/../../../..//div[contains(text(),'Annual Limit')]/..//mat-select");
    reimbursmentAccidentOnlySelect = new Select(this.page, "//span[contains(text(),'Accident Only Coverage')]/../../../..//div[contains(text(),'Reimbursment')]/..//mat-select");
    deductibleAccidentOnlySelect = new Select(this.page, "//span[contains(text(),'Accident Only Coverage')]/../../../..//div[contains(text(),'Deductible')]/..//mat-select");
    wellnessAccidentOnlySelect = new Select(this.page, "//span[contains(text(),'Accident Only Coverage')]/../../../..//div[contains(text(),'Wellness')]/..//mat-select");

    // complete coverage
    completeCoverageCheckBox = new Button(this.page, "//span[contains(text(),'Complete Coverage')]");
    annualLimitCompleteCoverageSelect = new Select(this.page, "//span[contains(text(),'Complete Coverage')]/../../../..//div[contains(text(),'Annual Limit')]/..//mat-select");
    reimbursmentCompleteCoverageSelect = new Select(this.page, "//span[contains(text(),'Complete Coverage')]/../../../..//div[contains(text(),'Reimbursment')]/..//mat-select");
    deductibleCompleteCoverageSelect = new Select(this.page, "//span[contains(text(),'Complete Coverage')]/../../../..//div[contains(text(),'Deductible')]/..//mat-select");
    wellnessCompleteCoverageSelect = new Select(this.page, "//span[contains(text(),'Complete Coverage')]/../../../..//div[contains(text(),'Wellness')]/..//mat-select");

    addToQuoteButton = new Button(this.page, "//button[contains(.,'Add To Quote')]");
    loadingCoverBarSection = new LoadingCoverBarSection(this.page);

    async fillAddRemovePetTabSection(addRemovePetData: AddRemovePetData): Promise<void> {
        const formData = { ...getDefaultAddRemovePetData(), ...addRemovePetData };
        logger.info('[SalesAddRemovePetTabSection.fillAddRemovePetTabSection] Filling add/remove pet tab section with data: ' + JSON.stringify(formData));
        const { petName, petSpecies, petBreed, petAge, gender, spayedNeutered, planType } = formData;
        await this.nameTextBox.setText(petName);
        await this.speciesSelect.selectOptionSpan(petSpecies);
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear();
        await this.breedSelect.selectOptionSpan(petBreed);
        await this.ageSelect.selectEqualOptionSpan(petAge);
        if (gender === 'Male') {
            await this.maleGenderRadioButton.clickAndWait();
        } else if (gender === 'Female') {
            await this.femaleGenderRadioButton.clickAndWait();
        }

        if (spayedNeutered === 'Yes') {
            await this.yesSpayedNeuteredRadioButton.clickAndWait();
        } else if (spayedNeutered === 'No') {
            await this.noSpayedNeuteredRadioButton.clickAndWait();
        }

        await this.selectPlanButton.clickAndWait();

        if (planType === 'Accident Only Coverage') {
            await this.accidentOnlyCoverageCheckBox.check();
        } else if (planType === 'Complete Coverage') {
            await this.completeCoverageCheckBox.check();
        }

        // add/remove pet second tab section
        // pending selecting plan details, assuming default selections for now

   
    }

}

