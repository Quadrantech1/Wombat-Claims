import { getRandomValue } from '@utils/random-values-util';

export interface AffiliateDetails {
    affiliateName: string;
    receivablesName: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    leadFeeTier: string;
}

export const getDefaultAffiliateDetails = (): AffiliateDetails => {
    const randomValue = getRandomValue();
    return {
        affiliateName: randomValue,
        receivablesName: `${randomValue}1 name`,
        address1: `${randomValue}1 address`,
        city: randomValue,
        state: 'Texas',
        postalCode: '77433',
        leadFeeTier: 'None'
    };
};
