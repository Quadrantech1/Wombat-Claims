import { Distributor, GroupEmployee, GroupPet, Payload } from '@api-setup/interfaces/payloads/group-enrollment-interface';
import { getDaysAgoDate, getYearsFromNow } from "@utils/date-util";
import { logger } from "@utils/logger-util";
import { getRandomValue } from '@utils/random-values-util';

export class GroupEnrollmentBuilder {
    private payload: Payload;
    private distributor: Distributor;
    private employees: GroupEmployee[];
    private readonly defaultEmployeeTemplate: Omit<GroupEmployee, 'pets'>;
    private readonly defaultPetTemplate: GroupPet;

    constructor(randomValue: string) {
        this.payload = {
            masterPolicyNumber: `GPPI-${randomValue}`,
            masterPolicyStatus: 'ACTIVE',
            initialEnrolmentWaitingPeriod: 10,
            employerName: `${randomValue} Name` + ', Inc.',
            employerGeneratedNumber: `EMP-${randomValue}`,
            situsState: 'TX',
            masterPolicyEffectiveDate: getDaysAgoDate(30, 'API'),
            masterPolicyTermDate: null,
            masterPolicyRenewalDate: getYearsFromNow(1, 'API'),
            address1: '123 South St',
            address2: '100 Distributer Way ',
            city: 'Atlanta',
            state: 'CT',
            zip: '77433',
            groupContactPhoneNumber: '(123)456-7899',
            agencyCode: 'Gerhart, Hartman & R',
            distributor: {
                name: 'Cigna Group',
                address1: '100 Distributer Way',
                Address2: '100 Distributer Way',
                city: 'Charlotte',
                state: 'NC',
                postalCode: '28277',
            },
            employees: [
                {
                    employeeGeneratedNumber: `EMP-${randomValue}`,
                    employeeStatus: 'ACTIVE',
                    eligibleClass: 'allEmployees',
                    lastName: `${randomValue}LN`,
                    firstName: `${randomValue}FN`,
                    middleName: `${randomValue}MN`,
                    streetNumber: '1567',
                    address1: '1567 Tatooine watch ct',
                    address2: '100 Distributer Way',
                    address2type: 'APT',
                    city: 'Addison',
                    state: 'TX',
                    zip: '77433',
                    phoneNumber: '(505) 455-1234',
                    emailAddress: `${randomValue}@yopmail.com`,
                    preferredEmail: undefined,
                    electronicConsent: true,
                    sendNotification: true,
                    enrollmentType: 'ENROLLMENT',
                    enrollmentTypeId: null,
                    coverageStartDate: getDaysAgoDate(30, 'API'),
                    coverageEndDate: getYearsFromNow(1, 'API'),
                    pets: [
                        {
                            petCertificateNumber: `PET-${randomValue}`,
                            petStatus: 'ACTIVE',
                            certificateEffectiveDate: getDaysAgoDate(30, 'API'),
                            certificateTerminationDate: null,
                            petName: 'python',
                            species: 'Dog',
                            breed: 'Affenpinscher',
                            age: 1,
                            adultWeight: 28,
                            planName: 'accident and illness',
                            planType: '2',
                            premium: 25.38,
                            preExistingConditionLimit: 12,
                            injuriesWaitingPeriod: 0,
                            illnessesWaitingPeriod: 0,
                            orthopedicWaitingPeriod: 6,
                            annualPolicyLimit: 2000,
                            annualDeductible: 250,
                            diminishingDeductible: 50,
                            coinsurance: 90,
                            perIncidentCopay: 25,
                            rehabPhysicalTherapy: true,
                            priorCoverageCredit: true,
                            officeExamsTelehealthConsult: true,
                            petOwnersAssistance: true,
                            alternativeCare: true,
                            alternativeBehavioralCare: true,
                            routineDental: 350,
                            finalRespects: 350,
                            inheritedCongenital: false,
                            wellness: 'B',
                            enrollmentType: 'ENROLLMENT',
                        },
                    ],
                },
            ],
        };
        this.distributor = { ...this.payload.distributor };
        this.employees = [...this.payload.employees];
        const { pets: seedPets, ...seedEmployeeRest } = this.payload.employees[0];
        this.defaultEmployeeTemplate = { ...seedEmployeeRest };
        this.defaultPetTemplate = { ...seedPets[0] };
    }

    /**
     * Shallow merge provided fields into the root payload (except nested arrays/objects).
     */
    withPayload(overrides?: Partial<Omit<Payload, 'distributor' | 'employees'>>): this {
        this.payload = { ...this.payload, ...overrides };
        return this;
    }

    /**
     * Shallow merge provided fields into the distributor object.
     */
    withDistributor(overrides?: Partial<Distributor>): this {
        this.distributor = { ...this.distributor, ...overrides };
        return this;
    }

    /**
     * Shallow merge provided fields into the specified employee (1-based index).
     * Adds a new employee if index is greater than current length.
     * New employees start with an empty pets array unless pets are provided in overrides.
     */
    withEmployee(employeeNumber: number, overrides?: Partial<Omit<GroupEmployee, 'pets'>>): this {
        if (employeeNumber < 1) {
            throw new Error(`Employee number must be 1 or greater, got ${employeeNumber}`);
        }
        const existingEmployee = this.employees[employeeNumber - 1];
        if (existingEmployee) {
            this.employees[employeeNumber - 1] = { ...existingEmployee, ...overrides };
        } else {
            // Always create new employee with a single default pet, ignore overrides.pets
            const defaultPet = { ...this.defaultPetTemplate, petCertificateNumber: `${getRandomValue()}` };
            // Ensure unique employeeGeneratedNumber for new employee if not provided
            const uniqueEmployeeNumber = overrides?.employeeGeneratedNumber || `EMP-${getRandomValue()}`;
            const newEmployee: GroupEmployee = {
                ...this.defaultEmployeeTemplate,
                ...overrides,
                employeeGeneratedNumber: uniqueEmployeeNumber,
                // Ensure Group defaults for enrollment fields
                pets: [defaultPet]
            };
            this.employees.push(newEmployee);
        }
        return this;
    }

    /**
     * Shallow merge provided fields into the specified pet for a given employee (1-based indices).
     * Adds a new pet if index is greater than current length.
     */
    withPet(employeeNumber: number, petNumber: number, overrides?: Partial<GroupPet>): this {
        if (employeeNumber < 1) {
            throw new Error(`Employee number must be 1 or greater, got ${employeeNumber}`);
        }
        const employee = this.employees[employeeNumber - 1];
        if (!employee) {
            throw new Error(`Employee at index ${employeeNumber} does not exist.`);
        }
        if (petNumber < 1) {
            throw new Error(`Pet number must be 1 or greater, got ${petNumber}`);
        }
        const existingPet = employee.pets[petNumber - 1];
        if (existingPet) {
            employee.pets[petNumber - 1] = { ...existingPet, ...overrides, petCertificateNumber: overrides && overrides.petCertificateNumber ? overrides.petCertificateNumber : `${getRandomValue()}` };
        } else {
            const newPet: GroupPet = { ...this.defaultPetTemplate, ...overrides, petCertificateNumber: overrides && overrides.petCertificateNumber ? overrides.petCertificateNumber : `${getRandomValue()}` };
            employee.pets.push(newPet);
        }
        return this;
    }

    build(): Payload {
        logger.info(`[GroupEnrollmentBuilder.build] - Building payload with ${this.employees.length} employees`);
        return {
            ...this.payload,
            distributor: { ...this.distributor },
            employees: this.employees.map(e => ({ ...e, pets: [...e.pets] })),
        };
    }

    static create(randomValue: string) {
        return new GroupEnrollmentBuilder(randomValue);
    }
}
