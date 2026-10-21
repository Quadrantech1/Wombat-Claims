import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class CFARegistrationModal extends BasePage {
    // Modal elements
    registrationNumberTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Registration Number*' }));
    zipCode30DayTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Enter zip code' }));
    lookUpCatButton = new Button(this.page, this.page.getByRole('button', { name: 'Look Up Cat' }));
    cancelButton = new Button(this.page, this.page.getByRole('button', { name: 'Cancel' }));
    tryAgainButton = new Button(this.page, this.page.getByRole('button', { name: 'Try Again' }));
    closeButton = new Button(this.page, this.page.getByText('Close', { exact: true }));

    // Labels/Messages
    unableToFind30DayLabel = new Label(this.page, this.page.getByText('We are unable to find a 30-'));
    lookupCFALabel = new Label(this.page, this.page.getByRole('heading', { name: 'Look up CFA   Registration' }));
    successLabel = new Label(this.page, this.page.getByRole('heading', { name: 'Success!' }));
    cfaRegistrationAddedLabel = new Label(this.page, this.page.getByText('Your cat\'s CFA registration'));

    /**
     * Fills out the CFA registration form and submits it
     * @param registrationNumber - The CFA registration number
     * @param zipCode - The zip code for the registration
     */
    async fillRegistrationForm(registrationNumber: string, zipCode: string): Promise<void> {
        logger.info(`[CFARegistrationModal.fillRegistrationForm] Started CFA registration form for registrationNumber: ${registrationNumber}, zipCode: ${zipCode}`);
        await this.registrationNumberTextBox.waitForVisible();
        await this.registrationNumberTextBox.setText(registrationNumber);
        await this.zipCode30DayTextBox.setText(zipCode);
        await this.lookUpCatButton.click();
        await this.lookUpCatButton.waitForDisappear();
        await this.closeButton.click();
        logger.info(`[CFARegistrationModal.fillRegistrationForm] Filled CFA registration form for registrationNumber: ${registrationNumber}, zipCode: ${zipCode}`);
    }
}
