import { Button } from '@controls/button';
import { Cell } from '@controls/cell';
import { Checkbox } from '@controls/checkbox';
import { Label } from '@controls/label';
import { RadioButton } from '@controls/radio-button';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { MakeChangesPetDetails } from '@data/orca/make-changes-pet-details-data';
import { BasePage } from '@pages/base-page';
import { LoadingSection } from '@pages/orca/common-section/loading-section';
import { logger } from '@utils/logger-util';

export class PolicyMakeChangesPage extends BasePage {

    addPetButton = new Button(this.page, "//a[text()=' Add Pet ']");
    existingPetButton = new Button(this.page, "//a[normalize-space()='Existing Pet']");
    newPetButton = new Button(this.page, "//a[normalize-space()='New Pet']");
    policynumberTextBox = new TextBox(this.page, "//input[@id='SearchString']");
    selectButton = new Button(this.page, "//a[contains(.,'Select')]");
    makeChangeButton1 = new Button(this.page, "(//a[@id='btn-edit-coverage'])[1]");
    makeChangeButton2 = new Button(this.page, "(//a[@id='btn-edit-coverage'])[2]");
    upcomingButton = new Button(this.page, "//a[text()='Upcoming']");
    activeButton = new Button(this.page, "//a[contains(text(),'Active')]");
    companionCareRadiobutton = new RadioButton(this.page, "#CoverageProducts_0__IsSelected");

    accidentCareCheckbox = new Checkbox(this.page, "//*[contains(text(),'AccidentCare')]/parent::*/input[contains(@id,'_11_')]");
    policyActionsButton = new Button(this.page, "//a[text()='Policy Actions ']");
    cancelEntirePolicyButton = new Button(this.page, "//a[@title='Cancel Entire Policy']");
    changeEffectiveDateButton = new Button(this.page, "//a[text()='Change Effective Date']");
    notesTextbox = new TextBox(this.page, "#Notes");
    saveButton = new Button(this.page, "//div[@class=\"modal-footer btn-block\"]/button[@class='btn btn-success']");
    supportPlusCheckbox = new Checkbox(this.page, "#CoverageProducts_9__IsSelected");
    alternativePlusCheckbox = new Checkbox(this.page, "#CoverageProducts_10__IsSelected");
    examPlusCheckbox = new Checkbox(this.page, "#CoverageProducts_11__IsSelected");
    defenderCheckbox = new Checkbox(this.page, "#CoverageProducts_12__IsSelected");
    defenderPlusCheckbox = new Checkbox(this.page, "#CoverageProducts_13__IsSelected");
    saveButtonMakeChangesPage = new Button(this.page, "//button[@id=\"coverage-detail-submit\"]");
    savePetButton = new Button(this.page, "//button[@id=\"btn-save-pet-details\"]");
    saveButtonQuoteDetails = new Button(this.page, "//div[@id='quote-actions']//button[@type='submit'][normalize-space()='Save']");
    premium = new Label(this.page, "//tr[contains(@id,'coverage')]/td[contains(text(),'/ mo')]");
    newEffectiveDateButton = new TextBox(this.page, "#newDate");
    coveragePeriodSelect = new Select(this.page, "#mySelect");
    makeChangesPetNameTextBox = new TextBox(this.page, "//input[@name='Pet.Pet.PetName']");
    makeChangesDOBTextBox = new TextBox(this.page, "//input[@id='Pet_Pet_Dob']");
    makeChangesGenderSelect = new Select(this.page, "//select[@id='gender-select']");
    makeChangesSpeciesSelect = new Select(this.page, "//select[@id='species-select']");
    makeChangesBreedSelect = new Select(this.page, "//select[@id='breed-select']");
    coverageDetailsTable = new Table(this.page, "//table[@id=\"products\"]");
    coverageDetailsTableCell: Record<string, Cell> = {
        "Product Name": new Cell(1, "input", "Product Name"),
        "Incident Limit": new Cell(2, "select", "Incident Limit"),
        "Deductible": new Cell(3, "select", "Deductible"),
        "Deductible Frequency": new Cell(4, "select", "Deductible Frequency"),
        "Coinsurance": new Cell(5, "select", "Coinsurance"),
        "Coverage Limit": new Cell(6, "select", "Coverage Limit"),
    };
    limitsIds: Record<string, string> = {
        "Incident Limit": "il",
        "Deductible": "ded",
        "Deductible Frequency": "df",
        "Coinsurance": "coins",
        "Coverage Limit": "cl"
    };
   
    companionCareExaminationFeesCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Examination Fees']/parent::*/input[@type='checkbox'][following::input[@id='CoverageProducts_8__IsSelected']]");
    companionCareHereditaryAndCongenitalCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Hereditary and Congenital']/parent::*/input[@type='checkbox'][following::input[@id='CoverageProducts_8__IsSelected']]");
    companionCareDentalIllnessCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Dental Illness']/parent::*/input[@type='checkbox'][following::input[@id='CoverageProducts_8__IsSelected']]");
    companionCarePrescriptionFoodCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Prescription Food']/parent::*/input[@type='checkbox'][following::input[@id='CoverageProducts_8__IsSelected']]");
    companionCareTakeHomeMedicationCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Take Home Medication']/parent::*/input[@type='checkbox'][following::input[@id='CoverageProducts_8__IsSelected']]");
    companionCareBasicCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Basic']/parent::*/input[@type='checkbox'][following::input[@id='CoverageProducts_8__IsSelected']]");
    companionCarePrimeCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Prime']/parent::*/input[@type='checkbox'][following::input[@id='CoverageProducts_8__IsSelected']]");
    companionCareExamPlusCheckbox = new Checkbox(this.page, "//*[contains(.,'ExamPlus')]/parent::*/input[contains(@id,'_4_')]");
    companionCareAlternativePlusCheckbox = new Checkbox(this.page, "//*[contains(.,'AlternativePlus')]/parent::*/input[contains(@id,'_5_')]");
    companionCareHereditaryPlusCheckbox = new Checkbox(this.page, "//*[contains(.,'HereditaryPlus')]/parent::*/input[contains(@id,'_6_')]");
    companionCareBreedingCoverageCheckbox = new Checkbox(this.page, "//*[contains(.,'BreedingCoverage')]/parent::*/input[contains(@id,'_7_')]");
    companionCareSupportPlusCheckbox = new Checkbox(this.page, "//*[contains(.,'SupportPlus')]/parent::*/input[contains(@id,'_8_')]");
    companionCareDefenderCheckbox = new Checkbox(this.page, "//*[contains(.,'Defender') and not(contains(.,'DefenderPlus'))]/parent::*/input[contains(@id,'_9_')]");
    companionCareDefenderPlusPlusCheckbox = new Checkbox(this.page, "//*[contains(.,'DefenderPlus')]/parent::*/input[contains(@id,'_10_')]");

    accidentCareRadiobutton = new RadioButton(this.page, "#CoverageProducts_8__IsSelected");
    accidentCareExaminationFeesCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Examination Fees']/parent::*/input[@type='checkbox'][preceding::input[@id='CoverageProducts_8__IsSelected']]");
    accidentCareTakeHomeMedicationCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Take Home Medication']/parent::*/input[@type='checkbox'][preceding::input[@id='CoverageProducts_8__IsSelected']]");
    accidentCarePrescriptionFoodCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Prescription Food']/parent::*/input[@type='checkbox'][preceding::input[@id='CoverageProducts_8__IsSelected']]");
    accidentCareBasicCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Basic']/parent::*/input[@type='checkbox'][preceding::input[@id='CoverageProducts_8__IsSelected']]");
    accidentCarePrimeCheckbox = new Checkbox(this.page, "//*[normalize-space(text())='Prime']/parent::*/input[@type='checkbox'][preceding::input[@id='CoverageProducts_8__IsSelected']]");
    accidentCareSupportPlusCheckbox = new Checkbox(this.page, "//*[contains(.,'SupportPlus')]/parent::*/input[contains(@id,'_14_')]");
    accidentCareExamPlusCheckbox = new Checkbox(this.page, "//*[contains(.,'ExamPlus')]/parent::*/input[contains(@id,'_15_')]");
    accidentCareAlternativePlusCheckbox = new Checkbox(this.page, "//*[contains(.,'AlternativePlus')]/parent::*/input[contains(@id,'_16_')]");
    accidentCareDefenderCheckbox = new Checkbox(this.page, "//*[contains(.,'Defender') and not(contains(.,'DefenderPlus'))]/parent::*/input[contains(@id,'_17_')]");
    accidentCareDefenderPlusCheckbox = new Checkbox(this.page, "//*[contains(.,'DefenderPlus')]/parent::*/input[contains(@id,'_18_')]");
    refreshPremiumsButton = new Button(this.page, "#btn-refresh-premiums");

    loadingSection = new LoadingSection(this.page);

    dialogSection = new Button(this.page, "//div[@id='dialog' and @style='display: block;']");

    async getSelectByLimitForActualPlan(limitName: string): Promise<Select> {
        logger.info('[PolicyMakeChangesPage.getSelectByLimitForActualPlan] - Getting select element for limit');
        const selectedProduct = new Checkbox(this.page, "tr[data-parent-id=''] td label input.parent.product-checkbox:checked");
        const productId = await selectedProduct.getAttribute("data-product-id");
        if (productId === null) {
            throw new Error('[PolicyMakeChangesPage.getSelectByLimitForActualPlan] - No product id is found.');
        }
        return new Select(this.page, `//select[contains(@id,'csfp-${productId}-${this.limitsIds[limitName]}-id')]`);
    }

    /**
     * Convenience method that retrieves the Select for the given limit and selects the provided value.
     * @param limitName One of: Incident Limit, Deductible, Deductible Frequency, Coinsurance, Coverage Limit
     * @param value The option value/text value to select (must match the option's value attribute configured in the DOM)
     */
    async selectLimitForActualPlan(limitName: string, value: string): Promise<void> {
        logger.info(`[PolicyMakeChangesPage.selectLimitForActualPlan] - Selecting value [${value}] for limit [${limitName}]`);
        const selectControl = await this.getSelectByLimitForActualPlan(limitName);
        await selectControl.selectValue(value);
        logger.info(`[PolicyMakeChangesPage.selectLimitForActualPlan] - Selected value [${value}] for limit [${limitName}]`);
    }

    async fillPetDetailsInMakeChangesScreen(makeChangesPetEntity: MakeChangesPetDetails): Promise<void> {
        logger.info('[PolicyMakeChangesPage.fillPetDetailsInMakeChangesScreen] - Filling pet details');
        if (makeChangesPetEntity.makeChangesPetName !== undefined && makeChangesPetEntity.makeChangesPetName !== null) {
            await this.makeChangesPetNameTextBox.setText(makeChangesPetEntity.makeChangesPetName);
            await this.makeChangesPetNameTextBox.click();
        }
        if (makeChangesPetEntity.makeChangesPetDOB !== undefined && makeChangesPetEntity.makeChangesPetDOB !== null) {
            await this.makeChangesDOBTextBox.click();
            await this.makeChangesDOBTextBox.setText(makeChangesPetEntity.makeChangesPetDOB);
        }
        if (makeChangesPetEntity.makeChangesPetGender !== undefined && makeChangesPetEntity.makeChangesPetGender !== null) {
            await this.makeChangesGenderSelect.selectValue(makeChangesPetEntity.makeChangesPetGender);
        }
        if (makeChangesPetEntity.makeChangesPetSpecies !== undefined && makeChangesPetEntity.makeChangesPetSpecies !== null) {
            await this.makeChangesSpeciesSelect.selectValue(makeChangesPetEntity.makeChangesPetSpecies);
        }
        if (makeChangesPetEntity.makeChangesPetBreed !== undefined && makeChangesPetEntity.makeChangesPetBreed !== null) {
            await this.makeChangesBreedSelect.selectValue(makeChangesPetEntity.makeChangesPetBreed);
        }
    }

    async clickMakeChangesInPetTable(petName: string): Promise<void> {
        logger.info(`[PolicyMakeChangesPage.clickMakeChangesInPetTable] - Clicking Make Changes for pet: ${petName}`);
        const makeChangesPetLabel = new Label(this.page, `//div[contains(text(),'${petName}')]/../../..//a[@title="Make Changes"]`);
        if (await makeChangesPetLabel.isDisplayed()) {
            await makeChangesPetLabel.click();
        } else {
            throw new Error(`[PolicyMakeChangesPage.clickMakeChangesInPetTable] - 'Make Changes' link for pet '${petName}' is not visible.`);
        }
    }
}
