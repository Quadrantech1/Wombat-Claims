import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

/**
 * Modal opened from the What's Covered page via the "View full list of exclusions" link (PBI 250107).
 */
export class AspcaExclusionsModal extends BasePage {

    private dialog = this.page.getByRole('dialog');

    modalHeading = new Label(this.page, this.dialog.getByRole('heading', { name: /exclusions/i }));
    closeButton = new Button(this.page, this.dialog.getByRole('button', { name: 'Close' }));

    /**
     * Closes the Exclusions modal.
     */
    async close(): Promise<void> {
        logger.info('[AspcaExclusionsModal.close] - Closing Exclusions modal');
        await this.closeButton.click();
    }
}
