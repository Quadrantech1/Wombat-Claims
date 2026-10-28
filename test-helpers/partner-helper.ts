import { GroupBillingDetails } from '@data/orca/group-billing-details-data';
import { HamburgerMenuOptions } from '@pages/orca/common-section/menu-top-section';
import { RowsPerPage } from '@pages/orca/common-section/page-table-section';
import { OrcaScreenManager } from '@pages/page-managers/orca-page-manager';
import { expect } from '@playwright/test';
import { logger } from '@utils/logger-util';

/**
 * Helper class for Partner and Group Billing operations in ORCA
 */
export class PartnerHelper {
    constructor(private orca: OrcaScreenManager) { }

    /**
     * Verifies if a group billing record exists, and creates it if it doesn't
     * @param groupName - The name of the group to verify/create
     * @param groupBillingDetails - The group details to use if creating
     */
    async verifyOrCreateGroupBilling(
        groupName: string,
        groupBillingDetails?: Partial<GroupBillingDetails>
    ): Promise<void> {
        logger.info(`[PartnerHelper.verifyOrCreateGroupBilling] - Verifying or creating group: ${groupName}`);

        await this.orca.pageTableSection.setRowsPerPage(RowsPerPage.All);
        const groupLink = this.orca.groupBillingPage.groupLinkNamed(groupName);
        const groupExists = await groupLink.isDisplayed();

        if (!groupExists) {
            logger.info(`[PartnerHelper.verifyOrCreateGroupBilling] - Group not found, creating: ${groupName}`);
            await this.orca.menuTopSection.chooseMenuEntry(HamburgerMenuOptions.Partner);
            await this.orca.partnersPage.addGroupBillingLink.clickAndWait();
            await this.orca.groupBillingDetailPage.populateGroupBillingSection(groupBillingDetails);
            await this.orca.groupBillingDetailPage.saveButton.click();
            await this.orca.partnersPage.groupBillingDashboardLink.clickAndWait();
            await this.orca.pageTableSection.setRowsPerPage(RowsPerPage.All);
        } else {
            logger.info(`[PartnerHelper.verifyOrCreateGroupBilling] - Group already exists: ${groupName}`);
        }

        // Verify group now exists
        const finalGroupLink = this.orca.groupBillingPage.groupLinkNamed(groupName);
        const finalExists = await finalGroupLink.isDisplayed();
        expect(finalExists, `Group "${groupName}" should exist after creation/verification`).toBeTruthy();
        logger.info(`[PartnerHelper.verifyOrCreateGroupBilling] - Group verified: ${groupName}`);
    }
}
