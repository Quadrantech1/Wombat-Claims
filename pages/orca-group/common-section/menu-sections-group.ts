import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { Select } from '@controls/select';
import { TextBox } from '@controls/textbox';
import { MenuTopSection } from '@pages/orca/common-section/menu-top-section';
import { logger } from '@utils/logger-util';

export class MenuSectionsGroup extends MenuTopSection {
    // menu option
    certificateTab = new Button(this.page, "//a[text()='Certificate']");
    assignedTab = new Button(this.page, "//a[text()='Assigned ']");

    // Labels
    lookBackPeriodLabel = new Label(this.page, "//strong[normalize-space()='Look Back Period']");

    selectSearchCertificateOrClaim = new Select(this.page, "//select[@id='optSearchGroup']");
    searchCertificateClaimTextBox = new TextBox(this.page, "//input[@id='searchInputGroup']");

    async searchCertificate(certificate: string | number): Promise<void> {
        logger.info("MenuTopSection>searchCertificate > search certificate: " + certificate);
        await this.page.waitForLoadState('networkidle');
        await this.selectSearchCertificateOrClaim.selectOption('Certificate');
        await this.searchCertificateClaimTextBox.setText(String(certificate));
        await this.goButton.clickAndWait();
    }

    override async searchClaim(claim: string | number): Promise<void> {
        logger.info("[MenuTopSection>searchClaim] > search claim: " + claim);
        await this.page.waitForLoadState('networkidle');
        await this.selectSearchCertificateOrClaim.selectOption('Claim');
        await this.searchCertificateClaimTextBox.setText(String(claim));
        await this.goButton.clickAndWait();
    }
}