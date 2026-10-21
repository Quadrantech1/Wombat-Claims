import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { TextBox } from '@controls/textbox';
import { MailosaurService } from '@services/mailosaur-service';
import { logger } from '@utils/logger-util';
import { BasePage } from '../base-page';
import { AlertSection } from '@pages/orca/common-section/alert-section';


export class PortalLoginPage extends BasePage {
    // TextBoxes
    emailTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Email' }));
    sendOneTimeCodeButton = new Button(this.page, this.page.getByRole('button', { name: 'Send One-Time Code' }));
    passcodeTextBox = new TextBox(this.page, this.page.getByRole('textbox', { name: 'Passcode' }));
    passcodeAfterFailedInputTextBox = new TextBox(this.page, this.page.locator('//input[@id="otp" and @data-gtm-form-interact-field-id="1"]'));
    verifyAndCompleteRegistrationButton = new Button(this.page, this.page.getByRole('button', { name: /Verify & (Complete Registration|Login)/ }).first());
    resendCodeButton = new Button(this.page, this.page.getByRole('button', { name: 'Resend Code' }));
    backToRegistrationButton = new Button(this.page, this.page.getByText('← Back to Registration').first());
    unableToVerifyCodeLabel = new Label(this.page, this.page.getByText('We were unable to verify your code'));
    codeCouldNotBeResentLabel = new Label(this.page, this.page.getByText('Could not resend code. Please'));
    verifyCodeFormatLabel = new Label(this.page, this.page.getByText('Please enter a valid 6-digit code'));

    // Labels
    createAccountLabel = new Label(this.page, "//h2[text()='Create Account']");

    // Buttons
    createAccountButton = new Button(this.page, this.page.getByRole('button', { name: 'Create Account' }));

    // alert
    alertSection = new AlertSection(this.page);

    /**
     * Log in using a one-time passcode sent to the provided email address.
     *
     * @param email - The email address that will receive the one-time passcode
     * @returns Promise<void> Resolves when the login-with-passcode flow completes
     */
    async loginWithPasscode(email: string, mailosaurService: MailosaurService): Promise<void> {
        await this.emailTextBox.setText(email);
        await this.sendOneTimeCodeButton.click();
        logger.info('[PortalLoginPage.loginWithPasscode] Waiting for passcode email...');
        const passcode = await mailosaurService.getVerificationCode(email, 'Your One-Time Passcode');
        await this.passcodeTextBox.setText(passcode);
        await this.verifyAndCompleteRegistrationButton.click();
        logger.info('[PortalLoginPage.loginWithPasscode] Login with passcode has been completed successfully');
    }
}
