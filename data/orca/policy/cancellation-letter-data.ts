import { CancelReason } from '@pages/orca/common-enums/cancel-policy-enum';

export const cancellationLetterTextByReason: Record<CancelReason, string> = {
    [CancelReason.NonPayment]: 'Since we have not received payment by the payment due date, your policy was cancelled due to non-payment effective back to when your premiums were pre-paid',
    [CancelReason.CertificateExpiration]: 'Thank you for reaching out to us at AKC Pet Insurance, though we are sorry to see you go.',
    [CancelReason.ClickToCancel]: 'Thank you for reaching out to us at AKC Pet Insurance, though we are sorry to see you go.',
    [CancelReason.DeathOfPet]: 'We at AKC Pet Insurance want to extend our deepest sympathies for the loss of your beloved pet',
    [CancelReason.Administrative]: 'Thank you for reaching out to us at AKC Pet Insurance to make adjustments to your pet insurance coverage.',
    [CancelReason.Duplicate]: 'Thank you for reaching out to us at AKC Pet Insurance to make adjustments to your pet insurance coverage.',
    [CancelReason.Fraud]: 'Thank you for reaching out to us at AKC Pet Insurance to make adjustments to your pet insurance coverage.',
};
