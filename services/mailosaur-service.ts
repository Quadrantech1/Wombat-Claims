import { config } from '@config/env-config';
import { logger } from '@utils/logger-util';
import { timeouts } from '@utils/timeouts-util';
import fs from 'fs';
import Mailosaur from 'mailosaur';
import type { Message, MessageSummary } from 'mailosaur/lib/models';
import pdfParse from 'pdf-parse';

export class MailosaurService {
    private mailosaur: Mailosaur;
    private serverId: string;

    constructor() {
        const apiKey = config.EMAIL_APIKEY;
        const serverId = config.EMAIL_SERVER_ID;
        if (!apiKey || !serverId) {
            throw new Error('[MailosaurService.constructor] - Missing Mailosaur API key or server ID in config.');
        }
        this.mailosaur = new Mailosaur(apiKey);
        this.serverId = serverId;
        logger.info('[MailosaurService.constructor] - Mailosaur client initialized from config.');
    }

    /**
     * Retrieves a specific email message by its subject and recipient.
     * @param email - The email address to search for.
     * @param subject - The subject of the email to retrieve.
     * @param timeoutMs - The maximum time to wait for the email (in milliseconds).
     * @returns The retrieved email message.
     */
    private async getMessageBySubject(email: string, subject: string, timeoutMs: number = timeouts.long): Promise<Message> {
        logger.info(`[MailosaurService.getMessageBySubject] - Retrieving email with subject: ${subject} for email: ${email}`);
        const message = await this.mailosaur.messages.get(this.serverId, { sentTo: email, subject }, { timeout: timeoutMs });
        return message ?? null;
    }

    /**
     * Checks if there is at least one email with the specified subject for the given email address.
     * @param email - The email address to search for.
     * @param subject - The subject to look for.
     * @param timeoutMs - The maximum time to wait for the email (in milliseconds).
     * @returns Promise<boolean> - True if at least one email is found, false otherwise.
     */
    async hasEmailWithSubject(email: string, subject: string, timeoutMs: number = timeouts.default): Promise<boolean> {
        logger.info(`[MailosaurService.hasEmailWithSubject] - Checking for email with subject: ${subject} for email: ${email}`);
        const message = await this.getMessageBySubject(email, subject, timeoutMs);
        const found = !!message;
        logger.info(`[MailosaurService.hasEmailWithSubject] - Found: ${found} for subject: ${subject} and email: ${email}`);
        return found;
    }

    /**
     * Returns all subjects for a given email address.
     * @param email - The email address to search for.
     * @param timeoutMs - The maximum time to wait for the email (in milliseconds).
     * @returns Array of subjects (strings).
     */
    async getSubjects(email: string, timeoutMs: number = timeouts.long): Promise<string[]> {
        logger.info(`[MailosaurService.getSubjects] - Fetching subjects for email: ${email}`);
        const messages = await this.mailosaur.messages.search(this.serverId, { sentTo: email }, { timeout: timeoutMs });
        if (!messages || !messages.items) {
            throw new Error(`[MailosaurService.getSubjects] - No messages found for email: ${email}`);
        }
        return messages.items
            .map((msg: MessageSummary) => msg.subject)
            .filter((subject): subject is string => typeof subject === 'string');
    }

    /**
     * Downloads an attachment from an email message and saves it to disk.
     * @param email - The recipient email address to search for.
     * @param subject - The subject of the email containing the attachment.
     * @param fileName - The name of the attachment file to download.
     * @param folderName - The folder name to save the attachment (e.g., policyId, claimId).
     * @param timeoutMs - The maximum time to wait for the email (in milliseconds).
     * @returns Promise<void>
     */
    async downloadAttachment(email: string, subject: string, fileName: string, folderName: string, timeoutMs: number = timeouts.long): Promise<void> {
        const message = await this.getMessageBySubject(email, subject, timeoutMs);
        if (!message) {
            throw new Error(`[MailosaurService.downloadAttachment] - Email message not found for subject: ${subject} and email: ${email}`);
        }
        const attachment = message.attachments?.find(att => att.fileName === fileName);
        if (!attachment) {
            throw new Error(`[MailosaurService.downloadAttachment] - Attachment not found: ${fileName} in email: ${email}`);
        }
        logger.info(`[MailosaurService.downloadAttachment] - Downloading attachment ${attachment.id}, file name: ${fileName} for email: ${email}`);
        const result = await this.mailosaur.files.getAttachment(attachment.id);
        if (!Buffer.isBuffer(result)) {
            throw new Error(`[MailosaurService.downloadAttachment] - Attachment is not a Buffer: ${attachment.id}`);
        }
        const downloadDir = `download/${folderName}`;
        const filePath = `${downloadDir}/${fileName}`;
        fs.mkdirSync(downloadDir, { recursive: true });
        fs.writeFileSync(filePath, result);
        logger.info(`[MailosaurService.downloadAttachment] - Attachment saved successfully. Path: ${filePath}`);
    }

    /**
     * Gets the subject of the last email received by the specified email address.
     * @param email - The email address to search for.
     * @param timeoutMs - The maximum time to wait for the email (in milliseconds).
     * @returns The subject of the last email received, or null if not found.
     */
    async getLastSubject(email: string, timeoutMs: number = timeouts.long): Promise<string | null> {
        logger.info(`[MailosaurService.getLastSubject] - Fetching last email subject for: ${email}`);
        const messages = await this.mailosaur.messages.search(this.serverId, { sentTo: email }, { timeout: timeoutMs });
        if (!messages || !messages.items || messages.items.length === 0) return null;
        const lastSubject = messages.items[0].subject;
        logger.info(`[MailosaurService.getLastSubject] - Got subject: ${lastSubject} for email: ${email}`);
        return lastSubject ?? null;
    }

    /**
     * Checks if all provided strings are present in the PDF attachment (in memory, no disk writes).
     * @param email - The recipient email address to search for.
     * @param subject - The expected subject of the email.
     * @param fileName - The name of the attachment file to check.
     * @param searchStrings - Array of strings or String to search for in the PDF content.
     * @param timeoutMs - The maximum time to wait for the email (in milliseconds).
     * @returns Promise<boolean> - Returns true if all strings are found in the PDF, false otherwise.
     */
    async isAttachmentPdfContainsText(email: string, subject: string, fileName: string, searchStrings: string[] | string, timeoutMs: number = timeouts.long): Promise<boolean> {
        const message = await this.getMessageBySubject(email, subject, timeoutMs);
        if (typeof searchStrings === 'string') {
            searchStrings = [searchStrings];
        }
        if (!message) {
            throw new Error(`[MailosaurService.attachmentPdfContainsText] - Email message not found for subject: ${subject} and email: ${email}`);
        }
        const attachment = message.attachments?.find(att => att.fileName === fileName);
        if (!attachment) {
            throw new Error(`[MailosaurService.attachmentPdfContainsText] - Attachment not found: ${fileName} in email: ${email}`);
        }
        logger.info(`[MailosaurService.attachmentPdfContainsText] - Checking PDF attachment ${fileName}, id ${attachment.id} for strings: ${searchStrings.join(', ')}`);
        const result = await this.mailosaur.files.getAttachment(attachment.id);
        if (!Buffer.isBuffer(result)) {
            throw new Error(`[MailosaurService.attachmentPdfContainsText] - Attachment is not a Buffer: ${attachment.id}`);
        }
        const data = await pdfParse(result);
        const text = data.text;
        return searchStrings.every(str => text.includes(str));
    }

    /**
     * Counts the number of emails with a specific subject for a given email address.
     * @param email - The email address to search for.
     * @param subject - The subject of the emails to count.
     * @param timeoutMs - The timeout for the request in milliseconds.
     * @returns Promise<number> - The number of emails found.
     */
    async countEmailsWithSubject(email: string, subject: string, timeoutMs: number = timeouts.default): Promise<number> {
        logger.info(`[MailosaurService.countEmailsWithSubject] - Counting emails with subject: ${subject} for email: ${email}`);
        const messages = await this.mailosaur.messages.search(this.serverId, { sentTo: email, subject }, { timeout: timeoutMs, errorOnTimeout: false });
        if (!messages || !messages.items) return 0;
        return messages.items.length;
    }

    /**
     * Retrieves the verification code from the email with the specified subject.
     * @param email - The email address to search for.
     * @param subject - The subject of the email to retrieve the code from.
     * @param timeoutMs - The timeout for the request in milliseconds.
     * @returns Promise<string> - The verification code found in the email.
     */
    async getVerificationCode(email: string, subject: string, timeoutMs: number = timeouts.long): Promise<string> {
        logger.info(`[MailosaurService.getVerificationCode] - Fetching verification code for email: ${email}, subject: ${subject}`);
        const message = await this.getMessageBySubject(email, subject, timeoutMs);
        if (!message) {
            throw new Error(`[MailosaurService.getVerificationCode] - Email message not found for subject: ${subject} and email: ${email}`);
        }
        const code = message.html?.codes?.[0]?.value;
        if (!code) {
            throw new Error(`[MailosaurService.getVerificationCode] - Verification code not found for email: ${email}, subject: ${subject}`);
        } else {
            logger.info(`[MailosaurService.getVerificationCode] - Found verification code: ${code} for email: ${email}`);
        }
        return code;
    }

    /**
     * Returns the list of attachment file names for the email with the given subject.
     *
     * @param email - The recipient email address to search for.
     * @param subject - The subject of the email containing the attachments.
     * @param timeoutMs - The maximum time to wait for the email (in milliseconds).
     * @returns Promise<string[]> - Array of attachment file names found (empty array if none).
     * @throws Error - If the email message cannot be found within the timeout period.
     */
    async getAttachmentsList(email: string, subject: string, timeoutMs: number = timeouts.long): Promise<string[]> {
        logger.info(`[MailosaurService.getAttachmentsList] - Fetching attachments for email: ${email}, subject: ${subject}`);
        const message = await this.getMessageBySubject(email, subject, timeoutMs);
        if (!message) {
            throw new Error(`[MailosaurService.getAttachmentsList] - Email message not found for subject: ${subject} and email: ${email}`);
        }
        const attachments = message.attachments ?? [];
        const fileNames = attachments.map(att => att.fileName).filter((fn): fn is string => typeof fn === 'string');
        logger.info(`[MailosaurService.getAttachmentsList] - Found attachments: ${fileNames.join(', ')} for email: ${email}, subject: ${subject}`);
        return fileNames;
    }

    /**
     * Retrieves all links from the email with the specified subject.
     * @param email - The email address to search for.
     * @param subject - The subject of the email to retrieve links from.
     * @param timeoutMs - The timeout for the request in milliseconds.
     * @returns Promise<string[]> - Array of link URLs found in the email.
     */
    async getLinks(email: string, subject: string, timeoutMs: number = timeouts.long): Promise<string[]> {
        logger.info(`[MailosaurService.getLinks] - Fetching links for email: ${email}, subject: ${subject}`);
        const message = await this.getMessageBySubject(email, subject, timeoutMs);
        if (!message) {
            throw new Error(`[MailosaurService.getLinks] - Email message not found for subject: ${subject} and email: ${email}`);
        }
        const links = message.html?.links ?? [];
        const linkUrls = links.map(link => link.href).filter((href): href is string => typeof href === 'string');
        logger.info(`[MailosaurService.getLinks] - Found ${linkUrls.length} links for email: ${email}, subject: ${subject}`);
        return linkUrls;
    }
}
