import { SidneySelectPolicyPayload } from '../interfaces/payloads/sidney-select-policy-interface';

export class SidneySelectPolicyBuilder {
    private payload: SidneySelectPolicyPayload;

    constructor() {
        this.payload = {
            base: { code: 'Level2~Deductible500~Copay20' },
            wellness: { code: 'Low' },
            annualLimit: { limit: 'Limit5000' },
        };
    }

    /**
     * Set the base coverage using numeric values.
     * Builds the code string in the format: Level{level}~Deductible{deductible}~Copay{copay}
     * @param level The coverage level number (e.g. 2 → 'Level2').
     * @param deductible The deductible amount (e.g. 500 → 'Deductible500').
     * @param copay The copay percentage (e.g. 20 → 'Copay20').
     */
    withBase(level: number, deductible: number, copay: number) {
        this.payload.base = { code: `Level${level}~Deductible${deductible}~Copay${copay}` };
        return this;
    }

    /**
     * Set the wellness add-on code (e.g. 'Low', 'High', 'None').
     * @param code The wellness code.
     */
    withWellness(code: string) {
        this.payload.wellness = { code };
        return this;
    }

    /**
     * Set the annual limit. Pass a number (e.g. 5000 → 'Limit5000') or 'Unlimited'.
     * @param limit The limit amount as a number, or the string 'Unlimited'.
     */
    withAnnualLimit(limit: number | 'Unlimited') {
        this.payload.annualLimit = { limit: `Limit${limit}` };
        return this;
    }

    build(): SidneySelectPolicyPayload {
        return { ...this.payload };
    }

    static create() {
        return new SidneySelectPolicyBuilder();
    }
}
