import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { BasePage } from '@pages/base-page';

export class AngularAlertSection extends BasePage {
    titleLabel = new Label(this.page, "//h5[@class='modal-title']/span");
    bodyMessage = new Label(this.page, "//h5[@class='modal-body']/span");
    closeButton = new Button(this.page, this.page.getByText('Close'));
    continueButton = new Button(this.page, this.page.getByRole('button', { name: 'Continue' }));
    deleteButton = new Button(this.page, "//div[@class='modal-dialog']//button[@class='btn btn-danger']");
    cancelButton = new Button(this.page, "//div[@class='modal-dialog']//button[@class='btn btn-default']");
}
