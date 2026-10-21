export const PetEndpoints = {
    SEND_REGISTRATION: '/pet/v1/send-registration',
    GET_PET_BY_POLICY_ID: (policyId: string) => `/pet/v1/policy/${policyId}`,
} as const;
