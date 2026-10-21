import { Brand } from "@utils/brand-util";

export interface CreateMcleadTestParams {
    registrationNumber: string;
    marketChannelName: Brand;
    petName: string;
    email: string;
    zipCode: string;
    petType: number;
    breed: string;
    petAge: number | string; // accepts both API date("2025-08-02") string or age as number (1)
    storeIdentifier?: string;
    storeName?: string;
}
