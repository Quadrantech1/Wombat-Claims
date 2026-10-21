import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { TextBox } from '@controls/textbox';
import { PetDetailPage } from '@pages/orca/pet/pet-detail-page';

export class GroupPetDetailPage extends PetDetailPage {
    mergePetsLink = new Link(this.page, '//a[contains(.,"Merge Pets")]');
    mergePetsModal = new Label(this.page, '//div[@id="dialog" and contains(@class,"modal") and (contains(@class,"in") or contains(@class,"show"))]');
    mergePetsModalLoader = new Label(this.page, '//div[@id="dialog"]//div[@id="dialog-content" and contains(@class,"ajax-load")]');
    mergeTargetPetIdTextBox = new TextBox(this.page, '//div[@id="dialog"]//*[@id="PetIdToMerge"]');
    mergeConfirmButton = new Button(this.page, '//button[contains(@class,"btn-success") and contains(.,"Merge")]');
    mergeResultLabel = this.alertSection.successfullyAlertLabel;

    async mergeWithPetId(petId: string): Promise<void> {
        await this.page.waitForLoadState('load');
        await this.mergePetsLink.waitForVisible();
        await this.mergePetsLink.hover();
        await this.mergePetsLink.click();
        await this.mergePetsModal.waitForVisible();
        await this.mergePetsModalLoader.waitForDisappear();
        await this.mergeTargetPetIdTextBox.setText(petId);
        await this.mergeConfirmButton.clickAndWait('load');
    }
}