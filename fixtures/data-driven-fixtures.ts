import { test as base } from '@fixtures/api-fixtures';
import { ExcelReaderUtil } from '@utils/excel-reader-util';
import { logger } from '@utils/logger-util';
import path from 'path';

type DataDrivenFixtures = {
    catsPPUCoreData: any[];
    dogsPPUCoreData: any[];
    dogsPPUPrimeData: any[];
    catsPPUPrimeData: any[];
};

export const test = base.extend<{}, DataDrivenFixtures>({
    catsPPUCoreData: [async ({ }, use) => {
        logger.info('[catsPPUCoreData] - Loading Cats PPU Core Excel data');
        const excelFilePath = path.join(__dirname, '../test-files/data-driven/Data_Cats_PPU_Core_Existing.xlsx');
        const excelReader = new ExcelReaderUtil(excelFilePath);
        excelReader.load('Cat');
        const data = excelReader.convertToJson();
        excelReader.clearExcelReferences();
        logger.info(`[catsPPUCoreData] - Loaded ${data.length} test cases`);
        await use(data);
    }, { scope: 'worker' }],

    dogsPPUCoreData: [async ({ }, use) => {
        logger.info('[dogsPPUCoreData] - Loading Dogs PPU Core Excel data');
        const excelFilePath = path.join(__dirname, '../test-files/data-driven/Data_Dogs_PPU_Core_Existing.xlsx');
        const excelReader = new ExcelReaderUtil(excelFilePath);
        excelReader.load('Dog');
        const data = excelReader.convertToJson();
        excelReader.clearExcelReferences();
        logger.info(`[dogsPPUCoreData] - Loaded ${data.length} test cases`);
        await use(data);
    }, { scope: 'worker' }],

    dogsPPUPrimeData: [async ({ }, use) => {
        logger.info('[dogsPPUPrimeData] - Loading Dogs PPU Prime Excel data');
        const excelFilePath = path.join(__dirname, '../test-files/data-driven/Data_Dogs_PPU_Prime.xlsx');
        const excelReader = new ExcelReaderUtil(excelFilePath);
        excelReader.load('Dog');
        const data = excelReader.convertToJson();
        excelReader.clearExcelReferences();
        logger.info(`[dogsPPUPrimeData] - Loaded ${data.length} test cases`);
        await use(data);
    }, { scope: 'worker' }],

    catsPPUPrimeData: [async ({ }, use) => {
        logger.info('[catsPPUPrimeData] - Loading Cats PPU Prime Excel data');
        const excelFilePath = path.join(__dirname, '../test-files/data-driven/Data_Cats_PPU_Prime.xlsx');
        const excelReader = new ExcelReaderUtil(excelFilePath);
        excelReader.load('Cat');
        const data = excelReader.convertToJson();
        excelReader.clearExcelReferences();
        logger.info(`[catsPPUPrimeData] - Loaded ${data.length} test cases`);
        await use(data);
    }, { scope: 'worker' }],
});

export { expect } from '@playwright/test';

