import { Button } from '@controls/button';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class LoginPage extends BasePage {
    userNameTextBox = new TextBox(this.page, '#username');
    passwordTextBox = new TextBox(this.page, '#password');
    loginButton = new Button(this.page, '//button[text()="Login"]');


    async login(user: string, password: string): Promise<void> {
        logger.info(`[LoginPage.login] - Logging in as user: ${user}`);
        await this.userNameTextBox.setText(user);
        await this.passwordTextBox.setText(password);
        await this.loginButton.click();
    }

}
