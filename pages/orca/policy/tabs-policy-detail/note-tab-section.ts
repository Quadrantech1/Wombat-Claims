import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';

export class PolicyNotesTabPanel extends BasePage {
    addNoteButton = new Button(this.page, "//button[contains(.,'Add Note')]");
    editPaymentButton = new Button(this.page, "//a[@id='btn-view-pmt-options']");

    /**
     * Verifies that a note with the specified text is present
     * @param note - The note text to search for
     */
    async confirmNotePresent(note: string): Promise<void> {
        logger.info(`[NoteTabSection.verifyNoteIsPresent] - Verifying note is present: ${note}`);
        const noteLabel = new Label(this.page, `//blockquote[contains(.,'${note}')]`);
        await expect(noteLabel.getLocator()).toBeVisible();
    }

    /**
     * Gets the text content of a note
     * @param note - The note text to search for
     * @returns The full text content of the note
     */
    async readNoteText(note: string): Promise<string> {
        logger.info(`[NoteTabSection.getNoteText] - Getting text for note: ${note}`);
        const noteDetail = new Label(this.page, `//blockquote[contains(.,'${note}')]`);
        return await noteDetail.getText();
    }

    async tallyNotesWithText(...texts: string[]): Promise<number> {
        const conditions = texts.map(t => `contains(.,'${t}')`).join(' and ');
        return await this.page.locator(`//div[@id='notes']//blockquote[${conditions}]`).count();
    }
}
