import { Button } from '@controls/button';
import { Checkbox } from '@controls/checkbox';
import { Select } from '@controls/select';
import { Table } from '@controls/table';
import { TextBox } from '@controls/textbox';
import { SearchVetData } from '@data/orca/vet-data';
import { BasePage } from '@pages/base-page';

export class VetDashboardPage extends BasePage {
    // TextBoxes
    nameTextBox = new TextBox(this.page, '#SearchCriteria_Name');
    phoneTextBox = new TextBox(this.page, '#SearchCriteria_PhoneNo');
    cityTextBox = new TextBox(this.page, '#SearchCriteria_City');
    postalCodeTextBox = new TextBox(this.page, '#SearchCriteria_PostalCode');

    // Select Dropdown
    stateProvinceDropDown = new Select(this.page, '#vet-search-state-prov-select');

    // Checkbox
    showAllCheckbox = new Checkbox(this.page, '#ShowAllDuplicates');

    // Buttons
    clearButton = new Button(this.page, "//a[contains(text(),'Clear')]");
    runSearchButton = new Button(this.page, "//button[contains(text(),'Run Search')]");

    // Table
    vetsTable = new Table(this.page, '#vets-table');

    async searchVet(searchVetData: SearchVetData): Promise<void> {
       if (searchVetData.vetName) await this.nameTextBox.setText(searchVetData.vetName);
       if (searchVetData.phone) await this.phoneTextBox.setText(searchVetData.phone);
       if (searchVetData.city) await this.cityTextBox.setText(searchVetData.city);
       if (searchVetData.stateProvince) await this.stateProvinceDropDown.selectOption(searchVetData.stateProvince);
       if (searchVetData.postalCode) await this.postalCodeTextBox.setText(searchVetData.postalCode);
       await this.runSearchButton.clickAndWait();
    }


}
