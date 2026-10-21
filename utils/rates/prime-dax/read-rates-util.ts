
import { logger } from '@utils/logger-util';
import * as fs from 'fs';
import * as path from 'path';

export class ReadRatesUtil {
    private static instance: ReadRatesUtil | null = null;
    private ageFactors: any;
    private baseRateCat: any;
    private baseRateDog: any;
    private breedCat: any;
    private breedDog: any;
    private breedRateCat: any;
    private breedRateDog: any;

    private constructor() {
        logger.info('[ReadRatesUtil.constructor] Initializing rate data');
        this.ageFactors = this.readJsonFromResource('rates-ppu-prime/age_factor.json');
        this.baseRateCat = this.readJsonFromResource('rates-ppu-prime/base_rate_cat.json');
        this.baseRateDog = this.readJsonFromResource('rates-ppu-prime/base_rate_dog.json');
        this.breedCat = this.readJsonFromResource('rates-ppu-prime/breed_cat.json');
        this.breedDog = this.readJsonFromResource('rates-ppu-prime/breed_dog.json');
        this.breedRateCat = this.readJsonFromResource('rates-ppu-prime/breed_rate_cat.json');
        this.breedRateDog = this.readJsonFromResource('rates-ppu-prime/breed_rate_dog.json');
    }

    public static getInstance(): ReadRatesUtil {
        if (!ReadRatesUtil.instance) {
            ReadRatesUtil.instance = new ReadRatesUtil();
        }
        return ReadRatesUtil.instance;
    }

    private readJsonFromResource(folderPath: string): any {
        const baseDir = path.resolve(__dirname, '../../../test-files');
        const filePath = path.join(baseDir, folderPath);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    }

    public getAgeFactors() { return this.ageFactors; }
    public getBaseRateCat() { return this.baseRateCat; }
    public getBaseRateDog() { return this.baseRateDog; }
    public getBreedDog() { return this.breedDog; }
    public getBreedRateCat() { return this.breedRateCat; }
    public getBreedRateDog() { return this.breedRateDog; }
    public getBreedCat() { return this.breedCat; }
}
