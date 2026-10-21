import { logger } from '@utils/logger-util';
import { DataPrime, getDefaultPrimeData } from './data-prime';
import { ReadRatesUtil } from './read-rates-util';

export class FormulaPrimeDaxRateUtil {
    private territoryValue = 0.0000;
    private ageValue = 0.4119;
    private breedValue = 0.2400;
    private basedSpeciesValue = 25.72944;
    private limitSpeciesFactor: number;
    private discountValue = 1 - 0;
    private baseValue: number;
    private annualBenefitCap: number = 0;

    private monthlyRate: number = 0;
    private yearlyRate: number = 0;

    /**
     * @param isDog
     * @param breed
     * @param age
     * @param territory
     * @param baseSpeciesLevel
     */
    constructor(dataPrime?: Partial<DataPrime>) {
        logger.info(`[FormulaPrimeDaxRateUtil.constructor] isDog: ${dataPrime?.isDog}, breed: ${dataPrime?.breed}, age: ${dataPrime?.age}, territory: ${dataPrime?.territory}, baseSpeciesLevel: ${dataPrime?.baseSpeciesLevel}`);
        const data = { ...getDefaultPrimeData(), ...dataPrime };

        const ratesUtil = ReadRatesUtil.getInstance();
        this.ageValue = ratesUtil.getAgeFactors()[data.age];
        logger.info(`[FormulaPrimeDaxRateUtil.constructor] Age Value: ${this.ageValue}`);

        if (data.isDog) {
            const riskLevel = ratesUtil.getBreedDog()[data.breed];
            logger.info(`[FormulaPrimeDaxRateUtil.constructor] Dog risk level: ${riskLevel}`);
            this.breedValue = ratesUtil.getBreedRateDog()[riskLevel];
        } else {
            const riskLevel = ratesUtil.getBreedCat()[data.breed];
            logger.info(`[FormulaPrimeDaxRateUtil.constructor] Cat risk level: ${riskLevel}`);
            this.breedValue = ratesUtil.getBreedRateCat()[riskLevel];
        }
        logger.info(`[FormulaPrimeDaxRateUtil.constructor] Final Breed Value: ${this.breedValue}`);

        if (data.isDog) {
            this.basedSpeciesValue = ratesUtil.getBaseRateDog()[data.baseSpeciesLevel]?.value;
            this.limitSpeciesFactor = ratesUtil.getBaseRateDog()[data.baseSpeciesLevel]?.limitSpeciesFactor;
            const annualBenefitStr = ratesUtil.getBaseRateDog()[data.baseSpeciesLevel]?.annual_benefit;
            this.annualBenefitCap = this.parseAnnualBenefit(annualBenefitStr);
        } else {
            this.basedSpeciesValue = ratesUtil.getBaseRateCat()[data.baseSpeciesLevel]?.value;
            this.limitSpeciesFactor = ratesUtil.getBaseRateCat()[data.baseSpeciesLevel]?.limitSpeciesFactor;
            const annualBenefitStr = ratesUtil.getBaseRateCat()[data.baseSpeciesLevel]?.annual_benefit;
            this.annualBenefitCap = this.parseAnnualBenefit(annualBenefitStr);
        }
        logger.info(`[FormulaPrimeDaxRateUtil.constructor] Based Species Value: ${this.basedSpeciesValue}`);
        logger.info(`[FormulaPrimeDaxRateUtil.constructor] Limit Species Factor: ${this.limitSpeciesFactor}`);
        logger.info(`[FormulaPrimeDaxRateUtil.constructor] Annual Benefit Cap: ${this.annualBenefitCap}`);
        this.baseValue = this.basedSpeciesValue * this.limitSpeciesFactor;
        logger.info(`[FormulaPrimeDaxRateUtil.constructor] Base Value: ${this.baseValue}`);
    }

    public getMonthlyRate(): number {
        const value = (this.territoryValue + this.ageValue + this.breedValue) + 1;
        const uncappedMonthlyRate = this.baseValue * value * this.discountValue;
        const uncappedYearlyRate = uncappedMonthlyRate * 12;

        // Apply 70% cap if annual benefit is defined and not unlimited
        if (this.annualBenefitCap > 0) {
            const maxYearlyRate = this.annualBenefitCap * 0.7;
            logger.info(`[FormulaPrimeDaxRateUtil.getMonthlyRate] Uncapped Yearly Rate: ${uncappedYearlyRate}, Max Yearly Rate (70% of ${this.annualBenefitCap}): ${maxYearlyRate}`);

            if (uncappedYearlyRate > maxYearlyRate) {
                this.monthlyRate = maxYearlyRate / 12;
                logger.info(`[FormulaPrimeDaxRateUtil.getMonthlyRate] Rate capped to: ${this.monthlyRate}`);
            } else {
                this.monthlyRate = uncappedMonthlyRate;
                logger.info(`[FormulaPrimeDaxRateUtil.getMonthlyRate] Rate (uncapped): ${this.monthlyRate}`);
            }
        } else {
            this.monthlyRate = uncappedMonthlyRate;
            logger.info(`[FormulaPrimeDaxRateUtil.getMonthlyRate] Rate (unlimited): ${this.monthlyRate}`);
        }

        return this.monthlyRate;
    }

    public getYearlyRate(): number {
        this.yearlyRate = this.getMonthlyRate() * 12;
        logger.info(`[FormulaPrimeDaxRateUtil.getYearlyRate] Rate: ${this.yearlyRate}`);
        return this.yearlyRate;
    }

    private parseAnnualBenefit(annualBenefitStr: string): number {
        if (!annualBenefitStr || annualBenefitStr.toLowerCase() === 'unlimited') {
            return 0; // 0 indicates unlimited (no cap)
        }
        // Remove $ and commas, then parse to number
        const numericValue = parseFloat(annualBenefitStr.replace(/[$,]/g, ''));
        logger.info(`[FormulaPrimeDaxRateUtil.parseAnnualBenefit] Parsed '${annualBenefitStr}' to ${numericValue}`);
        return numericValue;
    }

    public getLimitSpeciesFactor(): number {
        return this.limitSpeciesFactor;
    }
}
