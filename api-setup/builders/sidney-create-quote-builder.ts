import { getYearsAgoDate } from '@utils/date-util';
import { logger } from '@utils/logger-util';
import { SidneyBreed } from '../interfaces/payloads/sidney-common-interface';
import { SidneyCreatePet, SidneyCreateQuotePayload } from '../interfaces/payloads/sidney-create-quote-interface';

export class SidneyCreateQuoteBuilder {
    private payload: SidneyCreateQuotePayload;
    private pets: SidneyCreatePet[];

    constructor(randomValue: string) {
        this.payload = {
            emailAddress: `sidney${randomValue}@yopmail.com`,
            brand: 'APHI',
            ratingAddress: { zipcode: '60173' },
            pets: [
                {
                    name: `Navi${randomValue}`,
                    breed: {
                        species: 'Dog',
                        type: 'PureBreed',
                        name: 'Affenpinscher',
                        code: 'Dog~PureBreed~Affenpinscher',
                        maxAge: 18,
                        alias: { breedId: 118, alias: 'Affen' },
                        aliases: [
                            { breedId: 118, alias: 'Pincher' },
                            { breedId: 118, alias: 'Monkey Dog' },
                            { breedId: 118, alias: 'African Terrier' },
                            { breedId: 118, alias: 'Affie' },
                            { breedId: 118, alias: 'Affen' },
                            { breedId: 118, alias: 'Pinscher' },
                        ],
                    },
                    exclusions: [],
                    birthDate: getYearsAgoDate(3, 'API'),
                    gender: 'M',
                },
            ],
        };
        this.pets = [...this.payload.pets];
    }

    /**
     * Override top-level payload fields (excludes pets).
     * @param overrides Partial payload fields to override.
     */
    withPayload(overrides: Partial<Omit<SidneyCreateQuotePayload, 'pets'>>) {
        this.payload = { ...this.payload, ...overrides };
        return this;
    }

    /**
     * Find a breed by name from the GET_BREEDS response and set it on the specified pet.
     * @param breeds Breeds list returned from the GET_BREEDS API call.
     * @param breedName The breed name to select (case-insensitive).
     * @param petNumber 1-based index of the pet to apply the breed to (default: 1).
     */
    withBreed(breeds: SidneyBreed[], breedName: string, petNumber: number = 1) {
        const found = breeds.find((b) => b.name.toLowerCase() === breedName.toLowerCase());
        if (!found) {
            throw new Error(`[SidneyCreateQuoteBuilder.withBreed] - Breed '${breedName}' not found in breeds list`);
        }
        const index = petNumber - 1;
        if (!this.pets[index]) {
            throw new Error(`[SidneyCreateQuoteBuilder.withBreed] - Pet number ${petNumber} does not exist`);
        }
        this.pets[index] = { ...this.pets[index], breed: found };
        return this;
    }

    /**
     * Add or update a pet in the payload.
     * @param petNumber 1-based index. Use 1 to update the first pet; values > 1 append a new pet.
     * @param petOverrides Partial pet fields to override on the base pet.
     */
    withPet(petNumber: number, petOverrides?: Partial<SidneyCreatePet>) {
        logger.info(`[SidneyCreateQuoteBuilder.withPet] - Adding/updating pet number ${petNumber} with overrides: ${JSON.stringify(petOverrides)}`);
        if (petNumber < 1) {
            throw new Error(`[SidneyCreateQuoteBuilder.withPet] - Pet number must be 1 or greater, got ${petNumber}`);
        }
        const basePet = { ...this.pets[0] };
        if (petNumber === 1) {
            this.pets[0] = { ...basePet, ...petOverrides };
        } else {
            const newPet: SidneyCreatePet = {
                ...basePet,
                name: `${basePet.name}_${petNumber}`,
                ...petOverrides,
            };
            this.pets.push(newPet);
        }
        return this;
    }

    build(): SidneyCreateQuotePayload {
        logger.info(`[SidneyCreateQuoteBuilder.build] - Building create quote payload with ${this.pets.length} pet(s)`);
        return { ...this.payload, pets: this.pets };
    }

    static create(randomValue: string) {
        return new SidneyCreateQuoteBuilder(randomValue);
    }
}
