import { Button } from '@controls/button';
import { BasePage } from '@pages/base-page';

export class ClaimsProcessingPage extends BasePage {
  createNewProcedureCodeButton = new Button(this.page, "//button[contains(text(),'Create New Procedure Code')]");
  ruleCreationForProcedureCodeButton = new Button(this.page, "//button[contains(text(),'Rule Creation for Procedure Code')]");
  ruleCreationForIncidentButton = new Button(this.page, "//button[contains(text(),'Rule Creation for Incident')]");
  ruleCreationForLimitsButton = new Button(this.page, "//button[contains(text(),'Rule Creation for Limits')]");
  denialCodeCreationButton = new Button(this.page, "//button[contains(text(),'Denial Code')]");
  adjusterEobNotesButton = new Button(this.page, "//button[contains(text(),'Adjuster EOB Notes')]");
  incidentTypesButton = new Button(this.page, "//button[contains(text(),'Incident Types')]");
  conditionalClaimRulesButton = new Button(this.page, "//button[contains(text(),'Conditional Claim Rules')]");
  createNewClaimRuleButton = new Button(this.page, "//button[contains(text(),'Create New Claim Rule')]");
}
