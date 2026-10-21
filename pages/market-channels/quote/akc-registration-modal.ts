import { BasePage } from '@pages/base-page';
import { Button } from '@controls/button';
import { TextBox } from '@controls/textbox';
import { Label } from '@controls/label';
import { logger } from '@utils/logger-util';

export class AKCRegistrationModal extends BasePage {
    // Modal elements
    registrationNumberTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Registration Number*' }));
    zipCodeTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Enter Zip Code' }));
    lookUpPetButton = new Button(this.page, this.page.getByRole('button', { name: 'Look Up Pet' }));
    continueToQuoteButton = new Button(this.page, this.page.getByRole('button', { name: 'Continue to Quote' }));
    goBackButton = new Button(this.page, this.page.getByRole('button', { name: 'Go Back' }));
    closeButton = new Button(this.page, this.page.getByLabel('Close'));

    // Labels/Messages
    lookupAKCLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Look up AKC Registration' }));
    modalDescriptionLabel = new Label(this.page, this.page.locator('p.modal_text_description'));

    /**
     * Fills out the AKC registration form and looks up pet
     * @param registrationNumber - The AKC registration number
     * @param zipCode - The zip code for the registration
     */
    async fillRegistrationForm(registrationNumber: string, zipCode: string): Promise<void> {
        logger.info(`[AKCRegistrationModal.fillRegistrationForm] Started AKC registration form for registrationNumber: ${registrationNumber}, zipCode: ${zipCode}`);
        await this.registrationNumberTextBox.waitForVisible();
        await this.registrationNumberTextBox.setText(registrationNumber);
        await this.zipCodeTextBox.setText(zipCode);
        await this.lookUpPetButton.click();
        await this.continueToQuoteButton.clickAndWait('load');
        logger.info(`[AKCRegistrationModal.fillRegistrationForm] Looked up pet with registrationNumber: ${registrationNumber}, zipCode: ${zipCode}`);
    }
}
