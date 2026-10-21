import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';

// Persistent "Purchase actions bar" — rendered across Coverage and Checkout steps
export class AspcaTotalBar extends BasePage {
    private region = this.page.getByRole('region', { name: 'Purchase actions bar' });
    petCountLabel = new Label(this.page, this.region.locator('span[aria-live="polite"] > span:not(.font-bold)'));
    monthlyAmountLabel = new Label(this.page, this.region.locator('.tabular-nums'));
}
