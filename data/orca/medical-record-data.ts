export interface MedicalRecordData {
    requestTypeDropdown: string;
    pet: string | undefined;
    vet: string | undefined;
    requestSearch: string;
}

export const getDefaultMedicalRecord = (): MedicalRecordData => {
    return {
        requestTypeDropdown: 'Medical Records',
        pet: undefined,
        vet: undefined,
        requestSearch: 'All MRs'
    };
};
