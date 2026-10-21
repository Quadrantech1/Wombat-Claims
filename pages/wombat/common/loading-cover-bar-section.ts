import { timeouts } from './../../../utils/timeouts-util';

import { Button } from '@controls/button';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class LoadingCoverBarSection extends BasePage {

    // if this element is present, the loading bar was hidden
    loadingBarIndicator = new Button(this.page, "//div[@hidden and not(@id)]");

    async waitForLoadingBarToDisappear(timeout: number = timeouts.fourMinutes): Promise<void> {
        logger.info(`[LoadingCoverBarSection.waitForLoadingBarToDisappear] Waiting for loading bar to disappear with timeout: ${timeout}ms`);
        await this.loadingBarIndicator.waitForExistInDom(timeout);
        await this.page.waitForTimeout(timeouts.veryShort);
    }

}
