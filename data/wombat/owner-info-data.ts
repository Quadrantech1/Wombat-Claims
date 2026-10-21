import { faker } from "@faker-js/faker";

export interface OwnerInfoData {
    brand?: string;
    marketSource?: string;
    priorityCode?: string;
    firstName: string;
    lastName?: string;
    street1?: string;
    street2?: string;
    zip?: string;
    state?: string;
    city?: string;
    primaryPhone?: string;
    phoneUse?: string;
    email?: string;
    effectiveDate?: string;
    preferredLanguage?: string;
    payrollDeduction?: boolean;
}

export const getDefaultOwnerInfoData = (): OwnerInfoData => {
    return {
        brand: "APHI",
        marketSource: 'Animal Shelter',
        firstName: "test" + faker.person.firstName(),
        lastName: "test" + faker.person.lastName(),
        payrollDeduction: false
    };
}

