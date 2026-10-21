import { MvcApiClient } from '@api-setup/client/mvc-api-client';
import { config } from '@config/env-config';
import { OrcaAuthHelper } from '@test-helpers/orca-auth-helper';
import { Role } from '@utils/user-credentials-util';

/**
 * Runs transactions via the Orca Finance API.
 * @param paymentTypeId Payment type ID
 * @param underwriterId Underwriter ID
 * @param paymentProviderId Payment provider ID
 */
export async function runOrcaTransactions(
    paymentTypeId: string,
    underwriterId: string,
    paymentProviderId: string
): Promise<void> {
    const apiContext = await OrcaAuthHelper.createApiContextWithCookie(Role.Admin);
    const mvcApi = new MvcApiClient(apiContext, config.URL_ORCA);

    const body = {
        Commit: 'true',
        TransactionsToRun: '',
        SubmitAll: 'true',
        PaymentTypeId: paymentTypeId,
        UnderwriterId: underwriterId,
        PaymentProviderId: paymentProviderId,
        SysUserId: '389',
        TransactionDate: new Date().toLocaleString('en-US', { hour12: true }),
        undefined: 'undefined'
    };

    try {
        await mvcApi.postForm('/Finance/RunTransactions', body);
    } catch (error) {
        throw new Error(`[MvcRunTransactionsHelper.runOrcaTransactions] - ${error}`);
    }
}