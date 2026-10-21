import { Label } from '@controls/label';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { Page } from '@playwright/test';
import { logger } from '@utils/logger-util';

export class ClaimTeamInbox extends BasePage {
    receivedDateClaimLabel = new Label(this.page, "//*[@id='claims-queue']/div/h4");
    receivedDateClaimTable = new Table(this.page, "//table[@id='claim-table']");
}
