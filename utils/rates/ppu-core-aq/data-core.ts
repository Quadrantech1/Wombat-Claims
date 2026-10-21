export interface DataCore {
    isDog: boolean;
    basePremium: string;
    coinsurance: string;
    level: string;
    breed: string;
    productBreakdown: string;
    age: string;
    zipcode: string;

}

export const getDefaultDataCore = (): DataCore => {
    return {
        isDog: true,
        basePremium: 'accident',
        coinsurance: '10%',
        level: 'level1',
        productBreakdown: 'A&I More & $3000 Limit',
        breed: 'Crossbreed',
        age: '5',
        zipcode: 'K0A'
    };
};