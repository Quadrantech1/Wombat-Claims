export enum CancelReason {
    NonPayment = '11 - Non-Payment',
    Administrative = '13 - Administrative',
    CertificateExpiration = 'Certificate Expiration',
    ClickToCancel = 'Click-to-Cancel',
    DeathOfPet = 'Death of Pet',
    Duplicate = 'Duplicate',
    Fraud = 'Fraud'
}

export enum CancelType {
    Flat = 'Flat',
    ProRata = 'Pro-Rata',
    ShortRate = 'Short Rate'
}

export enum CancelSource {
    Call = 'Call',
    Chat = 'Chat',
    Email = 'Email',
    PetCloud = 'Pet Cloud',
    CustomerPortal = 'Customer Portal'
} 