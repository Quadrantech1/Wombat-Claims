import { Button } from '@controls/button';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { AlertSection } from './../common-section/alert-section';

/**
 * Page object for the Register Account page in ORCA
 */
export class RegisterPage extends BasePage {
    // TextBoxes
    emailTextBox = new TextBox(this.page, '//*[@id="Email" and not(@type="hidden")]');
    passwordTextBox = new TextBox(this.page, '//*[@id="Password" and not(@type="hidden")]');
    confirmPasswordTextBox = new TextBox(this.page, '#ConfirmPassword');

    // Button
    submitButton = new Button(this.page, "//button[text()='Submit']");

    alertSection = new AlertSection(this.page);

    /**
     * Registers a new account and waits for navigation
     * @param email - Email address for the new account
     * @param password - Password for the new account
     * @param confirmPassword - Password confirmation
     */
    async registerNewAccountAndWait(email: string, password: string, confirmPassword: string): Promise<void> {
        logger.info(`[RegisterPage.registerNewAccountAndWait] - Registering new account with email: ${email}`);

        await this.emailTextBox.setText(email);
        await this.passwordTextBox.setText(password);
        await this.confirmPasswordTextBox.setText(confirmPassword);
        await this.submitButton.clickAndWait();

        logger.info(`[RegisterPage.registerNewAccountAndWait] - Successfully submitted registration and waited for: ${email}`);
    }
}