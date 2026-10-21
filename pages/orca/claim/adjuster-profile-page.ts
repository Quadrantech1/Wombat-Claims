import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { MultipleSelect } from '@controls/multiple-select';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';
import { Page } from 'playwright';
import { AlertSection } from '../common-section/alert-section';

export class ClaimAdjusterProfilePage extends BasePage {
    adjusterTable = new Table(this.page, "//table[@class='table table-bordered table-striped']");
    totalSubmittedLevel = new Select(this.page, "//select[@formcontrolname='claimTotalAssignment']");
    saveButton = new Button(this.page, "//button[normalize-space()='Save']");
    editButton = new Button(this.page, "//h5[text()='Claim Total Submitted Level']//following-sibling::button");
    auditLevelDropdown = new Select(this.page, "//h5[normalize-space()='Audit Level']/following::select[1]");
    cancelButton = new Button(this.page, "//a[@title='Cancel']");
    stateAssignDropDownButton = new Button(this.page, "//div[contains(text(),'Assign States')]/../..");
    selectAllButton = new Button(this.page, "//div[@class='ng-dropdown-header']//button[text()='Select All']");
    clearAllButton = new Button(this.page, "//div[@class='ng-dropdown-header']//button[text()='Clear All']");
    stateAssignmentDropDownSelect = new MultipleSelect(this.page, "//ng-dropdown-panel[@role='listbox']//div[@role='option']");

    alertSection = new AlertSection(this.page);
    constructor(page: Page) {
        super(page);
    }

    /**
     * Clicks the edit button for a specific section
     * @param section - The section name to edit
     */
    async clickOnEditButtonForSection(section: string): Promise<void> {
        logger.info(`[ClaimAdjusterProfilePage.clickOnEditButtonForSection] - Clicking edit button for section: ${section}`);
        const editSectionButton = new Button(this.page, `//h5[text()='${section}']/following-sibling::button`);
        await editSectionButton.waitForVisible();
        await editSectionButton.click();
    }

    /**
     * Clicks on a specific state in the state assignment dropdown
     * @param state - The state name to select
     */
    async clickOnStateInStateAssignmentDropDown(state: string): Promise<void> {
        logger.info(`[ClaimAdjusterProfilePage.clickOnStateInStateAssignmentDropDown] - Selecting state: ${state}`);
        const stateLabel = new Label(this.page, `//ng-dropdown-panel[@role='listbox']//div[@role='option']/span[contains(text(),'${state}')]`);
        await stateLabel.click();
    }

    /**
     * Verifies that options in the state assignment dropdown are sorted alphabetically
     * @returns true if options are sorted, false otherwise
     */
    async verifyOptionsinStateAssignmentDropDownSorted(): Promise<boolean> {
        logger.info('[ClaimAdjusterProfilePage.verifyOptionsinStateAssignmentDropDownSorted] - Verifying state options are sorted');
        const statesBeforeSorting = await this.stateAssignmentDropDownSelect.getValuesInStateAssignmentDropDown();
        const expectedSortedStates = [...statesBeforeSorting].sort();
        const isSorted = JSON.stringify(expectedSortedStates) === JSON.stringify(statesBeforeSorting);
        logger.info(`[ClaimAdjusterProfilePage.verifyOptionsinStateAssignmentDropDownSorted] - States are sorted: ${isSorted}`);
        return isSorted;
    }
}
