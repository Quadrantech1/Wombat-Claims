import { Button } from '@controls/button';
import { Label } from '@controls/label';
import { LossDetailPage } from '@pages/orca/loss/loss-detail-page';
import { GroupIncidentModal } from './group-incident-modal';

export class GroupLossDetailsPage extends LossDetailPage {
    viewProductsForPetButton = new Button(this.page, "//a[@title=\"View Products for Pet\"]");

    // Labels
    duplicateWarningLabel = new Label(this.page, "//h3[@class='error']");

    groupIncidentModal = new GroupIncidentModal(this.page);
}