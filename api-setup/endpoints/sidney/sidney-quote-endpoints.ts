export const SidneyEndpoints = {
    // Quote Core
    CREATE_QUOTE: '/api/q/quotes',
    GET_QUOTE: (quoteId: string) => `/api/q/quotes/${quoteId}`,
    UPDATE_QUOTE: (quoteId: string) => `/api/q/quotes/${quoteId}`,
    FINALIZE: (quoteId: string, isSales: boolean = false) => `/api/q/quotes/${quoteId}/finalizeV2?isSales=${isSales}`,

    // Pet Coverage
    GET_PET_OPTIONS: (quoteId: string, petId: string) => `/api/q/quotes/${quoteId}/pets/${petId}/options`,
    SELECT_POLICY: (quoteId: string, petId: string) => `/api/q/quotes/${quoteId}/pets/${petId}/policy`,

    // Lookups
    VALIDATE_ZIP: (zipcode: string) => `/api/q/values/Zipcode/${zipcode}`,
    GET_BREEDS: (species: 'Dog' | 'Cat', stateCode: string) => `/api/q/values/breeds/${species}?stateCode=${stateCode}&species=${species}&stateCode=${stateCode}`,
    CHECK_EMAIL: (email: string, brand: string) => `/api/q/accounts/checkEmail/${email}/${brand}`,
    GET_MARKETING_CODES: (brand: string) => `/api/q/values/marketingCodes/${brand}`,
    GET_STATES: '/api/q/values/states',
} as const;
