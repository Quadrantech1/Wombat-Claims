import { getYearsAgoDate, getYesterdayDate } from '@utils/date-util';
import { McleadRegistration, Owner, Address } from '../interfaces/payloads/mclead-registration-interface';
import { faker } from '@faker-js/faker';

/**
 * Builder for McleadRegistration payload
 */
export class McleadRegistrationBuilder {
    private payload: McleadRegistration;
    private owners: Owner[];

    constructor(randomValue: string) {
        this.payload = {
            marketChannelId: 2,
            ppiCertificateId: '',
            registrationNumber: `Auto${randomValue}`,
            name: `Lucy${randomValue}`,
            sex: 'F',
            breedId: 256,
            bvgCode: '812',
            breedDescription: 'American Curl',
            whelpDate: getYearsAgoDate(3, 'API'),
            color: '007',
            registrationDate: getYesterdayDate('API'),
            certificateIssueDate: null,
            sireRegistrationNumber: '',
            damRegistrationNumber: '',
            limited: 'Y',
            documentType: 'WEBREG',
            dogOwnerIsLitterOwner: 'N',
            storeIdentifier: '',
            storeName: '',
            owners: [
                {
                    firstName: `FN${randomValue}`,
                    middleName: null,
                    lastName: `LN${randomValue}`,
                    address: {
                        line1: `${randomValue} Mclead Street`,
                        line2: null,
                        city: `New York City`,
                        state: 'TX',
                        zip: `77433`
                    },
                    email: `mclead${randomValue}@yopmail.com`,
                    phone: `112${faker.number.int({ min: 1000000, max: 9999999 })}`,
                    spamOk: `Yes`,
                    customerNumber: null
                }
            ],
            soldDate: null
        };
        // Maintain separate state for nested arrays
        this.owners = [...this.payload.owners];
    }

    /**
     * Merge provided fields into the payload (except owners).
     */
    withPayload(overrides?: Partial<Omit<McleadRegistration, 'owners'>>): this {
        if (overrides?.whelpDate && typeof overrides.whelpDate === 'number') {
            overrides.whelpDate = getYearsAgoDate(overrides.whelpDate, 'API');
        }
        this.payload = { ...this.payload, ...overrides };
        return this;
    }

    /**
    * Update or add an owner in the payload.
    * @param ownerNumber - 1-based index of the owner to update in the payload.
    * @param ownerOverrides - Partial owner object to override default values.
    * @throws If ownerNumber < 1 or skips an index.
    */
    withOwner(ownerNumber: number, ownerOverrides?: Partial<Owner>): this {
        if (ownerNumber < 1) {
            throw new Error('[McleadRegistrationBuilder.withOwner] - Owner number must be 1 or greater, got ' + ownerNumber);
        }

        const baseOwner = { ...this.owners[0] };
        if (ownerNumber <= this.owners.length) {
            // Update existing owner
            this.owners[ownerNumber - 1] = { ...baseOwner, ...ownerOverrides };
        } else if (ownerNumber === this.owners.length + 1) {
            // Add new owner at the end
            if (!ownerOverrides?.firstName || !ownerOverrides?.lastName) {
                throw new Error('[McleadRegistrationBuilder.withOwner] - firstName and lastName are required when adding a new owner');
            }
            const newOwner: Owner = { ...baseOwner, ...ownerOverrides };
            this.owners.push(newOwner);
        }
        return this;
    }

    /**
    * Update the address for a specific owner.
    * @param ownerNumber - 1-based index of the owner.
    * @param addressOverrides - Partial address object to override.
    * @throws If ownerNumber is invalid.
    */
    withAddressForOwner(ownerNumber: number, addressOverrides: Partial<Address>): this {
        if (ownerNumber < 1 || ownerNumber > this.owners.length) {
            throw new Error('[McleadRegistrationBuilder.withAddressForOwner] - Invalid owner number: ' + ownerNumber);
        }
        const owner = this.owners[ownerNumber - 1];
        owner.address = {
            ...owner.address,
            ...addressOverrides
        };
        return this;
    }

    build(): McleadRegistration {
        return {
            ...this.payload,
            owners: this.owners
        };
    }

    static create(randomValue: string): McleadRegistrationBuilder {
        return new McleadRegistrationBuilder(randomValue);
    }
}
