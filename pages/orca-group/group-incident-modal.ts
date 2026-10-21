import { TextBox } from '@controls/textbox';
import { IncidentModal } from '@pages/orca/loss/incident-modal';

export class GroupIncidentModal extends IncidentModal {
    
    override denialCodeTextBox = new TextBox(this.page, "//input[@name='DenialCodeText_autocomplete']");
}
