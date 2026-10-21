import { getTodayDate } from '@utils/date-util';
import { CreateClaimTestParams } from '../interfaces/api-tests/create-claim-interface';
import { ClaimSubmit, Diagnosis, DiagnosisDetail } from '../interfaces/payloads/claim-submit-interface';

export class ClaimSubmitBuilder {
    private payload: ClaimSubmit;
    private diagnoses: Diagnosis[];

    constructor(
        claimPayload: CreateClaimTestParams
    ) {
        this.payload = {
            customer: null,
            policyId: claimPayload.policyId ?? null,
            claimId: 0,
            employeeGeneratedNumber: claimPayload.employeeGeneratedNumber ?? "Test Document",
            tempAttachmentFilePath: claimPayload.tempAttachmentFilePath,
            diagnoses: [
                {
                    additionalInsurance: "false",
                    additionalInsuranceCompanyName: "",
                    petId: claimPayload.petId,
                    petName: claimPayload.petName,
                    petSelected: true,
                    diagnoses: [
                        {
                            diagnosis: "cde",
                            onsetDate: getTodayDate('API'),
                            treatmentStartDate: getTodayDate('API')
                        }
                    ],
                }
            ]
        };
        this.diagnoses = [...this.payload.diagnoses];
    }

    /**
     * Merge provided fields into the root payload (except diagnoses).
     */
    withPayload(overrides?: Partial<Omit<ClaimSubmit, 'diagnoses'>>) {
        this.payload = { ...this.payload, ...overrides };
        return this;
    }

    /**
  * Set or override a diagnosis object at a specific index in the diagnoses array.
  * @param index - Index in the diagnoses array (0-based).
  * @param overrides - Partial<Diagnosis> to override.
  */
    withDiagnosesPayload(index: number, overrides?: Partial<Diagnosis>) {
        const baseArray = this.diagnoses.length > 0 ? this.diagnoses : this.payload.diagnoses;
        // Shallow copy the base diagnosis and apply overrides
        const newDiagnosis = { ...baseArray[index], ...overrides };
        // Ensure the diagnoses array is long enough
        if (this.diagnoses.length <= index) {
            this.diagnoses = [...baseArray];
        }
        this.diagnoses[index] = newDiagnosis;
        return this;
    }

    // I am making this method private because none of our code uses diagnoses details array at all at the moment.
    /**
     * Set or override a diagnosis detail at a specific index in the diagnoses[n].diagnoses array.
     * @param diagnosisIndex - Index in the diagnoses array (0-based).
     * @param detailIndex - Index in the diagnoses[n].diagnoses array (0-based).
     * @param overrides - Partial<DiagnosisDetail> to override.
     */
    private withDiagnosesDetail(diagnosisIndex: number, detailIndex: number, overrides?: Partial<DiagnosisDetail>) {
        if (!this.diagnoses[diagnosisIndex] || !this.diagnoses[diagnosisIndex].diagnoses[detailIndex]) {
            throw new Error(`[ClaimSubmitBuilder.withDiagnosesDetail] - No base diagnosis detail found at diagnosisIndex ${diagnosisIndex}, detailIndex ${detailIndex}`);
        }
        const baseDetail = this.diagnoses[diagnosisIndex].diagnoses[detailIndex];
        this.diagnoses[diagnosisIndex].diagnoses[detailIndex] = { ...baseDetail, ...overrides };
        return this;
    }

    /**
     * Shallow copy all top-level properties and arrays.
     */
    build(): ClaimSubmit {
        return {
            ...this.payload,
            diagnoses: [...this.diagnoses]
        };
    }

    static create(
        claimPayload: CreateClaimTestParams
    ) {
        return new ClaimSubmitBuilder(claimPayload);
    }
}
