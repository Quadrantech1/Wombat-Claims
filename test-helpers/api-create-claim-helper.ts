import { ClaimSubmitBuilder } from '@api-setup/builders/claim-submit-builder';
import { InternalApiClient } from '@api-setup/client/internal-api-client';
import { AttachmentEndpoints, ClaimEndpoints } from '@api-setup/endpoints';
import { CreateClaimTestParams } from '@api-setup/interfaces/api-tests/create-claim-interface';
import path from 'path';

/**
 * Uploads the standard example attachment and returns the access token from the attachment API.
 */
async function uploadExampleAttachment(internalApi: InternalApiClient): Promise<string> {
    const filePath = path.resolve(process.cwd(), 'test-files/examplePetPartners.docx');
    const attachmentFileResponse = await internalApi.postDocument(AttachmentEndpoints.POST_CLAIM, filePath);
    if (!attachmentFileResponse || !attachmentFileResponse.data) {
        throw new Error('[api-create-claim-helper.uploadExampleAttachment] - Attachment upload failed: no response data');
    }
    return attachmentFileResponse.data.response;
}

/**
 * Create an individual claim using provided identifiers.
 * @param internalApi Internal API client to use for uploading & submitting.
 * @param params Object containing policyId, petId and petName.
 * @returns claim submit response
 */
export async function createIndividualClaim(
    internalApi: InternalApiClient,
    params: { policyId: string; petId: string; petName: string }
) {
    if (!params || !params.policyId || !params.petId || !params.petName) {
        throw new Error('[api-create-claim-helper.createIndividualClaim] - policyId, petId and petName are required');
    }

    const accessToken = await uploadExampleAttachment(internalApi);

    const claimTestParams: CreateClaimTestParams = {
        policyId: params.policyId,
        tempAttachmentFilePath: accessToken,
        petId: params.petId,
        petName: params.petName
    };

    const claimPayload = ClaimSubmitBuilder.create(claimTestParams).build();
    const response = await internalApi.post(ClaimEndpoints.CLAIM_SUBMIT, claimPayload);
    if (!response || !response.data || !response.data.claimId) {
        throw new Error('[api-create-claim-helper.createIndividualClaim] - Claim submission failed or claimId missing');
    }
    return { response, claimId: String(response.data.claimId) };
}

/**
 * Create a group claim using provided identifiers. policyId may be null for group claims.
 * @param internalApi Internal API client to use for uploading & submitting.
 * @param params Object containing policyId|null, petId, petName and optional employeeGeneratedNumber.
 * @returns claim submit response
 */
export async function createGroupClaim(
    internalApi: InternalApiClient,
    params: { petId: string; petName: string; employeeGeneratedNumber?: string }
) {
    if (!params || !params.petId || !params.petName) {
        throw new Error('[api-create-claim-helper.createGroupClaim] - petId and petName are required');
    }

    const accessToken = await uploadExampleAttachment(internalApi);

    const claimPayload = ClaimSubmitBuilder.create({
        policyId: null,
        tempAttachmentFilePath: accessToken,
        petId: params.petId,
        petName: params.petName,
        employeeGeneratedNumber: params.employeeGeneratedNumber
    }).build();

    const response = await internalApi.post(ClaimEndpoints.CLAIM_SUBMIT, claimPayload);
    if (!response || !response.data || !response.data.claimId) {
        throw new Error('[api-create-claim-helper.createGroupClaim] - Claim submission failed or claimId missing');
    }
    return { response, claimId: String(response.data.claimId) };
}