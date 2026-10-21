import { AdminDashboardPage } from '@pages/orca/admin/admin-dashboard-page';
import { AccountDetailPage } from '@pages/orca/admin/admin-dashboard/account-detail-page';
import { UserManagementPage } from '@pages/orca/admin/admin-dashboard/user-management-page';
import { ClaimsProcessingPage } from '@pages/orca/admin/claims/claims-processing-page';
import { DenialCodeCreationPage } from '@pages/orca/admin/claims/denial-code-creation-page';
import { IncidentPage } from '@pages/orca/admin/claims/incident-page';
import { IncidentRulesPage } from '@pages/orca/admin/claims/incident-rules-page';
import { DocumentLibrarySearchPage } from '@pages/orca/admin/document-management/document-library-search-page';
import { FilingPage } from '@pages/orca/admin/filing/filing-page';
import { StateManagementPage } from '@pages/orca/admin/product-management/state-management-page';
import { QuoteApiBillingPage } from '@pages/orca/admin/quote-api/quote-api-billing-page';
import { QuoteApiCustomInfoPage } from '@pages/orca/admin/quote-api/quote-api-customer-info-page';
import { QuoteApiPage } from '@pages/orca/admin/quote-api/quote-api-page';
import { QuoteApiPetCreationPage } from '@pages/orca/admin/quote-api/quote-api-pet-creation-page';
import { AddAffiliatePage } from '@pages/orca/affiliate/add-affiliate-page';
import { AffiliateDashboardPage } from '@pages/orca/affiliate/affiliate-dashboard-page';
import { LeadFeeStateManagementDashboardPage } from '@pages/orca/affiliate/lead-fee-state-management-dashboard-page';
import { LeadFeeTierDetailPage } from '@pages/orca/affiliate/lead-fee-tier-detail-page';
import { LeadFeeTiersDashboardPage } from '@pages/orca/affiliate/lead-fee-tiers-dashboard-page';
import { BreederDetailsPage } from '@pages/orca/breeder/breeder-details-page';
import { BreederSearchSection } from '@pages/orca/breeder/breeder-search-section';
import { LitterDetailsSection } from '@pages/orca/breeder/litter-details-section';
import { LitterSearchSection } from '@pages/orca/breeder/litter-search-section';
import { YourBreederPortalPage } from '@pages/orca/breeder/your-breeder-portal-page';
import { ClaimAdjusterProfilePage } from '@pages/orca/claim/adjuster-profile-page';
import { ClaimDashboard } from '@pages/orca/claim/claim-dashboard';
import { ClaimDetailPage } from '@pages/orca/claim/claim-detail-page';
import { RequestMedicalRecordPage } from '@pages/orca/claim/request-medical-record-page';
import { FooterSection } from '@pages/orca/common-section/footer-section';
import { MenuTopSection } from '@pages/orca/common-section/menu-top-section';
import { PageTableSection } from '@pages/orca/common-section/page-table-section';
import { CustomerDetailPage } from '@pages/orca/customer/customer-detail-page';
import { CheckManagementPage } from '@pages/orca/finance/check-management-page';
import { ClaimCheckReconciliationPage } from '@pages/orca/finance/claim-check-reconciliation-page';
import { FinanceDashboardPage } from '@pages/orca/finance/finance-dashboard-page';
import { InvoiceDetailsModalWindowPage } from '@pages/orca/finance/invoice-details-modal-window-page';
import { RenewByPolicyPage } from '@pages/orca/finance/renew-by-policy-page';
import { RenewPoliciesPage } from '@pages/orca/finance/renew-policies-page';
import { LoginPage } from '@pages/orca/login/login-page';
import { RegisterPage } from '@pages/orca/login/register-page';
import { IncidentDetailPage } from '@pages/orca/loss/incident-detail-page';
import { LossDetailPage } from '@pages/orca/loss/loss-detail-page';
import { McLeadDetailsPage } from '@pages/orca/mclead/mclead-details-page';
import { McLeadRegistrationPage } from '@pages/orca/mclead/mclead-registration-page';
import { McLeadSearchPage } from '@pages/orca/mclead/mclead-search-page';
import { GroupBillingDetailPage } from '@pages/orca/partner/group-billing-detail-page';
import { GroupBillingPage } from '@pages/orca/partner/group-billing-page';
import { PartnerDetailOverviewPage } from '@pages/orca/partner/partner-detail-overview-page';
import { PartnersPage } from '@pages/orca/partner/partners-page';
import { PetDetailPage } from '@pages/orca/pet/pet-detail-page';
import { EditPaymentPage } from '@pages/orca/policy/edit-payment-page';
import { FollowUpDetailPage } from '@pages/orca/policy/follow-up-detail-page';
import { MoveClaimDialog } from '@pages/orca/policy/move-claim-dialog';
import { PolicyCancelPage } from '@pages/orca/policy/policy-cancel-page';
import { PolicyChangesForNewPetPage } from '@pages/orca/policy/policy-changes-for-new-pet-page';
import { PolicyDashboardPage } from '@pages/orca/policy/policy-dashboard-page';
import { PolicyDetailPage } from '@pages/orca/policy/policy-detail-page';
import { PolicyMakeChangesPage } from '@pages/orca/policy/policy-make-changes-page';
import { PolicySearchSection } from '@pages/orca/policy/policy-search-section';
import { PetTabSection } from '@pages/orca/policy/tabs-policy-detail/pet-tab-section';
import { TransferSaleDialog } from '@pages/orca/policy/transfer-sale-dialog';
import { QuoteDetailsPage } from '@pages/orca/quote/quote-details-page';
import { VetDashboardPage } from '@pages/orca/vet/vet-dashboard-page';
import { VetDetailsPage } from '@pages/orca/vet/vet-details-page';
import { Page } from '@playwright/test';
import { FilingDetailPage } from '../orca/admin/product-management/filing-detail-page';
import { BasePageManager } from './base-page-manager';

export class OrcaPageManager extends BasePageManager {

    private _loginPage?: LoginPage;
    private _menuTopSection?: MenuTopSection;
    private _policyDetailPage?: PolicyDetailPage;
    private _claimDetailPage?: ClaimDetailPage;
    private _mcLeadRegistrationPage?: McLeadRegistrationPage;
    private _mcLeadSearchPage?: McLeadSearchPage;
    private _mcLeadDetailsPage?: McLeadDetailsPage;
    private _breederSearchSection?: BreederSearchSection;
    private _breederDetailsPage?: BreederDetailsPage;
    private _litterSearchSection?: LitterSearchSection;
    private _litterDetailsSection?: LitterDetailsSection;
    private _yourBreederPortalPage?: YourBreederPortalPage;
    private _lossDetailPage?: LossDetailPage;
    private _incidentDetailPage?: IncidentDetailPage;
    private _footerSection?: FooterSection;
    private _pageTableSection?: PageTableSection;
    private _petTabSection?: PetTabSection;
    private _petDetailPage?: PetDetailPage;
    private _userManagementPage?: UserManagementPage;
    private _accountDetailPage?: AccountDetailPage;
    private _quoteDetailsPage?: QuoteDetailsPage;
    private _claimsProcessingPage?: ClaimsProcessingPage;
    private _checkManagementPage?: CheckManagementPage;
    private _claimCheckReconciliationPage?: ClaimCheckReconciliationPage;
    private _financeDashboardPage?: FinanceDashboardPage;
    private _invoiceDetailsModalWindowPage?: InvoiceDetailsModalWindowPage;
    private _renewByPolicyPage?: RenewByPolicyPage;
    private _renewPoliciesPage?: RenewPoliciesPage;
    private _quoteApiPage?: QuoteApiPage;
    private _quoteApiPetCreationPage?: QuoteApiPetCreationPage;
    private _quoteApiCustomInfoPage?: QuoteApiCustomInfoPage;
    private _quoteApiBillingPage?: QuoteApiBillingPage;
    private _adminDashboardPage?: AdminDashboardPage;
    private _policyMakeChangesPage?: PolicyMakeChangesPage;
    private _editPaymentPage?: EditPaymentPage;
    private _followUpDetailPage?: FollowUpDetailPage;
    private _moveClaimDialog?: MoveClaimDialog;
    private _policyCancelPage?: PolicyCancelPage;
    private _policyChangesForNewPetPage?: PolicyChangesForNewPetPage;
    private _policySearchSection?: PolicySearchSection;
    private _transferSaleDialog?: TransferSaleDialog;
    private _requestMedicalRecordPage?: RequestMedicalRecordPage;
    private _policyDashboardPage?: PolicyDashboardPage;
    private _customerDetailPage?: CustomerDetailPage;
    private _partnersPage?: PartnersPage;
    private _partnerDetailOverviewPage?: PartnerDetailOverviewPage;
    private _groupBillingPage?: GroupBillingPage;
    private _groupBillingDetailPage?: GroupBillingDetailPage;
    private _affiliateDashboardPage?: AffiliateDashboardPage;
    private _addAffiliatePage?: AddAffiliatePage;
    private _leadFeeTierDetailPage?: LeadFeeTierDetailPage;
    private _leadFeeTiersDashboardPage?: LeadFeeTiersDashboardPage;
    private _leadFeeStateManagementDashboardPage?: LeadFeeStateManagementDashboardPage;
    private _vetDashboardPage?: VetDashboardPage;
    private _vetDetailsPage?: VetDetailsPage;
    private _registerPage?: RegisterPage;
    private _denialCodeCreationPage?: DenialCodeCreationPage;
    private _documentLibrarySearchPage?: DocumentLibrarySearchPage;
    private _incidentRulesPage?: IncidentRulesPage;
    private _incidentPage?: IncidentPage;
    private _claimDashboard?: ClaimDashboard;
    private _adjusterProfilePage?: ClaimAdjusterProfilePage;
    private _filingPage?: FilingPage;
    private _stateManagementPage?: StateManagementPage;
    private _filingDetailPage?: FilingDetailPage;

    constructor(page: Page) {
        super(page);
    }

    get loginPage(): LoginPage {
        return this._loginPage ??= new LoginPage(this.page);
    }

    get registerPage(): RegisterPage {
        return this._registerPage ??= new RegisterPage(this.page);
    }

    get mcLeadRegistrationPage(): McLeadRegistrationPage {
        return this._mcLeadRegistrationPage ??= new McLeadRegistrationPage(this.page);
    }

    get mcLeadSearchPage(): McLeadSearchPage {
        return this._mcLeadSearchPage ??= new McLeadSearchPage(this.page);
    }

    get mcLeadDetailsPage(): McLeadDetailsPage {
        return this._mcLeadDetailsPage ??= new McLeadDetailsPage(this.page);
    }

    get breederSearchSection(): BreederSearchSection {
        return this._breederSearchSection ??= new BreederSearchSection(this.page);
    }

    get breederDetailsPage(): BreederDetailsPage {
        return this._breederDetailsPage ??= new BreederDetailsPage(this.page);
    }

    get litterSearchSection(): LitterSearchSection {
        return this._litterSearchSection ??= new LitterSearchSection(this.page);
    }

    get litterDetailsSection(): LitterDetailsSection {
        return this._litterDetailsSection ??= new LitterDetailsSection(this.page);
    }

    get yourBreederPortalPage(): YourBreederPortalPage {
        return this._yourBreederPortalPage ??= new YourBreederPortalPage(this.page);
    }

    get menuTopSection(): MenuTopSection {
        return this._menuTopSection ??= new MenuTopSection(this.page);
    }
    get policyDetailPage(): PolicyDetailPage {
        return this._policyDetailPage ??= new PolicyDetailPage(this.page);
    }

    get claimDashboard(): ClaimDashboard {
        return this._claimDashboard ??= new ClaimDashboard(this.page);
    }
    get claimDetailPage(): ClaimDetailPage {
        return this._claimDetailPage ??= new ClaimDetailPage(this.page);
    }

    get lossDetailPage(): LossDetailPage {
        return this._lossDetailPage ??= new LossDetailPage(this.page);
    }

    get incidentDetailPage(): IncidentDetailPage {
        return this._incidentDetailPage ??= new IncidentDetailPage(this.page);
    }

    get footerSection(): FooterSection {
        return this._footerSection ??= new FooterSection(this.page);
    }

    get pageTableSection(): PageTableSection {
        return this._pageTableSection ??= new PageTableSection(this.page);
    }
    get petTabSection(): PetTabSection {
        return this._petTabSection ??= new PetTabSection(this.page);
    }
    get petDetailPage(): PetDetailPage {
        return this._petDetailPage ??= new PetDetailPage(this.page);
    }

    get userManagementPage(): UserManagementPage {
        return this._userManagementPage ??= new UserManagementPage(this.page);
    }

    get claimCheckReconciliationPage(): ClaimCheckReconciliationPage {
        return this._claimCheckReconciliationPage ??= new ClaimCheckReconciliationPage(this.page);
    }

    get accountDetailPage(): AccountDetailPage {
        return this._accountDetailPage ??= new AccountDetailPage(this.page);
    }

    get quoteDetailsPage(): QuoteDetailsPage {
        return this._quoteDetailsPage ??= new QuoteDetailsPage(this.page);
    }

    get checkManagementPage(): CheckManagementPage {
        return this._checkManagementPage ??= new CheckManagementPage(this.page);
    }

    get financeDashboardPage(): FinanceDashboardPage {
        return this._financeDashboardPage ??= new FinanceDashboardPage(this.page);
    }

    get invoiceDetailsModalWindowPage(): InvoiceDetailsModalWindowPage {
        return this._invoiceDetailsModalWindowPage ??= new InvoiceDetailsModalWindowPage(this.page);
    }

    get renewByPolicyPage(): RenewByPolicyPage {
        return this._renewByPolicyPage ??= new RenewByPolicyPage(this.page);
    }

    get renewPoliciesPage(): RenewPoliciesPage {
        return this._renewPoliciesPage ??= new RenewPoliciesPage(this.page);
    }

    get claimsProcessingPage(): ClaimsProcessingPage {
        return this._claimsProcessingPage ??= new ClaimsProcessingPage(this.page);
    }

    get incidentRulesPage(): IncidentRulesPage {
        return this._incidentRulesPage ??= new IncidentRulesPage(this.page);
    }

    get incidentPage(): IncidentPage {
        return this._incidentPage ??= new IncidentPage(this.page);
    }

    get adminDashboardPage(): AdminDashboardPage {
        return this._adminDashboardPage ??= new AdminDashboardPage(this.page);
    }

    get policyMakeChangesPage(): PolicyMakeChangesPage {
        return this._policyMakeChangesPage ??= new PolicyMakeChangesPage(this.page);
    }

    get editPaymentPage(): EditPaymentPage {
        return this._editPaymentPage ??= new EditPaymentPage(this.page);
    }

    get followUpDetailPage(): FollowUpDetailPage {
        return this._followUpDetailPage ??= new FollowUpDetailPage(this.page);
    }

    get moveClaimDialog(): MoveClaimDialog {
        return this._moveClaimDialog ??= new MoveClaimDialog(this.page);
    }

    get policyCancelPage(): PolicyCancelPage {
        return this._policyCancelPage ??= new PolicyCancelPage(this.page);
    }

    get policyChangesForNewPetPage(): PolicyChangesForNewPetPage {
        return this._policyChangesForNewPetPage ??= new PolicyChangesForNewPetPage(this.page);
    }

    get policySearchSection(): PolicySearchSection {
        return this._policySearchSection ??= new PolicySearchSection(this.page);
    }

    get transferSaleDialog(): TransferSaleDialog {
        return this._transferSaleDialog ??= new TransferSaleDialog(this.page);
    }

    get requestMedicalRecordPage(): RequestMedicalRecordPage {
        return this._requestMedicalRecordPage ??= new RequestMedicalRecordPage(this.page);
    }
    get policyDashboardPage(): PolicyDashboardPage {
        return this._policyDashboardPage ??= new PolicyDashboardPage(this.page);
    }

    get vetDashboardPage(): VetDashboardPage {
        return this._vetDashboardPage ??= new VetDashboardPage(this.page);
    }

    get vetDetailsPage(): VetDetailsPage {
        return this._vetDetailsPage ??= new VetDetailsPage(this.page);
    }
    // Quote API pages
    get quoteApiPage(): QuoteApiPage {
        return this._quoteApiPage ??= new QuoteApiPage(this.page);
    }

    get quoteApiPetCreationPage(): QuoteApiPetCreationPage {
        return this._quoteApiPetCreationPage ??= new QuoteApiPetCreationPage(this.page);
    }

    get quoteApiCustomInfoPage(): QuoteApiCustomInfoPage {
        return this._quoteApiCustomInfoPage ??= new QuoteApiCustomInfoPage(this.page);
    }

    get quoteApiBillingPage(): QuoteApiBillingPage {
        return this._quoteApiBillingPage ??= new QuoteApiBillingPage(this.page);
    }

    get customerDetailPage(): CustomerDetailPage {
        return this._customerDetailPage ??= new CustomerDetailPage(this.page);
    }

    get partnersPage(): PartnersPage {
        return this._partnersPage ??= new PartnersPage(this.page);
    }

    get partnerDetailOverviewPage(): PartnerDetailOverviewPage {
        return this._partnerDetailOverviewPage ??= new PartnerDetailOverviewPage(this.page);
    }

    get groupBillingPage(): GroupBillingPage {
        return this._groupBillingPage ??= new GroupBillingPage(this.page);
    }

    get groupBillingDetailPage(): GroupBillingDetailPage {
        return this._groupBillingDetailPage ??= new GroupBillingDetailPage(this.page);
    }

    get affiliateDashboardPage(): AffiliateDashboardPage {
        return this._affiliateDashboardPage ??= new AffiliateDashboardPage(this.page);
    }

    get addAffiliatePage(): AddAffiliatePage {
        return this._addAffiliatePage ??= new AddAffiliatePage(this.page);
    }

    get leadFeeTierDetailPage(): LeadFeeTierDetailPage {
        return this._leadFeeTierDetailPage ??= new LeadFeeTierDetailPage(this.page);
    }

    get leadFeeTiersDashboardPage(): LeadFeeTiersDashboardPage {
        return this._leadFeeTiersDashboardPage ??= new LeadFeeTiersDashboardPage(this.page);
    }

    get leadFeeStateManagementDashboardPage(): LeadFeeStateManagementDashboardPage {
        return this._leadFeeStateManagementDashboardPage ??= new LeadFeeStateManagementDashboardPage(this.page);
    }

    get denialCodeCreationPage(): DenialCodeCreationPage {
        return this._denialCodeCreationPage ??= new DenialCodeCreationPage(this.page);
    }

    get documentLibrarySearchPage(): DocumentLibrarySearchPage {
        return this._documentLibrarySearchPage ??= new DocumentLibrarySearchPage(this.page);
    }

    get adjusterProfilePage(): ClaimAdjusterProfilePage {
        return this._adjusterProfilePage ??= new ClaimAdjusterProfilePage(this.page);
    }

    get filingPage(): FilingPage {
        return this._filingPage ??= new FilingPage(this.page);
    }

    get stateManagementPage(): StateManagementPage {
        return this._stateManagementPage ??= new StateManagementPage(this.page);
    }

    get filingDetailPage(): FilingDetailPage {
        return this._filingDetailPage ??= new FilingDetailPage(this.page);
    }
    /**
     * Create a new manager for a different page (e.g., new tab)
     * @param newPage - The new page instance
     * @returns New OrcaPageManager instance
     */
    forPage(newPage: Page): OrcaPageManager {
        return new OrcaPageManager(newPage);
    }
}