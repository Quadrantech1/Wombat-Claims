import { BasePage } from '@pages/base-page';
import { Label } from '@controls/label';

// Felix Purchase Footer Page
export class PurchaseFooterPage extends BasePage {
    purchasePriceLabel = new Label(this.page, "//div[@class='purchase-wrapper']//p");
}