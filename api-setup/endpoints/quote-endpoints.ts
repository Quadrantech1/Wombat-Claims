export const QuoteEndpoints = {
    // Core Quote Operations
    SAVE_QUOTE: '/quote/v1',
    CHECKOUT: '/quote/v1/checkout',
    GET_PRIVATE_ID: (quoteId: number) => `/quote/v1/private/${quoteId}`,
    
    // Quote Products
    GET_QUOTE_PRODUCTS_V1: (petId: number) => `/quote/v1/quote-pet/${petId}/products`,
    GET_QUOTE_PRODUCTS_V2: (petId: number) => `/quote/v2/quote-pet/${petId}/products`,
    GET_FULL_PRODUCTS: (petId: number) => `/quote/v1/quote-pet/${petId}/full-products`,

    // Lookup Services
    GET_BREEDS: (speciesId: number, stateCode: string) => `/quote/v1/breeds/${speciesId}/state/${stateCode}`, // 1 = dog, 2 = cat
    GET_LIMITS: (zipCode: string) => `/quote/v1/limits/${zipCode}`,
    GET_STATE_BY_ZIP: (zipCode: string) => `/quote/v1/postalcode/${zipCode}/state`,

    // State Filing
    GET_STATE_FILING: '/quote/v1/state-filing',
    GET_STATE_FILING_TRIAL: (stateCode: string) => `/quote/v1/statefiling/${stateCode}/trialproduct`,
    POST_PREVIEW_V1: (stateCode: string) => `/quote/v1/preview/${stateCode}`,
    POST_PREVIEW_V2: (stateCode: string) => `/quote/v2/preview/${stateCode}`,
    
    // External Integrations
    GET_AKC_LOOKUP: '/quote/v1/akc-lookup-registration',
} as const;
