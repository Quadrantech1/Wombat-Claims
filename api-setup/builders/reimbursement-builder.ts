import { ReimbursementOption } from '@api-setup/interfaces/payloads/reimbursement-interface';
import { getTodayDate } from '@utils/date-util';
import { logger } from '@utils/logger-util';

/**
 * Builder for creating reimbursement option payloads
 */
export class ReimbursementBuilder {
    private payload: ReimbursementOption;

    constructor(randomValue: string, employeeId: number) {

        this.payload = {
            employeeReimbursementOptionId: 0,
            employeeGeneratedNumber: randomValue,
            employeeId,
            accountNumber: '234345',
            routingNumber: '456789',
            accountTypeId: 1,
            bankName: 'Wells fargo',
            active: true,
            createdOn: getTodayDate('API'),
            modifiedOn: getTodayDate('API'),
            secCodeId: 1
        };
    }

    /**
     * Merge overrides into payload
     * @param overrides - Partial reimbursement option object to merge
     */
    withPayload(overrides: Partial<ReimbursementOption>): this {
        this.payload = { ...this.payload, ...overrides };
        return this;
    }

    /**
     * Build and return the reimbursement option payload
     */
    build(): ReimbursementOption {
        logger.info(`[ReimbursementBuilder.build] - Building reimbursement option for employeeId: ${this.payload.employeeId}`);
        return { ...this.payload };
    }

    /**
     * Static factory method
     * @param randomValue - Random value for unique identification
     * @param employeeId - The employee ID
     */
    static create(randomValue: string, employeeId: number): ReimbursementBuilder {
        return new ReimbursementBuilder(randomValue, employeeId);
    }
}
