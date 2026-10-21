import { Button } from '@controls/button';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { getDefaultPetInfoData, PetInfoData } from '@data/wombat/pet-info-data';
import { BasePage } from '@pages/base-page';
import { timeouts } from '@utils/timeouts-util';
import { LoadingCoverBarSection } from '../common/loading-cover-bar-section';
import { VetSearchDialog } from './vet-search-dialog';

export class PetInfoSection extends BasePage {
    // pet info
    petNameTextBox = new TextBox(this.page, "#txtpetName");
    speciesSelect = new Select(this.page, "#speciesId");
    breedSelect = new Select(this.page, "#txtbreedId");
    ageSelect = new Select(this.page, "#selectage");
    maleGenderRadioButton = new Button(this.page, "//mat-radio-button[@value='M']");
    femaleGenderRadioButton = new Button(this.page, "//mat-radio-button[@value='F']");

    // medical info
    yesSpayedNeuteredRadioButton = new Button(this.page, "//div[text()='Spayed/Neutered?']/..//span[text()='Yes']/..//input");
    noSpayedNeuteredRadioButton = new Button(this.page, "//div[text()='Spayed/Neutered?']/..//span[text()='No']");

    yesVetTrialCodeRadioButton = new Button(this.page, "//div[text()='Vet Trial Code']/..//span[text()='Yes']");
    noVetTrialCodeRadioButton = new Button(this.page, "//div[text()='Vet Trial Code']/..//span[text()='No']");
    noTrialVetTrialCodeRadioButton = new Button(this.page, "//div[text()='Vet Trial Code']/..//span[text()='No Trial']");

    addMorePetsButton = new Button(this.page, "//button[contains(.,'Add More Pets')]");
    selectPlanButton = new Button(this.page, "//button[contains(.,'Select Plan')]");
    // vet detail
    addVetButton = new Button(this.page, "#add-pet-vet");
    summaryButton = new Button(this.page, "//button[contains(.,'Summary')]");
    saveQuoteButton = new Button(this.page, "//button[contains(.,'Save Quote')]");
    // sections
    vetSearchDialog = new VetSearchDialog(this.page);
    loadingCoverBarSection = new LoadingCoverBarSection(this.page);

    async fillNewPet(addPetData?: Partial<PetInfoData>): Promise<void> {
        const formData = { ...getDefaultPetInfoData(), ...addPetData };
        await this.page.waitForTimeout(timeouts.veryShort);
        await this.petNameTextBox.waitForVisible();
        await this.petNameTextBox.setText(formData.petName);
        await this.speciesSelect.selectOptionSpan(formData.petType);
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear();
        await this.page.waitForLoadState('networkidle')
        await this.selectPetBreedValue(formData.petBreed);
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear();
        await this.ageSelect.selectEqualOptionSpan(formData.petAge);
        await this.loadingCoverBarSection.waitForLoadingBarToDisappear();
        if (formData.gender === 'Male') {
            await this.maleGenderRadioButton.clickAndWait();
        } else {
            await this.femaleGenderRadioButton.clickAndWait();
        }

        if (formData.spayedNeutered === 'Yes') {
            await this.yesSpayedNeuteredRadioButton.clickAndWait();
        } else {
            await this.noSpayedNeuteredRadioButton.clickAndWait();
        }

        if (formData.vetTrialCode === 'Yes') {
            await this.yesVetTrialCodeRadioButton.clickAndWait();
        } else if (formData.vetTrialCode === 'No') {
            await this.noVetTrialCodeRadioButton.clickAndWait();
        } else {
            await this.noTrialVetTrialCodeRadioButton.clickAndWait();
        }

        await this.addVetButton.clickAndWait();
        if (formData.vetName === 'Has No Vet') {
            await this.vetSearchDialog.hasNoVetButton.waitForVisible();
            await this.vetSearchDialog.hasNoVetButton.clickAndWait();
        } else {
            // pending to add this logic  
        }

    }


    async selectPetBreedValue(breed: string): Promise<void> {
        await this.breedSelect.click();
        await this.breedSelect.typeText(breed);
        const breedOption = this.page.getByText(breed, { exact: true });
        await breedOption.click();
    }


}


