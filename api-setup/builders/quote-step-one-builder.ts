import { getDaysAgoDate, getTomorrowDate, getYearsAgoDate } from '@utils/date-util';
import { logger } from '@utils/logger-util';
import { Customer, Payload, Pet } from '../interfaces/payloads/quote-step-one-interface';

export class QuoteStepOneBuilder {
    private payload: Payload;
    private pets: Pet[];
    private customer: Customer;

    constructor(randomValue: string) {
        this.payload = {
            marketChannelId: 1,
            effectiveOn: getTomorrowDate('API'),
            postalCode: "77433",
            partnerCode: "",
            pets: [
                {
                    petName: `Lucy${randomValue}`,
                    breedId: 251,
                    dob: getYearsAgoDate(3, 'API'),
                    genderId: 2,
                    weight: 13,
                    coverage: null,
                    salesForceId: null
                }
            ],
            customer: {
                customerId: "",
                firstName: `FN${randomValue}`,
                lastName: `LN${randomValue}`,
                address1: `${randomValue} Automation St`,
                address2: null,
                city: `AutomationCity`,
                postalCode: `77433`,
                phone: `123-456-7890`,
                email: `quote${randomValue}@yopmail.com`
            },
            discounts: null,
            customerSourceCode: null,
            customerSourceDetail: null
        };
        this.pets = [...this.payload.pets];
        this.customer = { ...this.payload.customer };
    }

    withPayload(overrides: Partial<Omit<Payload, 'pets' | 'customer'>>) {
        this.payload = { ...this.payload, ...overrides };
        return this;
    }

    /**
     * @param petNumber - 1-based index of the pet to update in json payload.
     * @param petOverrides - Partial pet object to override default values.
     * @throws If petNumber < 1.
     */
    withPet(petNumber: number, petOverrides?: Partial<Pet>) {
        logger.info(`[QuoteStepOneBuilder.withPet] - Adding/updating pet number ${petNumber} with overrides: ${JSON.stringify(petOverrides)}`);
        if (petNumber < 1) {
            throw new Error(`Pet number must be 1 or greater, got ${petNumber}`);
        }

        const basePet = { ...this.pets[0] };

        if (petOverrides?.dob !== undefined && typeof petOverrides.dob === 'number') {
            if (petOverrides.dob === 0) {
                petOverrides.dob = getDaysAgoDate(60, 'API');
                logger.info(`[QuoteStepOneBuilder.withPet] - Pet age is 0, setting dob to 60 days ago: ${petOverrides.dob}`);
            } else {
                petOverrides.dob = getYearsAgoDate(petOverrides.dob, 'API');
                logger.info(`[QuoteStepOneBuilder.withPet] - Updating dob for pet number ${petNumber} to ${petOverrides.dob}`);
            }
        }

        if (petNumber === 1) {
            this.pets[0] = { ...basePet, ...petOverrides };
        } else {
            if (!petOverrides?.petName) {
                petOverrides!.petName = `${basePet.petName}_${petNumber}`;
            }
            const newPet: Pet = {
                ...basePet,
                ...petOverrides
            };
            this.pets.push(newPet);
        }
        return this;
    }

    withCustomer(customerOverrides: Partial<Customer>) {
        this.customer = {
            ...this.customer,
            ...customerOverrides
        };
        return this;
    }

    build(): Payload {
        logger.info(`[QuoteStepOneBuilder.build] - Building payload with ${this.pets.length} pets and customer: ${JSON.stringify(this.customer)}`);
        return {
            ...this.payload,
            pets: this.pets,
            customer: this.customer
        };
    }

    static create(randomValue: string) {
        return new QuoteStepOneBuilder(randomValue);
    }
}
