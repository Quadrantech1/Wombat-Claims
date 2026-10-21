import { formatDate, getTomorrowDate } from '@utils/date-util';
import { logger } from '@utils/logger-util';
import { SidneyAddress } from '../interfaces/payloads/sidney-common-interface';
import {
    SidneyBillingInformation,
    SidneyPet,
    SidneyQuoteResponse,
    SidneyUpdateQuotePayload,
} from '../interfaces/payloads/sidney-update-quote-interface';

export class SidneyUpdateQuoteBuilder {
    private payload: SidneyUpdateQuotePayload;
    private pets: SidneyPet[];

    constructor(randomValue: string) {
        const coverageDate = new Date();
        coverageDate.setDate(coverageDate.getDate() + 15);
        const coverageDateStr = formatDate(coverageDate, 'API');

        this.payload = {
            quoteId: '',
            emailAddress: '',
            brand: 'APHI',
            effectiveDate: getTomorrowDate('API'),
            accidentEffectiveDate: coverageDateStr,
            hereditaryEffectiveDate: coverageDateStr,
            illnessEffectiveDate: coverageDateStr,
            pets: [],
            mailingAddress: { zipcode: '60173', state: 'IL', street1: '123 Test Road apt 4', city: 'Richmond' },
            ratingAddress: { zipcode: '60173', state: 'IL', street1: '123 Test Road apt 4', city: 'Richmond' },
            billingAddress: { zipcode: '60173', state: 'IL', street1: '123 Test Road apt 4', city: 'Richmond' },
            billingInformation: {
                billingType: 'STRIPE',
                billingFrequency: 'Monthly',
                creditCardType: 'Visa',
                expirationDate: { month: 4, year: 2035 },
                stripeConfirmationToken: null,
                accountNumber: '4242',
                accountNumberLast4: '4242',
                routingNumber: null,
                customerId: null,
            },
            goPaperless: true,
            allowMarketing: false,
            isMilitary: false,
            isSalesQuote: false,
            allowSMS: false,
            preferredLanguage: 'English',
            callStatusId: 0,
            quoteStatus: 'Open',
            isOpenInSalesScript: false,
            petOwnerId: 0,
            enrollmentFee: 0,
            transactionFee: 2,
            totalTax: 0,
            scratchPad: [
                { key: 'plansView', value: 'New Plans View' },
            ],
            firstName: `FN${randomValue}`,
            lastName: `LN${randomValue}`,
            phoneNumber: '123-456-7890',
            marketCode: 'A0472',
        };
        this.pets = [];
    }

    /**
     * Populate the builder from a POST /quotes or GET /quotes response.
     * Only syncs identity/version fields (quoteId, emailAddress, brand, productVersion,
     * minorVersion, baseTotal, quoteTotal) and pets. All other builder defaults
     * (transactionFee, scratchPad, goPaperless, billingInformation, etc.) are preserved.
     * Call this right after creating a quote.
     * @param response The full quote response returned by the Sidney API.
     */
    withQuoteResponse(response: SidneyQuoteResponse) {
        if (!response?.quoteId) {
            throw new Error('[SidneyUpdateQuoteBuilder.withQuoteResponse] - Response must include a quoteId');
        }

        this.payload.quoteId = response.quoteId;
        this.payload.emailAddress = response.emailAddress;
        this.payload.brand = response.brand;
        if (response.productVersion) this.payload.productVersion = response.productVersion;
        if (response.minorVersion !== undefined) this.payload.minorVersion = response.minorVersion;
        if (response.baseTotal !== undefined) this.payload.baseTotal = response.baseTotal;
        if (response.quoteTotal !== undefined) this.payload.quoteTotal = response.quoteTotal;

        this.pets = response.pets ? response.pets.map(p => ({ ...p })) : [];

        // Carry zipcode and state from the quote response into all three addresses,
        // keeping the default street1/city (override with withAddress() if needed).
        if (response.mailingAddress?.zipcode) {
            const base: SidneyAddress = {
                zipcode: response.mailingAddress.zipcode,
                state: response.mailingAddress.state,
                street1: this.payload.mailingAddress?.street1,
                city: this.payload.mailingAddress?.city,
            };
            this.payload.mailingAddress = { ...base };
            this.payload.ratingAddress = { ...base };
            this.payload.billingAddress = { ...base };
        }

        return this;
    }

    /**
     * Override top-level payload fields (excludes pets).
     * Use for firstName, lastName, phoneNumber, marketCode, effectiveDate, etc.
     * @param overrides Partial payload fields to override.
     */
    withPayload(overrides: Partial<Omit<SidneyUpdateQuotePayload, 'pets'>>) {
        this.payload = { ...this.payload, ...overrides };
        return this;
    }

    /**
     * Set the mailing, rating, and billing addresses in one call.
     * Useful at checkout when all three addresses are the same.
     * @param address The address to apply to all three address fields.
     */
    withAddress(address: SidneyAddress) {
        this.payload.mailingAddress = { ...address };
        this.payload.ratingAddress = { ...address };
        this.payload.billingAddress = { ...address };
        return this;
    }

    /**
     * Set the Stripe confirmation token on the billing information.
     * Use withBillingInfo() to set card details (creditCardType, accountNumberLast4, expirationDate, etc.).
     * @param stripeConfirmationToken The ctoken from Stripe.
     */
    withStripeToken(stripeConfirmationToken: string) {
        this.payload.billingInformation = {
            ...this.payload.billingInformation,
            stripeConfirmationToken,
        };
        return this;
    }

    /**
     * Merge fields into the billing information object.
     * @param overrides Partial billing information fields to override.
     */
    withBillingInfo(overrides: Partial<SidneyBillingInformation>) {
        this.payload.billingInformation = { ...this.payload.billingInformation, ...overrides };
        return this;
    }

    /**
     * Add or update a pet in the payload.
     * - petNumber 1: updates the first pet already on the quote (from withQuoteResponse).
     * - petNumber > 1: appends a new pet (no petId or selectedPolicy until saved).
     * @param petNumber 1-based index.
     * @param petOverrides Partial pet fields to override.
     */
    withPet(petNumber: number, petOverrides?: Partial<SidneyPet>) {
        logger.info(`[SidneyUpdateQuoteBuilder.withPet] - Adding/updating pet number ${petNumber} with overrides: ${JSON.stringify(petOverrides)}`);
        if (petNumber < 1) {
            throw new Error(`[SidneyUpdateQuoteBuilder.withPet] - Pet number must be 1 or greater, got ${petNumber}`);
        }
        if (petNumber === 1) {
            this.pets[0] = { ...this.pets[0], ...petOverrides };
        } else {
            const basePet = this.pets[0] ?? {} as SidneyPet;
            const newPet: SidneyPet = {
                name: petOverrides?.name ?? `${basePet.name}_${petNumber}`,
                breed: basePet.breed,
                birthDate: basePet.birthDate ?? '',
                gender: basePet.gender ?? 'M',
                color: 'Unknown',
                isSpayedOrNeutered: false,
                exclusions: [],
                ...petOverrides,
                petId: undefined,
                selectedPolicy: undefined,
            };
            this.pets.push(newPet);
        }
        return this;
    }

    /**
     * Replace a pet with the full object returned from POST /pets/{petId}/policy (SELECT_POLICY).
     * The response already includes petId and the selectedPolicy — use this to chain directly
     * from the select policy endpoint response instead of building the policy manually.
     * @param pet The full pet object from the SELECT_POLICY response.
     * @param petNumber 1-based index of the pet to replace (defaults to 1).
     */
    withPetFromResponse(pet: SidneyPet, petNumber: number = 1) {
        logger.info(`[SidneyUpdateQuoteBuilder.withPetFromResponse] - Setting pet at position ${petNumber} from response`);
        if (petNumber < 1) {
            throw new Error(`[SidneyUpdateQuoteBuilder.withPetFromResponse] - Pet number must be 1 or greater, got ${petNumber}`);
        }
        if (petNumber <= this.pets.length) {
            this.pets[petNumber - 1] = { ...pet };
        } else {
            this.pets.push({ ...pet });
        }
        return this;
    }

    build(): SidneyUpdateQuotePayload {
        logger.info(`[SidneyUpdateQuoteBuilder.build] - Building update quote payload for quoteId: ${this.payload.quoteId} with ${this.pets.length} pet(s)`);
        return { ...this.payload, pets: this.pets };
    }

    static create(randomValue: string) {
        return new SidneyUpdateQuoteBuilder(randomValue);
    }
}

