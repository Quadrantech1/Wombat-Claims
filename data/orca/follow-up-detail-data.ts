export interface FollowUpDetailData {
    assignedTo: string;
    followUpType: string;
    complaintType: string;
    receivedOn?: string;
    followUpBy?: string;
    closedOn?: string;
    summary: string;
    resolution: string;
}

export const getDefaultFollowUpDetailData = (): FollowUpDetailData => {
    return {
        assignedTo: 'random',
        followUpType: 'Followup',
        complaintType: 'Coverage - Other',
        summary: 'Automation',
        resolution: 'Automation'
    };
};
