import fsSync from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { createFolderIfNotExists } from './folder-util';
import { logger } from './logger-util';

/**
  * Downloads a PDF file either via Playwright's download event or direct HTTP(S) request with cookies.
  * @param page Playwright Page object
  * @param pdfUrl URL of the PDF to download
  * @param folderName relative path to the target directory inside download folder (e.g., 'policyId')
  * @param nameFile Name to save the PDF as
  */
export async function downloadPdf(
    page: any,
    pdfUrl: string,
    folderName: string,
    nameFile: string,
    downloadFolder: string = 'download'
): Promise<void> {

    await createFolderIfNotExists(path.join(downloadFolder, folderName));

    logger.info(`[DownloadUtil.downloadPdf] - Downloading PDF from URL: ${pdfUrl}`);
    logger.info(`[DownloadUtil.downloadPdf] - Download directory: ${folderName}`);
    logger.info(`[DownloadUtil.downloadPdf] - File name: ${nameFile}`);
    const downloadPath = path.join(downloadFolder, folderName, nameFile);
    let fileUrl = pdfUrl;
    if (!/^https?:\/\//i.test(fileUrl)) {
        const baseUrl = page.url();
        fileUrl = new URL(fileUrl, baseUrl).toString();
    }
    // Get cookies from the browser context
    const cookies = await page.context().cookies(fileUrl);
    const cookieHeader = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
    await new Promise((resolve, reject) => {
        const client = fileUrl.startsWith('https') ? https : http;
        const options = {
            headers: { Cookie: cookieHeader }
        };
        client.get(fileUrl, options, (response: any) => {
            if (response.statusCode !== 200) {
                reject(new Error(`[DownloadUtil.downloadPdf] - Failed to get '${fileUrl}' (${response.statusCode})`));
                return;
            }
            const fileStream = fsSync.createWriteStream(downloadPath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close(resolve);
            });
        }).on('error', reject);
    });
}