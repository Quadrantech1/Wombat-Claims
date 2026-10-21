import { Button } from '@controls/button';
import { BasePage } from '@pages/base-page';
import { AddPetDialog } from './add-pet-quote-dialog';
import { PetInfoCancelPetSection } from './pet-info-cancel-pet-section';
import { PetInfoPolicyActionSection } from './pet-info-policy-action-section';
import { PetInfoSection } from './pet-info-section';
export class CustomerPetInformationSection extends BasePage {
    addAPetButton = new Button(this.page, "#addpet");
    cancelPetButton = new Button(this.page, "#cancelpets");
    planChangeButton = new Button(this.page, "#policyinfo");
    dataChangeRequestButton = new Button(this.page, "#changeRequest");




    // sections  dialogs

    addPetDialog = new AddPetDialog(this.page);
    petInfoPolicyActionSection = new PetInfoPolicyActionSection(this.page);
    petInfoSection = new PetInfoSection(this.page);
    petInfoCancelPetSection = new PetInfoCancelPetSection(this.page);
}
