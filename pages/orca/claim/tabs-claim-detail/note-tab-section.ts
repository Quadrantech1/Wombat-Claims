import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class NoteTabSection extends BasePage {
    addNewNoteButton = new Button(this.page, '//div[@id="notes"]//a[@title="Add Note"]');
    customerContact = new Checkbox(this.page, '//div[@id="dialog-content"]//input[@id="contact_customer"]');
    notesArea = new TextBox(this.page, '//div[@id="dialog-content"]//textarea');
    saveNoteDialog = new Button(this.page, '//div[@id="dialog-content"]//button[@type="submit"]');

    /**
     * Verifies if specific notes text appears in the notes tab
     * @param notes - The notes text to search for
     * @returns Promise resolving to true if notes are found, false otherwise
     */
    async verifyNotesInNotesTab(notes: string): Promise<boolean> {
        logger.info(`[NoteTabSection.verifyNotesInNotesTab] - Verifying notes text: ${notes}`);
        const notesText = await new Label(this.page, `//div[@id="notes"]//blockquote//div[@class="row-fluid" and contains(text(),"${notes}")]`).getText();
        return notesText.includes(notes);
    }

    /**
     * Edits the most recently added note for the current user
     * @param message - The new message text to replace the existing note
     * @returns Promise resolving when the edit is complete
     * @throws If the edit button is not available or an action fails
     */
    async editNotesForNewlyAddedNote(message: string): Promise<void> {
        logger.info(`[NoteTabSection.editNotesForNewlyAddedNote] - Editing note with message: ${message}`);
        const userName = (await new Label(this.page, '//div[@id="notes"]//blockquote//div/strong').getText()).split('(')[0];
        const editButton = new Label(this.page, '//div[@id="notes"]//blockquote//div/strong/following-sibling::div/a[@title="Edit Note"]');
        logger.info(`[NoteTabSection.editNotesForNewlyAddedNote] - Edit button displayed for user: ${userName}`);
        await editButton.clickAndWait();
        await this.notesArea.clear();
        await this.notesArea.setText(message);
        await this.saveNoteDialog.clickAndWait();
    }

    /**
     * Gets the total count of notes on the claim details page
     * @returns Promise resolving to the number of notes found
     * @throws If locating the notes elements fails
     */
    async totalNotesOnClaimDetailsPage(): Promise<number> {
        logger.info(`[NoteTabSection.totalNotesOnClaimDetailsPage] - Getting total notes count`);
        const notes = await this.page.$$('//div[@id="notes"]//blockquote');
        return notes.length;
    }
}
