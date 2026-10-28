import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { logger } from '@utils/logger-util';

export class GroupBillingScreen extends BasePage {
    groupsTable = new Table(this.page, "//table[//th[contains(text(),'Group Name')]]");

    /**
     * Gets a group link by group name
     * @param groupName - The group name to search for
     */
    groupLinkNamed(groupName: string): Link {
        logger.info(`[GroupBillingPage.getGroupLinkByGroupName] - Getting group link for: ${groupName}`);
        return new Link(this.page, `//td/a[contains(text(),'${groupName}')]`);
    }
}
