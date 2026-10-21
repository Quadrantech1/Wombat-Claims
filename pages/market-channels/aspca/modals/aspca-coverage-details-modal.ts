import { Button } from '@controls/button';
import { RadioButton } from '@controls/radio-button';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class AspcaCoverageDetailsModal extends BasePage {

    private dialog = this.page.getByRole('dialog');

    closeButton = new Button(this.page, this.dialog.getByRole('button', { name: 'Close' }));

    // Coverage category accordion — one open at a time
    accidentsButton = new Button(this.page, this.dialog.getByRole('button', { name: 'Accidents' }));
    illnessButton = new Button(this.page, this.dialog.getByRole('button', { name: 'Illness' }));
    hereditaryButton = new Button(this.page, this.dialog.getByRole('button', { name: 'Hereditary & Congenital Issues' }));
    behavioralButton = new Button(this.page, this.dialog.getByRole('button', { name: 'Behavioral Issues' }));
    endOfLifeButton = new Button(this.page, this.dialog.getByRole('button', { name: 'End of Life Expenses' }));
    microchipButton = new Button(this.page, this.dialog.getByRole('button', { name: 'Microchip Implantation' }));

    // Note: the button text uses a curly apostrophe (U+2019) — use regex to avoid character mismatch
    whatsCoveredTab = new RadioButton(this.page, this.dialog.getByRole('radio', { name: /what.s covered/i }));
    notCoveredTab = new RadioButton(this.page, this.dialog.getByRole('radio', { name: 'Not Covered' }));

    /**
     * Closes the Coverage details modal.
     */
    async close(): Promise<void> {
        logger.info('[AspcaCoverageDetailsModal.close] - Closing Coverage details modal');
        await this.closeButton.click();
    }
}
