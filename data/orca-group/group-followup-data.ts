import { getTodayDate } from '@utils/date-util';

export interface GroupFollowupData {
    assignedTo?: string;
    followUpType?: string;
    complaintType?: string;
    receivedOn?: string;
    followUpBy?: string;
    closedOn?: string;
    summary?: string;
    resolution?: string;
}

export const getDefaultGroupFollowupData = (): GroupFollowupData => ({
    assignedTo: 'random',
    followUpType: 'Followup',
    complaintType: 'Coverage - Other',
    receivedOn: getTodayDate("ORCA"),
    followUpBy: getTodayDate("ORCA"),
    closedOn: getTodayDate("ORCA"),
    summary: 'Automation',
    resolution: 'Automation',
});
