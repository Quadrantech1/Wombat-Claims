import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';
import { CoverageTabSection } from '@pages/orca/policy/tabs-policy-detail/coverage-tab-setion';

export class GroupPetCoverageInfoPage extends CoverageTabSection {
    async getValueForLabel(controlName: string): Promise<string> {
        const control = new Label(this.page, `//*[text()='${controlName}']/../../div[@class='controls']`);
        return await control.getText();
    }

    async getToolTipForLabel(controlName: string): Promise<string | null> {
        const control = new Label(this.page, `//*[text()='${controlName}']/parent::div[@data-toggle="tooltip"]`);
        return await control.getAttribute('title');
    }
}