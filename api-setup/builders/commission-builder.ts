import { Commission } from '@api-setup/interfaces/payloads/commission-interface';
import { getDaysAgoDate } from '@utils/date-util';
import { logger } from '@utils/logger-util';

/**
 * Builder for creating commission payloads
 */
export class CommissionBuilder {
    private commissions: Commission[];

    constructor(masterPolicyNumber: string, randomValue: string) {

        this.commissions = [
            {
                producerName: `Auto${randomValue}`,
                nationalProducerNumber: `Auto${randomValue}`,
                subProducerNumber: `BAK${randomValue}`,
                subProducerName: 'Super',
                subProducerAddress: '2536 New producer Ln',
                subProducerCity: 'Charlotte',
                subProducerState: 'NC',
                subProducerPostalCode: '28269',
                commissionMonthYear: getDaysAgoDate(30, 'API'),
                invoicePaymentDate: getDaysAgoDate(15, 'API'),
                appliedDate: getDaysAgoDate(28, 'API'),
                commissionPercentage: 0.20,
                commissionAmount: 200.00,
                periodPremiumBilled: 1000.00,
                periodPremiumCollected: 1000.00,
                payrollStartDate: getDaysAgoDate(90, 'API'),
                payrollEndDate: getDaysAgoDate(60, 'API'),
                policyEffectiveDate: getDaysAgoDate(365, 'API'),
                policyTerm: 1,
                masterPolicyNumber: masterPolicyNumber,
                groupAccountName: 'Cigna Group'
            }
        ];
    }

    /**
     * Merge overrides into payload
     * @param commissionNumber - 1-based index of commission. Creates new commission if doesn't exist.
     * @param overrides - Partial commission object to merge
     */
    withPayload(commissionNumber: number, overrides?: Partial<Commission>): this {
        if (commissionNumber < 1) {
            throw new Error(`[CommissionBuilder.withPayload] - Commission number must be 1 or greater, got ${commissionNumber}`);
        }

        const baseCommission = this.commissions[0];
        const baseRandomValue = baseCommission.producerName.replace('Auto', '');

        // If commission at this index doesn't exist, create it
        while (this.commissions.length < commissionNumber) {
            const index = this.commissions.length + 1;
            const newCommission: Commission = {
                ...baseCommission,
                producerName: `Auto${index}${baseRandomValue}`,
                nationalProducerNumber: `Auto${index}${baseRandomValue}`,
                subProducerNumber: `BAK${index}${baseRandomValue}`,
            };
            this.commissions.push(newCommission);
        }

        // Apply overrides to the commission at the specified index
        if (overrides) {
            this.commissions[commissionNumber - 1] = {
                ...this.commissions[commissionNumber - 1],
                ...overrides
            };
        }

        return this;
    }

    /**
     * Build and return the commission payload array
     */
    build(): Commission[] {
        logger.info(`[CommissionBuilder.build] - Building ${this.commissions.length} commission(s)`);
        return [...this.commissions];
    }

    /**
     * Static factory method
     * @param masterPolicyNumber - The master policy number for the commissions
     * @param randomValue - Random value for unique identification
     */
    static create(masterPolicyNumber: string, randomValue: string): CommissionBuilder {
        return new CommissionBuilder(masterPolicyNumber, randomValue);
    }
}
