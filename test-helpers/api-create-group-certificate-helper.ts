import { BenAdminEnrollmentBuilder } from '@api-setup/builders/benadmin-enrollment-builder';
import { GroupEnrollmentBuilder } from '@api-setup/builders/group-enrollment-builder';
import { InternalApiClient } from '@api-setup/client/internal-api-client';
import { PolicyEndpoints } from '@api-setup/endpoints/policy-endpoints';

export async function createGroupCertificateApi(
    internalApi: InternalApiClient,
    randomValue: string,
    overrides?: { employerGeneratedNumber?: string; employeeGeneratedNumber?: string; emailAddress?: string; petCertificateNumber?: string; masterPolicyNumber?: string, petName?: string }
) {
    const employerGeneratedNumber = overrides?.employerGeneratedNumber || `EMP-${randomValue}`;
    const employeeGeneratedNumber = overrides?.employeeGeneratedNumber || `EMP-${randomValue}`;
    const petCertificateNumber = overrides?.petCertificateNumber || `PET-${randomValue}`;
    const masterPolicyNumber = overrides?.masterPolicyNumber || `MASTER-${randomValue}`;
    const petName = overrides?.petName || `Fluffy_${randomValue}`;

    const email = overrides?.emailAddress || `group_${randomValue}@yopmail.com`;

    const builder = GroupEnrollmentBuilder.create(randomValue)
        .withPayload({ employerGeneratedNumber, masterPolicyNumber })
        .withEmployee(1, { employeeGeneratedNumber, emailAddress: email })
        .withPet(1, 1, { petCertificateNumber });

    const payload = builder.build();
    const response = await internalApi.post(PolicyEndpoints.CREATE_ENROLLMENT, payload);
    if (!response || response.responseCode !== 200) {
        throw new Error('[api-create-group-certificate-helper.createGroupCertificateApi] - Enrollment request failed');
    }
    const certificateNumber = response.data?.success[0]?.certificateNumber;
    return { response, certificateNumber, employerGeneratedNumber, employeeGeneratedNumber, petCertificateNumber, masterPolicyNumber, petName };
}

export async function createBenAdminCertificateApi(
    internalApi: InternalApiClient,
    randomValue: string,
    overrides?: { employerGeneratedNumber?: string; employeeGeneratedNumber?: string; emailAddress?: string; petCertificateNumber?: string; masterPolicyNumber?: string, petName?: string }
) {
    const employerGeneratedNumber = overrides?.employerGeneratedNumber || `EMP-${randomValue}`;
    const employeeGeneratedNumber = overrides?.employeeGeneratedNumber || `EMP-${randomValue}`;
    const petCertificateNumber = overrides?.petCertificateNumber || `PET-${randomValue}`;
    const masterPolicyNumber = overrides?.masterPolicyNumber || `MASTER-${randomValue}`;
    const petName = overrides?.petName || `Fluffy_${randomValue}`;

    const email = overrides?.emailAddress || `benadmin_${randomValue}@yopmail.com`;

    const builder = BenAdminEnrollmentBuilder.create(randomValue)
        .withPayload({ employerGeneratedNumber })
        .withEmployee(1, { employeeGeneratedNumber, emailAddress: email })
        .withPet(1, 1, { petCertificateNumber });

    const payload = builder.build();
    const response = await internalApi.post(PolicyEndpoints.CREATE_BEN_ADMIN_ENROLLMENT, payload);
    if (!response || response.responseCode !== 200) {
        throw new Error('[api-create-group-certificate-helper.createBenAdminCertificateApi] - BenAdmin enrollment request failed');
    }
    const certificateNumber = response.data?.success[0]?.certificateNumber;
    return { response, certificateNumber, employerGeneratedNumber, employeeGeneratedNumber, petCertificateNumber, masterPolicyNumber, petName };
}