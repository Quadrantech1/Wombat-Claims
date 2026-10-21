export const PolicyEndpoints = {
    // Customer Policies
    GET_CUSTOMER_POLICIES: (customerId: string) => `/policy/v1/customer/${customerId}`,

    // Group Enrollment
    CREATE_ENROLLMENT: '/policy/v1/group/enroll',
    CREATE_BEN_ADMIN_ENROLLMENT: '/policy/v1/group/benadmin-enroll',
    INACTIVE_PET_ENROLLMENT: '/policy/v1/group/enroll',

    // Status Updates
    UPDATE_BEN_ADMIN_STATUS: '/policy/v1/group/benadmin-employee-status',
    RENEW_WITHOUT_DEMOGRAPHICS: '/policy/v1/group/benadmin-renewal-withoutdemographics',
    BACKDATE_POLICY: '/policy/v1/backdate-policy',
} as const;
