import { BasePage } from '../../base-page';
import { Label } from '@controls/label';
import { logger } from '@utils/logger-util';

export class PortalCongratulationEnrollmentPage extends BasePage {
    /**
     * Get coverage label for a specific pet
     * @param petName - The name of the pet
     * @param coverage - The coverage type to get
     * @returns Label for the specified coverage and pet
     */
    getCoverageForPetLabel(petName: string, coverage: string): Label {
        logger.info(`[PortalCongratulationEnrollmentPage.getCoverageForPetLabel] Getting coverage label for pet: ${petName}, coverage: ${coverage}`);
        const locator = `//h5[text()='${petName}']/..//strong[text()='${coverage}']`;
        return new Label(this.page, locator);
    }

    /**
     * Get pet name by index
     * @param petName - The name of the pet
     * @returns Label for the pet name at the specified index
     */
    getPetNameLabel(petName: string): Label {
        logger.info(`[PortalCongratulationEnrollmentPage.getPetNameLabel] Getting pet name label for: ${petName}`);
        return new Label(this.page, this.page.getByRole('heading', { name: petName, exact: true }));
    }

    /**
     * Get coverage option label for specific pet by index
     * @param coverageType - The type of coverage option
     * @param petIndex - The index of the pet
     * @returns Label for the specified coverage option and pet
     */
    getPetCoverageLabel(coverageType: string, petIndex: number): Label {
        logger.info(`[PortalCongratulationEnrollmentPage.getPetCoverageLabel] Getting pet coverage label for type: ${coverageType}, index: ${petIndex}`);
        return new Label(this.page, this.page.getByText(`${coverageType}`).nth(petIndex - 1).locator('span'));
    }

    /**
     * Get coverage label for a specific pet
     * @param petName - The name of the pet
     * @param coverage - The coverage type
     * @returns Label for the specified coverage and pet
     */
    getCoverageLabel(petName: string, coverage: string): Label {
        logger.info(`[PortalCongratulationEnrollmentPage.getCoverageLabel] Getting coverage label for pet: ${petName}, coverage: ${coverage}`);
        const locator = `//h5[text()='${petName}']/..//strong[text()='${coverage}']`;
        return new Label(this.page, locator);
    }

    /**
     * Get pet breed label for specific pet by index
     * @param petIndex - The index of the pet
     * @returns Label for the specified coverage option and pet
     */
    getPetBreedLabel(breed: string): Label {
        logger.info(`[PortalCongratulationEnrollmentPage.getPetBreedLabel] Getting pet breed label for: ${breed}`);
        return new Label(this.page, this.page.getByRole('heading', { name: breed }));
    }
}