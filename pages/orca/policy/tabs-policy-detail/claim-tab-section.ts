import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Link } from '@controls/link';
import { Table } from '@controls/table';
import { BasePage } from '@pages/base-page';
import { expect } from '@playwright/test';
import { timeouts } from '@utils/timeouts-util';

export class ClaimTabSection extends BasePage {

  addNewClaimButton = new Button(this.page, "//a[@title='Add Claim']");
  moveClaimButton = new Button(this.page, "//a[@id='btn-move-claims']");
  claimsTable = new Table(this.page, "//div[@id='policy-claims' or @id='certificate-claims']/table");

  async claimTable(): Promise<string> {
    const claimDetails = new Label(this.page, "#claim-accordion");
    return await claimDetails.getText();
  }

  async clickViewButtonInTableForClaimNumber(claimNumber: string): Promise<void> {
    const newLocatorButton = `//td[contains(.,"${claimNumber}")]/..//td/a[@title="View Claim"]`;
    const viewButtonInTable = new Button(this.page, newLocatorButton);
    await viewButtonInTable.click();
  }

  async clickDeleteButtonInTableForClaimNumber(claimNumber: string): Promise<void> {
    const newLocatorButton = `//td[contains(.,"${claimNumber}")]/..//td/a[@title="Delete Claim"]`;
    const deleteButtonInTable = new Button(this.page, newLocatorButton);
    await deleteButtonInTable.click();
  }

  async verifyClaimIsPresentInTable(claimNumber: string): Promise<void> {
    await this.page.waitForTimeout(timeouts.polling);
    const claimInTable = new Link(this.page, `//a[normalize-space(text())="${claimNumber}"]`);
    await expect(claimInTable.getLocator()).toBeVisible();
  }
}