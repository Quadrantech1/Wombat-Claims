import { getTomorrowDate, getYearsAgoDate } from "@utils/date-util";
import { logger } from "@utils/logger-util";
import { StepOneResponse } from "../interfaces/payloads/quote-step-one-interface";
import { Customer, Payload, Pet, SelectedLimits, SelectedProduct } from "../interfaces/payloads/quote-step-two-interface";

export class QuoteStepTwoBuilder {
    private payload: Payload;
    private pets: Pet[] = [];
    private customer: Customer;

    constructor(randomValue: string) {
        this.payload = {
            quoteGuid: '',
            currentCoveragePeriodId: null,
            partnerCode: "",
            postalCode: "77433",
            // currentPetId: 0,
            effectiveOn: getTomorrowDate('API'),
            stateFilingId: 0,
            expiresOn: null,
            marketChannelId: 2,
            serviceFee: 3.0000,
            pets: [
                {
                    petName: `Lucy${randomValue}`,
                    coverage: {
                        selectedLimits: {
                            coverageLimitId: 5,
                            incidentLimitId: 13,
                            deductibleId: 11,
                            coinsuranceId: 2
                        },
                        selectedProducts: [
                            { stateFilingProductId: 14254, termDays: 365 }
                        ]
                    },
                    qualifyingConditions: false,
                    petId: 0,
                    quotePetResponses: [],
                    breedId: 251,
                    dob: getYearsAgoDate(3, 'API'),
                    registrationNumber: null,
                    genderId: 2,
                    salesforceId: null,
                    weight: 13,
                    internalPetId: null
                }
            ],
            customer: {
                firstName: `FN${randomValue}`,
                lastName: `LN${randomValue}`,
                address2: null,
                city: "AutomationCity",
                phone: "123-456-7890",
                address1: `${randomValue} Automation St`,
                postalCode: "77433",
                customerId: "",
                email: `quote${randomValue}@yopmail.com`,
            },
            discounts: null,
            agentId: 8,
            customerSourceCode: null,
            customerSourceDetail: null
        };
        // copying pets and customer from payload to allow for modifications
        this.pets = [...this.payload.pets];
        this.customer = { ...this.payload.customer };
    }



    withPayload(payloadOverrides?: Partial<Omit<Payload, 'pets' | 'customer'>>) {
        this.payload = {
            ...this.payload,
            ...payloadOverrides
        };
        return this;
    }
    //todo: figure out the way to dynamically set the default values for coverage

    /**
    * Accepts the full step one response and extracts quoteGuid, stateFilingId, and petIds from response.data.
    * Updates all pets in the builder with the corresponding pet object from the response.
    * @param response - The full step one response object.
    */
    withStepOneResponse(response: StepOneResponse): this {
        if (!response?.data) {
            throw new Error('[QuoteStepTwoBuilder.withStepOneResponse] - Response must have a data property');
        }
        const { quoteGuid, stateFilingId, marketChannelId, effectiveOn, pets: responsePets } = response.data;
        this.payload = {
            ...this.payload,
            quoteGuid,
            stateFilingId: stateFilingId,
            marketChannelId: marketChannelId,
            effectiveOn: effectiveOn
        };

        const defaultCoverage = this.payload.pets[0].coverage;

        this.pets = responsePets.map((responsePet, idx) => {
            const builderPet = this.pets[idx] || this.pets[0];
            let petName = responsePet.petName;
            if (responsePet.petName === responsePets[0].petName) {
                petName = idx === 0 ? responsePet.petName : `${responsePet.petName}_${idx + 1}`;
            }

            // Always assign a unique coverage object based on the builder's default
            const coverage = {
                selectedLimits: { ...defaultCoverage.selectedLimits },
                selectedProducts: [...defaultCoverage.selectedProducts]
            };

            return {
                ...builderPet,
                ...responsePet,
                petName,
                coverage
            };
        });

        this.payload.pets = [...this.pets];
        return this;
    }

    /**
     * @param petNumber - 1-based index of the pet to update in json payload.
     * @param petOverrides - Partial pet object to override default values.
     * @throws If petNumber < 1 or petId is missing when adding a new pet.
     * @throws If no petId is provided when adding a new pet.
     */
    withPet(petNumber: number, petOverrides?: Partial<Pet>) {
        if (petNumber < 1) {
            throw new Error(`Pet number must be 1 or greater, got ${petNumber}`);
        }
        const basePet = { ...this.pets[0] };
        let overrides = { ...petOverrides };

        // If dob is a number, treat it as age and convert to date string
        if (typeof overrides.dob === 'number') {
            overrides.dob = getYearsAgoDate(overrides.dob, 'API');
        }

        if (petNumber === 1) {
            this.pets[0] = { ...basePet, ...overrides };
        } else {
            if (!overrides.petName) {
                overrides.petName = `${basePet.petName}_${petNumber}`;
            }
            if (overrides?.petId === undefined) {
                throw new Error('petId must be provided when adding a new pet');
            }
            const newPet: Pet = {
                ...basePet,
                ...overrides
            };
            this.pets.push(newPet);
        }
        return this;
    }

    withCustomer(customerOverrides?: Partial<Customer>) {
        this.customer = {
            ...this.customer,
            ...customerOverrides
        };
        return this;
    }

    /**
     * @param petNumber - 1-based index of the pet to update in json payload.
     * @param selectedLimits - Partial selected limits to override.
     */
    withSelectedLimitsForPet(petNumber: number, selectedLimits: Partial<SelectedLimits>) {
        // we are using 1-based numbering for pets that is why we subtract 1
        const pet = this.pets[petNumber - 1];
        pet.coverage.selectedLimits = {
            ...pet.coverage.selectedLimits,
            ...selectedLimits
        };
        return this;
    }

    /**
     * @param petNumber - 1-based index of the pet to update in json payload.
     * @param selectedProducts - Array of selected products to set.
     */
    withSelectedProductsForPet(petNumber: number, selectedProducts: SelectedProduct[]) {
        // we are using 1-based numbering for pets that is why we subtract 1
        const pet = this.pets[petNumber - 1];
        pet.coverage.selectedProducts = selectedProducts;
        return this;
    }

    build(): Payload {
        logger.info(`[QuoteStepTwoBuilder.build] - Building payload with ${this.pets.length} pets and customer: ${JSON.stringify(this.customer)}`);
        return {
            ...this.payload,
            pets: this.pets,
            customer: this.customer
        };
    }

    static create(randomValue: string) {
        return new QuoteStepTwoBuilder(randomValue);
    }
}
