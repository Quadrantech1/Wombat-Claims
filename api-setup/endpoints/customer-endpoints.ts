export const CustomerEndpoints = {
    // Authentication
    LOGIN: '/customer/account/login',
    REGISTER: '/customer/account/register-user',
    
    // Customer Management
    UPDATE: '/customer/v1/customer/update',
    GET_BY_ID: (customerId: string) => `/customer/v1/customer/${customerId}`,
    GET_BY_EMAIL: (email: string) => `/customer/v1/Customer/email/${email}`,
} as const;
