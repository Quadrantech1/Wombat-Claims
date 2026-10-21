import { logger } from '@utils/logger-util';
import { DataCore, getDefaultDataCore } from './data-core';
import { ReadRatesCoreUtil } from './read-rates-core-util';

export class FormulaCoreRateUtil {

    // main variables
    private baseRateValue = 0.0000;
    private lossRatioValue = 0.0000;
    private breedLocatorFactorValue = 0.0000;
    private premiumUpliftFactorValue = 0.0000;

    // helpers
    private territoryValue;
    private breedRatingValue;
    private basePremiumOptionValue;
    private basePremiumValueAccident;

    /**
     * @param isDog
     * @param breed
     * @param age
     * @param territory
     * @param baseSpeciesLevel
     */
    constructor(dataCore?: Partial<DataCore>) {
        logger.info(`[FormulaCoreRateUtil.constructor] Initializing with data: ${JSON.stringify(dataCore)}`);
        const data = { ...getDefaultDataCore(), ...dataCore };

        this.territoryValue = ReadRatesCoreUtil.getInstance().getTerritoryRate()[data.zipcode]; // A B C

        if (!this.territoryValue) {
            const firstTwoLetterZipcode = data.zipcode.substring(0, 2);
            this.territoryValue = ReadRatesCoreUtil.getInstance().getTerritoryRate()[firstTwoLetterZipcode]; // A B C
        }

        if (!this.territoryValue) {
            const firstLetterZipcode = data.zipcode.charAt(0);
            this.territoryValue = ReadRatesCoreUtil.getInstance().getTerritoryRate()[firstLetterZipcode]; // A B C
        }

        if (!this.territoryValue) {
            throw new Error(`<<<< ERROR >>>> Invalid zipcode provided: ${data.zipcode}`);
        }

        logger.info(`[FormulaCoreRateUtil.constructor] Territory value: ${this.territoryValue}`);

        this.basePremiumOptionValue = data.basePremium;

        if (data.isDog) {
            logger.info(`[FormulaCoreRateUtil.constructor] Dog selected`);
            this.baseRateValue = ReadRatesCoreUtil.getInstance().getBaseRateDog()[data.basePremium];
            logger.info(`[FormulaCoreRateUtil.constructor] Base rate value: ${this.baseRateValue}`);
            this.lossRatioValue = ReadRatesCoreUtil.getInstance().getLossRatioDog()[data.productBreakdown];
            logger.info(`[FormulaCoreRateUtil.constructor] Loss ratio value: ${this.lossRatioValue}`);
            this.lossRatioValue = parseFloat(String(this.lossRatioValue).replace('%', '')) / 100; // convert to decimal
            logger.info(`[FormulaCoreRateUtil.constructor] Loss ratio converted value: ${this.lossRatioValue}`);
            this.breedRatingValue = ReadRatesCoreUtil.getInstance().getBreedRatingDog()[data.breed]; // D1 D2 D3.. D7 

            logger.info(`[FormulaCoreRateUtil.constructor] Breed rating value: ${this.breedRatingValue}`);


            if (data.basePremium.includes('$3000 Limit')) { // for locator factor
                this.breedLocatorFactorValue = ReadRatesCoreUtil.getInstance().getBreedLocatorFactor3000Limit()[this.breedRatingValue][this.territoryValue];
                logger.info(`[FormulaCoreRateUtil.constructor] #3000 Limit > Breed locator factor value: ${this.breedLocatorFactorValue}`);
            } else {
                this.breedLocatorFactorValue = ReadRatesCoreUtil.getInstance().getBreedLocatorMax()[this.breedRatingValue][this.territoryValue];
                logger.info(`[FormulaCoreRateUtil.constructor] A&I Max A&I More > Breed locator factor value: ${this.breedLocatorFactorValue}`);
            }


            if (data.basePremium.includes('A&I Max')) { // 
                this.premiumUpliftFactorValue = ReadRatesCoreUtil.getInstance().getPremUpliftMaxDog()[data.coinsurance][data.level];
                logger.info(`[FormulaCoreRateUtil.constructor] Premium uplift factor value: ${this.premiumUpliftFactorValue}`);
            } else {
                // 3000 limit
                if (data.level === 'level1' && data.basePremium === '$3000 Limit') {
                    logger.info(`[FormulaCoreRateUtil.constructor] Level 1 selected - using 3000$ Limit values - Fixed Value >>> 20% - level1`);
                    this.premiumUpliftFactorValue = ReadRatesCoreUtil.getInstance().getPremUplift3000LimitDog()["20%"]["level1"];
                    logger.info(`[FormulaCoreRateUtil.constructor]  Level 1 selected - using 3000$ Limit values - Fixed Value >>> Premium uplift factor value: ${this.premiumUpliftFactorValue}`);
                } else {
                    this.premiumUpliftFactorValue = ReadRatesCoreUtil.getInstance().getPremUplift3000LimitDog()[data.coinsurance][data.level];
                    logger.info(`[FormulaCoreRateUtil.constructor] Premium uplift factor value: ${this.premiumUpliftFactorValue}`);
                }

            }
            this.premiumUpliftFactorValue = parseFloat(String(this.premiumUpliftFactorValue).replace('%', '')) / 100;
            logger.info(`[FormulaCoreRateUtil.constructor] Premium uplift factor converted value: ${this.premiumUpliftFactorValue}`);

            this.basePremiumValueAccident = ReadRatesCoreUtil.getInstance().getBaseRateDog()['accident']; // for fixed rate
        }
        else {
            logger.info(`[FormulaCoreRateUtil.constructor] Cat selected`);
            this.baseRateValue = ReadRatesCoreUtil.getInstance().getBaseRateCat()[data.basePremium];
            logger.info(`[FormulaCoreRateUtil.constructor] Base rate value: ${this.baseRateValue}`);
            this.lossRatioValue = ReadRatesCoreUtil.getInstance().getLossRatioCat()[data.productBreakdown]
            logger.info(`[FormulaCoreRateUtil.constructor] Loss ratio value: ${this.lossRatioValue}`);
            this.lossRatioValue = parseFloat(String(this.lossRatioValue).replace('%', '')) / 100; // convert to decimal
            logger.info(`[FormulaCoreRateUtil.constructor] Loss ratio converted value: ${this.lossRatioValue}`);
            this.breedRatingValue = ReadRatesCoreUtil.getInstance().getBreedRatingCat()[data.breed]; // C1 C2 C3
            logger.info(`[FormulaCoreRateUtil.constructor] Breed rating value: ${this.breedRatingValue}`);

            if (data.basePremium.includes('$3000 Limit')) { // for locator factor
                this.breedLocatorFactorValue = ReadRatesCoreUtil.getInstance().getBreedLocatorFactor3000Limit()[this.breedRatingValue][this.territoryValue];
                logger.info(`[FormulaCoreRateUtil.constructor] Breed locator factor value: ${this.breedLocatorFactorValue}`);
            } else {
                this.breedLocatorFactorValue = ReadRatesCoreUtil.getInstance().getBreedLocatorMax()[this.breedRatingValue][this.territoryValue];
                logger.info(`[FormulaCoreRateUtil.constructor] Breed locator factor value: ${this.breedLocatorFactorValue}`);
            }

            if (data.basePremium.includes('A&I Max')) {
                this.premiumUpliftFactorValue = ReadRatesCoreUtil.getInstance().getPremUpliftMaxCat()[data.coinsurance][data.level];
                logger.info(`[FormulaCoreRateUtil.constructor] Premium uplift factor value: ${this.premiumUpliftFactorValue}`);
            } else {

                if (data.level === 'level1' && data.basePremium === '$3000 Limit') {
                    logger.info(`[FormulaCoreRateUtil.constructor] Level 1 selected - using 3000$ Limit values - Fixed Value >>> 20% - level1`);
                    this.premiumUpliftFactorValue = ReadRatesCoreUtil.getInstance().getPremUplift3000LimitCat()["20%"]["level1"];
                    logger.info(`[FormulaCoreRateUtil.constructor]  Level 1 selected - using 3000$ Limit values - Fixed Value >>> Premium uplift factor value: ${this.premiumUpliftFactorValue}`);
                } else {
                    this.premiumUpliftFactorValue = ReadRatesCoreUtil.getInstance().getPremUplift3000LimitCat()[data.coinsurance][data.level];
                    logger.info(`[FormulaCoreRateUtil.constructor] Premium uplift factor value: ${this.premiumUpliftFactorValue}`);
                }
            }
            this.premiumUpliftFactorValue = parseFloat(String(this.premiumUpliftFactorValue).replace('%', '')) / 100;
            logger.info(`[FormulaCoreRateUtil.constructor] Premium uplift factor converted value: ${this.premiumUpliftFactorValue}`);

            this.basePremiumValueAccident = ReadRatesCoreUtil.getInstance().getBaseRateCat()['accident']; // for fixed rate
        }

    }

    public getMonthlyRate(): number {
        if (this.basePremiumOptionValue === 'accident') {
            logger.info(`[FormulaCoreRateUtil.getMonthlyRate] Accident only selected - fixed rate: ${this.basePremiumValueAccident}`);
            return this.basePremiumValueAccident; // fixed value for accident only
        }
        let firstCalculation = (this.baseRateValue / this.lossRatioValue * this.breedLocatorFactorValue);
        firstCalculation = Math.round(firstCalculation * 100) / 100; // round to 2 decimals
        let secondCalculation = (this.baseRateValue / this.lossRatioValue * this.breedLocatorFactorValue);
        secondCalculation = Math.round(secondCalculation * 100) / 100; // round to 2 decimals
        let thirdCalculation = Math.round((secondCalculation * this.premiumUpliftFactorValue) * 100) / 100;
        let finalCalculation = Math.round((firstCalculation + thirdCalculation) * 100) / 100;
        logger.info(`[FormulaCoreRateUtil.getMonthlyRate] Final calculation: ${finalCalculation}`);
        return finalCalculation;
    }
}
