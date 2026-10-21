import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { getDefaultPpuStepOneData, StepOneData } from '@data/quote/step-one-data';
import { StepOnePage } from '../quote/step-one-page';
import { RadioButton } from '@controls/radio-button';

export class PpuStepOnePage extends StepOnePage {
    getPricingButton = new Button(this.page, "#submit_quote");

    override catRadio = new RadioButton(this.page, this.page.getByText(/\b(Cat|Chat)\b/i));

    francaisLabel = this.page.getByText('Francais', { exact: false });
    englishLabel = this.page.getByText('English', { exact: false });

    petNameLabel = new Label(this.page, "//*[@id='petName']/../label");
    postalCodeLabel = new Label(this.page, "//*[@id='postalCode']/../../../label");
    petTypeLabel = new Label(this.page, "//*[contains(@id,'speciesId')]/../../..//legend");
    petGenderLabel = new Label(this.page, "//*[contains(@id,'btnRadioGender')]/../../..//legend");
    petBreedLabel = new Label(this.page, "//*[@id='breedId']/../../label");
    petAgeLabel = new Label(this.page, "//*[@id='age']/../label");
    emailAddressLabel = new Label(this.page, '//*[@id="email"]/../label');
    partnerCodeLabel = new Label(this.page, "//*[@id='partnerCode']/../../../label");

    /**
     * Gets PPU-specific default data
     */
    protected override getDefaultFormData(): StepOneData {
        return getDefaultPpuStepOneData();
    }

}