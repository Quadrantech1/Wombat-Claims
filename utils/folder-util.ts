import { promises as fs } from 'fs';
import { logger } from './logger-util';

/**
 * Creates a folder if it does not exist (recursive)
 * @param folderPath Path to the folder
 */
export async function createFolderIfNotExists(folderPath: string) {
  try {
    await fs.mkdir(folderPath, { recursive: true });
    logger.info(`[folder-util.createFolderIfNotExists] - folder created: ${folderPath}`);
  } catch (error) {
    logger.error(`[folder-util.createFolderIfNotExists] - Error creating folder: ${error}`);
  }
}