
import { logger } from '@utils/logger-util';
import * as fs from 'fs';
import * as path from 'path';

export class ReadRatesCoreUtil {
    private static instance: ReadRatesCoreUtil | null = null;
    private ageDeductibleCat: any;
    private ageDeductibleDog: any;
    private baseRateCat: any;
    private baseRateDog: any;
    private breedLocatorFactor3000Limit: any;
    private breedLocatorMax: any;
    private breedRatingCat: any;
    private breedRatingDog: any;
    private lossRatioCat: any;
    private lossRatioDog: any;
    private premUplift3000LimitCat: any;
    private premUplift3000LimitDog: any;
    private premUpliftMaxCat: any;
    private premUpliftMaxDog: any;
    private territoryRate: any;

    private constructor() {
        logger.info('[ReadRatesCoreUtil.constructor] Initializing rate data');
        this.ageDeductibleCat = this.readJsonFromResource('rates-ppu-core/age_deductible_cat.json');
        this.ageDeductibleDog = this.readJsonFromResource('rates-ppu-core/age_deductible_dog.json');
        this.baseRateCat = this.readJsonFromResource('rates-ppu-core/base_rate_cat.json');
        this.baseRateDog = this.readJsonFromResource('rates-ppu-core/base_rate_dog.json');
        this.breedLocatorFactor3000Limit = this.readJsonFromResource('rates-ppu-core/breed_locator_factor_3000limit.json');
        this.breedLocatorMax = this.readJsonFromResource('rates-ppu-core/breed_locator_factor_max.json');
        this.breedRatingCat = this.readJsonFromResource('rates-ppu-core/breed_rating_cat.json');
        this.breedRatingDog = this.readJsonFromResource('rates-ppu-core/breed_rating_dog.json');
        this.lossRatioCat = this.readJsonFromResource('rates-ppu-core/loss_ratio_cat.json');
        this.lossRatioDog = this.readJsonFromResource('rates-ppu-core/loss_ratio_dog.json');
        this.premUplift3000LimitCat = this.readJsonFromResource('rates-ppu-core/prem_uplift_3000limit_cat.json');
        this.premUplift3000LimitDog = this.readJsonFromResource('rates-ppu-core/prem_uplift_3000limit_dog.json');
        this.premUpliftMaxCat = this.readJsonFromResource('rates-ppu-core/prem_uplift_max_cat.json');
        this.premUpliftMaxDog = this.readJsonFromResource('rates-ppu-core/prem_uplift_max_dog.json');
        this.territoryRate = this.readJsonFromResource('rates-ppu-core/territory_rate.json');

    }

    public static getInstance(): ReadRatesCoreUtil {
        if (!ReadRatesCoreUtil.instance) {
            ReadRatesCoreUtil.instance = new ReadRatesCoreUtil();
        }
        return ReadRatesCoreUtil.instance;
    }

    private readJsonFromResource(folderPath: string): any {
        const baseDir = path.resolve(__dirname, '../../../test-files');
        const filePath = path.join(baseDir, folderPath);
        logger.info(`[ReadRatesCoreUtil.readJsonFromResource] Reading JSON file from: ${filePath}`);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    }

    public getAgeDeductibleCat() { return this.ageDeductibleCat; }
    public getAgeDeductibleDog() { return this.ageDeductibleDog; }
    public getBaseRateCat() { return this.baseRateCat; }
    public getBaseRateDog() { return this.baseRateDog; }
    public getBreedLocatorFactor3000Limit() { return this.breedLocatorFactor3000Limit; }
    public getBreedLocatorMax() { return this.breedLocatorMax; }
    public getBreedRatingCat() { return this.breedRatingCat; }
    public getBreedRatingDog() { return this.breedRatingDog; }
    public getLossRatioCat() { return this.lossRatioCat; }
    public getLossRatioDog() { return this.lossRatioDog; }
    public getPremUplift3000LimitCat() { return this.premUplift3000LimitCat; }
    public getPremUplift3000LimitDog() { return this.premUplift3000LimitDog; }
    public getPremUpliftMaxCat() { return this.premUpliftMaxCat; }
    public getPremUpliftMaxDog() { return this.premUpliftMaxDog; }
    public getTerritoryRate() { return this.territoryRate; }

}
