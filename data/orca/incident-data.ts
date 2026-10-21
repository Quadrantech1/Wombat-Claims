import { getDateWithSpecificFormat } from "@utils/date-util";

export interface IncidentData {
    onSetDate?: string;
    incidentType?: string;
    incidentTypeInitial?: string;
    incidentClass?: string;
    openDiagnosis?: string;
    denialCodeInitial?: string;
    denialCode?: string;
    details?: string;
    dateOfEligibility?: string;
}

export const getDefaultIncidentData = (): IncidentData => {
    return {
        onSetDate: getDateWithSpecificFormat(0),
        incidentType: '170 - Staph Infection',
        incidentTypeInitial: '170'
    };
};