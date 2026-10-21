import { InternalApiClient } from "@api-setup/client/internal-api-client";
import { PolicyEndpoints } from "@api-setup/endpoints";
import { Databases, runQuery } from "@utils/db-client-util";

/**
 * Backdate a policy to a given date by calling the internal API.
 *
 * @param internalApi - An authenticated InternalApiClient instance used to send the request
 * @param policyId - The numeric policy identifier (as a string) to backdate
 * @param date - The new effective date to apply (ISO date string expected)
 * @throws {Error} When the database query returns no results or when the
 *                  internal API response is missing or indicates failure
 */
export async function backDatePolicyForDays(internalApi: InternalApiClient, policyId: string, date: string): Promise<void> {
    const sqlQuery = `
            SELECT coverage_period_id FROM coverage_period cp
            JOIN policy_term pt
            ON cp.policy_term_id = pt.policy_term_id
            WHERE policy_id = ${policyId}
            `;
    const coveragePeriodResult = await runQuery(Databases.ORCA, sqlQuery);
    if (!coveragePeriodResult || coveragePeriodResult.length === 0) {
        throw new Error('[api-backdate-policy-helper.backDatePolicyForDays] - No coverage period found for policyId');
    }
    const coveragePeriodId = coveragePeriodResult[0].coverage_period_id;

    const backDatePolicyBody = {
        policyId,
        newEffectiveDate: date,
        sysUserId: '389',
        coveragePeriodId
    };
    const response = await internalApi.post(PolicyEndpoints.BACKDATE_POLICY, backDatePolicyBody);
    if (!response || response.responseCode !== 200) {
        throw new Error('[api-backdate-policy-helper.backDatePolicyForDays] - Backdate policy request failed');
    }
}