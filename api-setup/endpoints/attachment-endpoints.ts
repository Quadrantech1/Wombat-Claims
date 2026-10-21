export const AttachmentEndpoints = {
    // Attachment Operations
    GET_BY_ID: (attachmentId: string) => `/attachment/v1/${attachmentId}`,
    GET_BY_POLICY_ID: (policyId: string) => `/attachment/v1/policy/${policyId}`,
    GET_BY_CLAIM_ID: (claimId: string) => `/attachment/v1/claim/${claimId}`,
    POST_CLAIM: '/attachment/v1/claim',
    GET_BY_POLICYTERM_ID: (policyTermId: string) => `/attachment/v1/policyterm/${policyTermId}`,
} as const;
