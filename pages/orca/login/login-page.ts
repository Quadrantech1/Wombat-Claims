import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { Role, getCredentialsForRole } from '@utils/user-credentials-util';

export class LoginPage extends BasePage {
  emailTextBox = new TextBox(this.page, '#Email');
  passwordTextBox = new TextBox(this.page, '#Password');
  loginButton = new Button(this.page, '//button[text()="Login"]');
  forgotPasswordLink = new Link(this.page, '//a[text()="Forgot Password?"]');
  registerAccountLink = new Link(this.page, '//a[text()="Register Account"]');
  messageLabel = new Label(this.page, '//div[@class="alert alert-success"]');
  messageErrorLabel = new Label(this.page, '//div[@class="alert alert-error"]');

  async loginTask(user: string, password: string): Promise<void> {
    logger.info('[LoginPage.loginTask] Login using user: ' + user + ' and password: ' + password);
    await this.emailTextBox.setText(user);
    await this.passwordTextBox.setText(password);
    await this.loginButton.click();
  }


  /**
   * Logs in the user with the specified role.
   * @param role - The role of the user to log in as. Default is 'admin'.
   * @returns {Promise<void>} - A promise that resolves when the login is complete.
   */
  async iAmLoggedUsingRole(role: Role = Role.Admin): Promise<void> {
    logger.info('[LoginPage.iAmLoggedUsingRole] Login using role: ' + role);
    const { user, password } = getCredentialsForRole(role);
    await this.emailTextBox.setText(user);
    await this.passwordTextBox.setText(password);
    await this.loginButton.clickAndWait();
  }
}
