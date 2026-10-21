import { faker } from '@faker-js/faker';
import { BrandFullName } from '@utils/brand-util';

export interface PartnerDetailOverview {
    partnerName: string;
    partnerCode: string;
    defaultAffinityGroup: string;
    partnerType: string;
    npn: string;
    designatedPhone: string;
    marketChannel: string;
}

export const getDefaultPartnerDetailOverview = (): PartnerDetailOverview => {
    const randomCode = faker.string.alphanumeric(4).toUpperCase();
    return {
        partnerName: `Partner_${randomCode}`,
        partnerCode: randomCode,
        defaultAffinityGroup: 'AKC Pet Insurance',
        marketChannel: BrandFullName.AKC,
        partnerType: 'Website',
        npn: faker.string.numeric(5),
        designatedPhone: '1-234-567-8999'
    };
};
