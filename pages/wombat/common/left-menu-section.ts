import { Button } from '@controls/button';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';


export enum MenuOptions {
    Home = 'Home',
    Claims = 'Claims',
    Users = 'Users',
    CustomerService = 'Customer Service',
    Sales = 'Sales',
    Finance = 'Finance',
    Administration = 'Administration',
    Marketing = 'Marketing',
    Logout = 'Logout',
}

export enum MenuIconsOptions {
    Home = 'home',
    Claims = 'attach_money',
    Users = 'group',
    CustomerService = 'face',
    Sales = 'trending_up',
    Finance = 'payment',
    Administration = 'how_to_reg',
    Marketing = 'show_chart',
    Logout = 'cancel',
}
export class LeftMenuSection extends BasePage {

    arrowRight = new Button(this.page, "//i[text()='keyboard_arrow_right']");
    arrowLeft = new Button(this.page, "//i[text()='keyboard_arrow_left']");
    async selectOption(option: MenuOptions): Promise<void> {
        logger.info('[LeftMenuSite.selectOption] Selecting option: ' + option);

        if (await this.arrowRight.isDisplayed()) {
            await this.arrowRight.clickAndWait();
        }

        let locatorOption = `//span[text()='${option}']`;
        let optionButton = new Button(this.page, locatorOption);
        await optionButton.clickAndWait();
    }

    async selectIconOption(option: MenuIconsOptions): Promise<void> {
        if (await this.arrowLeft.isDisplayed()) {
            await this.arrowLeft.clickAndWait();
        }

        logger.info('[LeftMenuSite.selectIconOption] Selecting option: ' + option);
        let locatorOption = `//i[text()='${option}']`;
        let optionButton = new Button(this.page, locatorOption);
        await optionButton.waitForVisible();
        await optionButton.hoverAndWait();
        await optionButton.clickAndWait();
    }

}
