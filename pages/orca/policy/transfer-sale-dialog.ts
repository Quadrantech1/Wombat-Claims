import { Button } from '@controls/button';
import { Select } from '@controls/select';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class TransferSaleDialog extends BasePage {
    transferSaleButton = new Button(this.page, "//div[@class='btn-block']/button[contains(text(),'Transfer Sale')]");
    userDropDown = new Select(this.page, "//select[@id='targetSysUserSoldById']");

    async transferSale(user: string): Promise<void> {
        logger.info('[TransferSaleDialog.transferSale] - Transferring sale to user: ' + user);
        await this.userDropDown.selectOption(user);
        await this.transferSaleButton.click();
    }
}
