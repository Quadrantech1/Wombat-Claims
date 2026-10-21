import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { TextBox } from '@controls/textbox';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';

export class AspcaFetchPreviousQuotePage extends BasePage {

    // Navigation
    openNavMenuButton = new Button(this.page, this.page.getByRole('button', { name: 'Open navigation menu' }));
    fetchPreviousQuoteLink = new Link(this.page, this.page.getByRole('link', { name: 'Fetch a Previous Quote' }));

    // Find My Quote form
    emailTextBox = new TextBox(this.page, this.page.getByTestId('find-my-quote-email'));
    zipCodeTextBox = new TextBox(this.page, this.page.getByTestId('find-my-quote-zipcode'));
    submitButton = new Button(this.page, this.page.getByTestId('find-my-quote-submit'));
    startNewQuoteButton = new Button(this.page, this.page.getByTestId('find-my-quote-start-new'));

    // Quote not found message
    quoteNotFoundLabel = new Label(this.page, this.page.getByText('Sorry, we could not find a'));

    // Retrieve quote modal
    retrieveQuoteButton = new Button(this.page, this.page.getByRole('button', { name: 'Yes, retrieve quote' }));
    closeModalButton = new Button(this.page, this.page.getByRole('button', { name: 'Close modal' }));
    backButton = new Button(this.page, this.page.getByRole('button', { name: 'Back' }));

    // Progress stepper (navigates back to pet info step)
    petInfoStepButton = new Button(this.page, this.page.getByTestId('step-0'));

    // Pet email input (visible after quote retrieval on step-one)
    petEmailTextBox = new TextBox(this.page, this.page.getByTestId('pet-email-input'));

    /**
     * Opens the navigation menu and clicks the "Fetch a Previous Quote" link.
     */
    async navigateToFetchPreviousQuote(): Promise<void> {
        logger.info('[AspcaFetchPreviousQuotePage.navigateToFetchPreviousQuote] - Opening nav menu and navigating to Fetch a Previous Quote');
        await this.openNavMenuButton.click();
        await this.fetchPreviousQuoteLink.click();
    }

    /**
     * Fills the Find My Quote form and submits it.
     * @param email - Email address to search for
     * @param zipCode - Zip code associated with the quote
     */
    async submitFindMyQuoteForm(email: string, zipCode: string): Promise<void> {
        logger.info(`[AspcaFetchPreviousQuotePage.submitFindMyQuoteForm] - Submitting form with email: ${email}`);
        await this.emailTextBox.setTextAndTab(email);
        await this.zipCodeTextBox.setText(zipCode);
        await this.submitButton.click();
    }

    /**
     * Waits for the retrieve quote modal and confirms retrieval.
     */
    async confirmRetrieveQuote(): Promise<void> {
        logger.info('[AspcaFetchPreviousQuotePage.confirmRetrieveQuote] - Confirming quote retrieval');
        await this.retrieveQuoteButton.waitForVisible(timeouts.short);
        await this.retrieveQuoteButton.click();
    }
}
