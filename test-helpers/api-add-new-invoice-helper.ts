import { InternalApiClient } from "@api-setup/client/internal-api-client";
import { financeEndpoints } from "@api-setup/endpoints/finance-endpoints";
import { getTodayDate } from "@utils/date-util";

/**
 * Add a new invoice for a coverage period by calling the internal API.
 *
 * @param internalApi - An authenticated InternalApiClient instance used to send the request
 * @param coveragePeriodId - The numeric coverage period identifier
 * @param amount - The invoice amount (can be positive or negative)
 * @param description - Optional description for the invoice (defaults to 'Test Invoice')
 * @throws {Error} When the internal API response is missing or indicates failure
 */
export async function addInvoice(
    internalApi: InternalApiClient,
    coveragePeriodId: number | string,
    amount: number,
    description: string = 'Test Invoice'
): Promise<void> {
    const today = getTodayDate('API');

    const invoiceBody = {
        CoveragePeriodId: coveragePeriodId,
        SysuserId: 8,
        Description: description,
        InvoiceLines: [
            {
                CoverageStateFilingProductId: null,
                InvoiceItemTypeId: 1,
                ItemDescription: description,
                Quantity: 1,
                Amount: amount,
                CreatedOn: today
            }
        ]
    };

    const response = await internalApi.post(financeEndpoints.ADD_INVOICE, invoiceBody);

    if (!response || response.responseCode !== 200) {
        throw new Error('[api-add-new-invoice-helper.addInvoice] - Add invoice request failed');
    }
}
