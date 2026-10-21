import { Button } from '@controls/button';
import { Iframe } from '@controls/iframe';
import { Label } from '@controls/label';
import { CompleteEnrollmentData, getDefaultCompleteEnrollmentData } from '@data/portal/complete-enrollment-data';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import { BasePage } from '../../base-page';

export class PortalCompleteEnrollmentPage extends BasePage {
    // iFrame
    stripeIframe = new Iframe(this.page, '#payment-element iframe >> nth=0');

    // TextBoxes inside Stripe iframe
    cardNumberTextBox = this.stripeIframe.textBox("#payment-numberInput");
    expiryTextBox = this.stripeIframe.textBox("#payment-expiryInput");
    cvcTextBox = this.stripeIframe.textBox("#payment-cvcInput");
    zipCodeTextBox = this.stripeIframe.textBox("#payment-postalCodeInput");
    countrySelect = this.stripeIframe.select("#payment-countryInput");

    // Buttons
    enrollNowButton = new Button(this.page, this.page.getByRole('button', { name: 'Enroll now' }));
    cardButton = this.stripeIframe.button("#card-tab");

    // Labels
    priceMonthLabel = new Label(this.page, "//div[@class='pet-overview__premium-price c--secondary']/strong");
    todaysTotal = new Label(this.page, "div.your-info-total-container .your-info-total strong");
    dateOfCharge = new Label(this.page, "//div[contains(@class, \"your-info-calendar-container\")]//span");

    portalLoadingSpinner = new Label(this.page, ".la-ball-spin");

    /**
     * Fill the complete enrollment form with payment information
     * @param enrollmentData - Partial data containing only the fields to update
     * @returns Promise that resolves when the form is filled
     */
    async fillCompleteEnrollment(enrollmentData?: Partial<CompleteEnrollmentData>): Promise<void> {
        logger.info('[PortalCompleteEnrollmentPage.fillCompleteEnrollment] Filling complete enrollment form');
        const formData = { ...getDefaultCompleteEnrollmentData(), ...enrollmentData };

        // todo: Add logging
        await this.cardButton.waitForVisible();
        await this.cardNumberTextBox.setText(formData.cardNumber!);
        await this.expiryTextBox.setText(formData.expiryDate!);
        await this.cvcTextBox.setText(formData.cvc!);

        if (formData.zipCode) {
            await this.zipCodeTextBox.setText(formData.zipCode);
        }
        logger.info('[PortalCompleteEnrollmentPage.fillCompleteEnrollment] Completed enrollment form filled successfully');
    }

    /**
     * Click the Enroll Now button with retry logic
     * @returns Promise that resolves when the button is clicked
     */
    async clickEnrollNowButton(timeout = timeouts.polling): Promise<void> {
        logger.info('[PortalCompleteEnrollmentPage.clickEnrollNowButton] Clicking Enroll Now button');
        try {
            await this.enrollNowButton.click();
            await this.page.waitForEvent('load', { timeout });
        } catch {
            logger.warning('[PortalCompleteEnrollmentPage.clickEnrollNowButton] First click failed, trying second click...');
            await this.enrollNowButton.click();
        }
    }
}
