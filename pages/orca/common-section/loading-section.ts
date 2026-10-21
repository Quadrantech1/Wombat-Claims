import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';

export class LoadingSection extends BasePage {
    loadingSpinnerTableValueIcon = new Label(this.page, "//div[@class='ajax-load' and @id]");
    loadingSpinnerMakeChangesIcon = new Label(this.page, "//div[@id='dialog-content' and @class='ajax-load']");
    loadingSpinnerAddIncidentIcon = new Label(this.page, "(//div[@id='dialog-content']//div[@class='ajax-load'])[1]");
    loadingSpinnerHiddenImage = new Label(this.page, '//div[@class="progress-loader" and @hidden]');

}