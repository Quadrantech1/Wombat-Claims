import * as path from 'path';

export interface ClaimData {
    petName?: string;
    policyId?: string;
    hasAdditionalInsurance?: boolean;
    claimType?: 'injury-illness' | 'wellness';
    tellUsAboutClaim?: string;
    signDate?: string;
    treatmentDate?: string;
    uploadFilePath?: string;
    agreeToTerms?: boolean;
}


export const getDefaultClaimData = (): ClaimData => {
    return {
        petName: 'Buddy',
        policyId: 'auto-select',
        hasAdditionalInsurance: false,
        claimType: 'injury-illness',
        tellUsAboutClaim: 'Pet injured during play time.',
        signDate: new Date().toISOString().split('T')[0],
        treatmentDate: new Date().toISOString().split('T')[0],
        uploadFilePath: path.join(process.cwd(), 'test-files','examplePetPartners.docx'),
        agreeToTerms: true
    };
}
