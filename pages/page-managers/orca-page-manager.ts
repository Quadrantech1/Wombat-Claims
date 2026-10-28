import { AdminDashboardScreen } from '@pages/orca/admin/admin-dashboard-page';
import { AccountDetailScreen } from '@pages/orca/admin/admin-dashboard/account-detail-page';
import { UserManagementScreen } from '@pages/orca/admin/admin-dashboard/user-management-page';
import { ClaimsProcessingScreen } from '@pages/orca/admin/claims/claims-processing-page';
import { DenialCodeCreationScreen } from '@pages/orca/admin/claims/denial-code-creation-page';
import { IncidentScreen } from '@pages/orca/admin/claims/incident-page';
import { IncidentRulesScreen } from '@pages/orca/admin/claims/incident-rules-page';
import { DocumentLibrarySearchScreen } from '@pages/orca/admin/document-management/document-library-search-page';
import { FilingScreen } from '@pages/orca/admin/filing/filing-page';
import { StateManagementScreen } from '@pages/orca/admin/product-management/state-management-page';
import { QuoteApiBillingScreen } from '@pages/orca/admin/quote-api/quote-api-billing-page';
import { QuoteApiCustomInfoScreen } from '@pages/orca/admin/quote-api/quote-api-customer-info-page';
import { QuoteApiScreen } from '@pages/orca/admin/quote-api/quote-api-page';
import { QuoteApiPetCreationScreen } from '@pages/orca/admin/quote-api/quote-api-pet-creation-page';
import { AddAffiliateScreen } from '@pages/orca/affiliate/add-affiliate-page';
import { AffiliateDashboardScreen } from '@pages/orca/affiliate/affiliate-dashboard-page';
import { LeadFeeStateManagementDashboardScreen } from '@pages/orca/affiliate/lead-fee-state-management-dashboard-page';
import { LeadFeeTierDetailScreen } from '@pages/orca/affiliate/lead-fee-tier-detail-page';
import { LeadFeeTiersDashboardScreen } from '@pages/orca/affiliate/lead-fee-tiers-dashboard-page';
import { BreederDetailsScreen } from '@pages/orca/breeder/breeder-details-page';
import { BreederSearchPanel } from '@pages/orca/breeder/breeder-search-section';
import { LitterDetailsPanel } from '@pages/orca/breeder/litter-details-section';
import { LitterSearchPanel } from '@pages/orca/breeder/litter-search-section';
import { YourBreederPortalScreen } from '@pages/orca/breeder/your-breeder-portal-page';
import { ClaimAdjusterProfileScreen } from '@pages/orca/claim/adjuster-profile-page';
import { ClaimDashboardScreen } from '@pages/orca/claim/claim-dashboard';
import { ClaimDetailScreen } from '@pages/orca/claim/claim-detail-page';
import { RequestMedicalRecordScreen } from '@pages/orca/claim/request-medical-record-page';
import { FooterPanel } from '@pages/orca/common-section/footer-section';
import { MenuTopPanel } from '@pages/orca/common-section/menu-top-section';
import { PageTablePanel } from '@pages/orca/common-section/page-table-section';
import { CustomerDetailScreen } from '@pages/orca/customer/customer-detail-page';
import { CheckManagementScreen } from '@pages/orca/finance/check-management-page';
import { ClaimCheckReconciliationScreen } from '@pages/orca/finance/claim-check-reconciliation-page';
import { FinanceDashboardScreen } from '@pages/orca/finance/finance-dashboard-page';
import { InvoiceDetailsModalWindowScreen } from '@pages/orca/finance/invoice-details-modal-window-page';
import { RenewByPolicyScreen } from '@pages/orca/finance/renew-by-policy-page';
import { RenewPoliciesScreen } from '@pages/orca/finance/renew-policies-page';
import { LoginScreen } from '@pages/orca/login/login-page';
import { RegisterScreen } from '@pages/orca/login/register-page';
import { IncidentDetailScreen } from '@pages/orca/loss/incident-detail-page';
import { LossDetailScreen } from '@pages/orca/loss/loss-detail-page';
import { McLeadDetailsScreen } from '@pages/orca/mclead/mclead-details-page';
import { McLeadRegistrationScreen } from '@pages/orca/mclead/mclead-registration-page';
import { McLeadSearchScreen } from '@pages/orca/mclead/mclead-search-page';
import { GroupBillingDetailScreen } from '@pages/orca/partner/group-billing-detail-page';
import { GroupBillingScreen } from '@pages/orca/partner/group-billing-page';
import { PartnerDetailOverviewScreen } from '@pages/orca/partner/partner-detail-overview-page';
import { PartnersScreen } from '@pages/orca/partner/partners-page';
import { PetDetailScreen } from '@pages/orca/pet/pet-detail-page';
import { EditPaymentScreen } from '@pages/orca/policy/edit-payment-page';
import { FollowUpDetailScreen } from '@pages/orca/policy/follow-up-detail-page';
import { MoveClaimPrompt } from '@pages/orca/policy/move-claim-dialog';
import { PolicyCancelScreen } from '@pages/orca/policy/policy-cancel-page';
import { PolicyChangesForNewPetScreen } from '@pages/orca/policy/policy-changes-for-new-pet-page';
import { PolicyDashboardScreen } from '@pages/orca/policy/policy-dashboard-page';
import { PolicyDetailScreen } from '@pages/orca/policy/policy-detail-page';
import { PolicyMakeChangesScreen } from '@pages/orca/policy/policy-make-changes-page';
import { PolicySearchPanel } from '@pages/orca/policy/policy-search-section';
import { PetTabPanel } from '@pages/orca/policy/tabs-policy-detail/pet-tab-section';
import { TransferSalePrompt } from '@pages/orca/policy/transfer-sale-dialog';
import { QuoteDetailsScreen } from '@pages/orca/quote/quote-details-page';
import { VetDashboardScreen } from '@pages/orca/vet/vet-dashboard-page';
import { VetDetailsScreen } from '@pages/orca/vet/vet-details-page';
import { Page } from '@playwright/test';
import { FilingDetailScreen } from '../orca/admin/product-management/filing-detail-page';
import { BasePageManager } from './base-page-manager';

export class OrcaScreenManager extends BasePageManager {

    private _loginPage?: LoginScreen;
    private _menuTopSection?: MenuTopPanel;
    private _policyDetailPage?: PolicyDetailScreen;
    private _claimDetailPage?: ClaimDetailScreen;
    private _mcLeadRegistrationPage?: McLeadRegistrationScreen;
    private _mcLeadSearchPage?: McLeadSearchScreen;
    private _mcLeadDetailsPage?: McLeadDetailsScreen;
    private _breederSearchSection?: BreederSearchPanel;
    private _breederDetailsPage?: BreederDetailsScreen;
    private _litterSearchSection?: LitterSearchPanel;
    private _litterDetailsSection?: LitterDetailsPanel;
    private _yourBreederPortalPage?: YourBreederPortalScreen;
    private _lossDetailPage?: LossDetailScreen;
    private _incidentDetailPage?: IncidentDetailScreen;
    private _footerSection?: FooterPanel;
    private _pageTableSection?: PageTablePanel;
    private _petTabSection?: PetTabPanel;
    private _petDetailPage?: PetDetailScreen;
    private _userManagementPage?: UserManagementScreen;
    private _accountDetailPage?: AccountDetailScreen;
    private _quoteDetailsPage?: QuoteDetailsScreen;
    private _claimsProcessingPage?: ClaimsProcessingScreen;
    private _checkManagementPage?: CheckManagementScreen;
    private _claimCheckReconciliationPage?: ClaimCheckReconciliationScreen;
    private _financeDashboardPage?: FinanceDashboardScreen;
    private _invoiceDetailsModalWindowPage?: InvoiceDetailsModalWindowScreen;
    private _renewByPolicyPage?: RenewByPolicyScreen;
    private _renewPoliciesPage?: RenewPoliciesScreen;
    private _quoteApiPage?: QuoteApiScreen;
    private _quoteApiPetCreationPage?: QuoteApiPetCreationScreen;
    private _quoteApiCustomInfoPage?: QuoteApiCustomInfoScreen;
    private _quoteApiBillingPage?: QuoteApiBillingScreen;
    private _adminDashboardPage?: AdminDashboardScreen;
    private _policyMakeChangesPage?: PolicyMakeChangesScreen;
    private _editPaymentPage?: EditPaymentScreen;
    private _followUpDetailPage?: FollowUpDetailScreen;
    private _moveClaimDialog?: MoveClaimPrompt;
    private _policyCancelPage?: PolicyCancelScreen;
    private _policyChangesForNewPetPage?: PolicyChangesForNewPetScreen;
    private _policySearchSection?: PolicySearchPanel;
    private _transferSaleDialog?: TransferSalePrompt;
    private _requestMedicalRecordPage?: RequestMedicalRecordScreen;
    private _policyDashboardPage?: PolicyDashboardScreen;
    private _customerDetailPage?: CustomerDetailScreen;
    private _partnersPage?: PartnersScreen;
    private _partnerDetailOverviewPage?: PartnerDetailOverviewScreen;
    private _groupBillingPage?: GroupBillingScreen;
    private _groupBillingDetailPage?: GroupBillingDetailScreen;
    private _affiliateDashboardPage?: AffiliateDashboardScreen;
    private _addAffiliatePage?: AddAffiliateScreen;
    private _leadFeeTierDetailPage?: LeadFeeTierDetailScreen;
    private _leadFeeTiersDashboardPage?: LeadFeeTiersDashboardScreen;
    private _leadFeeStateManagementDashboardPage?: LeadFeeStateManagementDashboardScreen;
    private _vetDashboardPage?: VetDashboardScreen;
    private _vetDetailsPage?: VetDetailsScreen;
    private _registerPage?: RegisterScreen;
    private _denialCodeCreationPage?: DenialCodeCreationScreen;
    private _documentLibrarySearchPage?: DocumentLibrarySearchScreen;
    private _incidentRulesPage?: IncidentRulesScreen;
    private _incidentPage?: IncidentScreen;
    private _claimDashboard?: ClaimDashboardScreen;
    private _adjusterProfilePage?: ClaimAdjusterProfileScreen;
    private _filingPage?: FilingScreen;
    private _stateManagementPage?: StateManagementScreen;
    private _filingDetailPage?: FilingDetailScreen;

    constructor(page: Page) {
        super(page);
    }

    get loginPage(): LoginScreen {
        return this._loginPage ??= new LoginScreen(this.page);
    }

    get registerPage(): RegisterScreen {
        return this._registerPage ??= new RegisterScreen(this.page);
    }

    get mcLeadRegistrationPage(): McLeadRegistrationScreen {
        return this._mcLeadRegistrationPage ??= new McLeadRegistrationScreen(this.page);
    }

    get mcLeadSearchPage(): McLeadSearchScreen {
        return this._mcLeadSearchPage ??= new McLeadSearchScreen(this.page);
    }

    get mcLeadDetailsPage(): McLeadDetailsScreen {
        return this._mcLeadDetailsPage ??= new McLeadDetailsScreen(this.page);
    }

    get breederSearchSection(): BreederSearchPanel {
        return this._breederSearchSection ??= new BreederSearchPanel(this.page);
    }

    get breederDetailsPage(): BreederDetailsScreen {
        return this._breederDetailsPage ??= new BreederDetailsScreen(this.page);
    }

    get litterSearchSection(): LitterSearchPanel {
        return this._litterSearchSection ??= new LitterSearchPanel(this.page);
    }

    get litterDetailsSection(): LitterDetailsPanel {
        return this._litterDetailsSection ??= new LitterDetailsPanel(this.page);
    }

    get yourBreederPortalPage(): YourBreederPortalScreen {
        return this._yourBreederPortalPage ??= new YourBreederPortalScreen(this.page);
    }

    get menuTopSection(): MenuTopPanel {
        return this._menuTopSection ??= new MenuTopPanel(this.page);
    }
    get policyDetailPage(): PolicyDetailScreen {
        return this._policyDetailPage ??= new PolicyDetailScreen(this.page);
    }

    get claimDashboard(): ClaimDashboardScreen {
        return this._claimDashboard ??= new ClaimDashboardScreen(this.page);
    }
    get claimDetailPage(): ClaimDetailScreen {
        return this._claimDetailPage ??= new ClaimDetailScreen(this.page);
    }

    get lossDetailPage(): LossDetailScreen {
        return this._lossDetailPage ??= new LossDetailScreen(this.page);
    }

    get incidentDetailPage(): IncidentDetailScreen {
        return this._incidentDetailPage ??= new IncidentDetailScreen(this.page);
    }

    get footerSection(): FooterPanel {
        return this._footerSection ??= new FooterPanel(this.page);
    }

    get pageTableSection(): PageTablePanel {
        return this._pageTableSection ??= new PageTablePanel(this.page);
    }
    get petTabSection(): PetTabPanel {
        return this._petTabSection ??= new PetTabPanel(this.page);
    }
    get petDetailPage(): PetDetailScreen {
        return this._petDetailPage ??= new PetDetailScreen(this.page);
    }

    get userManagementPage(): UserManagementScreen {
        return this._userManagementPage ??= new UserManagementScreen(this.page);
    }

    get claimCheckReconciliationPage(): ClaimCheckReconciliationScreen {
        return this._claimCheckReconciliationPage ??= new ClaimCheckReconciliationScreen(this.page);
    }

    get accountDetailPage(): AccountDetailScreen {
        return this._accountDetailPage ??= new AccountDetailScreen(this.page);
    }

    get quoteDetailsPage(): QuoteDetailsScreen {
        return this._quoteDetailsPage ??= new QuoteDetailsScreen(this.page);
    }

    get checkManagementPage(): CheckManagementScreen {
        return this._checkManagementPage ??= new CheckManagementScreen(this.page);
    }

    get financeDashboardPage(): FinanceDashboardScreen {
        return this._financeDashboardPage ??= new FinanceDashboardScreen(this.page);
    }

    get invoiceDetailsModalWindowPage(): InvoiceDetailsModalWindowScreen {
        return this._invoiceDetailsModalWindowPage ??= new InvoiceDetailsModalWindowScreen(this.page);
    }

    get renewByPolicyPage(): RenewByPolicyScreen {
        return this._renewByPolicyPage ??= new RenewByPolicyScreen(this.page);
    }

    get renewPoliciesPage(): RenewPoliciesScreen {
        return this._renewPoliciesPage ??= new RenewPoliciesScreen(this.page);
    }

    get claimsProcessingPage(): ClaimsProcessingScreen {
        return this._claimsProcessingPage ??= new ClaimsProcessingScreen(this.page);
    }

    get incidentRulesPage(): IncidentRulesScreen {
        return this._incidentRulesPage ??= new IncidentRulesScreen(this.page);
    }

    get incidentPage(): IncidentScreen {
        return this._incidentPage ??= new IncidentScreen(this.page);
    }

    get adminDashboardPage(): AdminDashboardScreen {
        return this._adminDashboardPage ??= new AdminDashboardScreen(this.page);
    }

    get policyMakeChangesPage(): PolicyMakeChangesScreen {
        return this._policyMakeChangesPage ??= new PolicyMakeChangesScreen(this.page);
    }

    get editPaymentPage(): EditPaymentScreen {
        return this._editPaymentPage ??= new EditPaymentScreen(this.page);
    }

    get followUpDetailPage(): FollowUpDetailScreen {
        return this._followUpDetailPage ??= new FollowUpDetailScreen(this.page);
    }

    get moveClaimDialog(): MoveClaimPrompt {
        return this._moveClaimDialog ??= new MoveClaimPrompt(this.page);
    }

    get policyCancelPage(): PolicyCancelScreen {
        return this._policyCancelPage ??= new PolicyCancelScreen(this.page);
    }

    get policyChangesForNewPetPage(): PolicyChangesForNewPetScreen {
        return this._policyChangesForNewPetPage ??= new PolicyChangesForNewPetScreen(this.page);
    }

    get policySearchSection(): PolicySearchPanel {
        return this._policySearchSection ??= new PolicySearchPanel(this.page);
    }

    get transferSaleDialog(): TransferSalePrompt {
        return this._transferSaleDialog ??= new TransferSalePrompt(this.page);
    }

    get requestMedicalRecordPage(): RequestMedicalRecordScreen {
        return this._requestMedicalRecordPage ??= new RequestMedicalRecordScreen(this.page);
    }
    get policyDashboardPage(): PolicyDashboardScreen {
        return this._policyDashboardPage ??= new PolicyDashboardScreen(this.page);
    }

    get vetDashboardPage(): VetDashboardScreen {
        return this._vetDashboardPage ??= new VetDashboardScreen(this.page);
    }

    get vetDetailsPage(): VetDetailsScreen {
        return this._vetDetailsPage ??= new VetDetailsScreen(this.page);
    }
    // Quote API pages
    get quoteApiPage(): QuoteApiScreen {
        return this._quoteApiPage ??= new QuoteApiScreen(this.page);
    }

    get quoteApiPetCreationPage(): QuoteApiPetCreationScreen {
        return this._quoteApiPetCreationPage ??= new QuoteApiPetCreationScreen(this.page);
    }

    get quoteApiCustomInfoPage(): QuoteApiCustomInfoScreen {
        return this._quoteApiCustomInfoPage ??= new QuoteApiCustomInfoScreen(this.page);
    }

    get quoteApiBillingPage(): QuoteApiBillingScreen {
        return this._quoteApiBillingPage ??= new QuoteApiBillingScreen(this.page);
    }

    get customerDetailPage(): CustomerDetailScreen {
        return this._customerDetailPage ??= new CustomerDetailScreen(this.page);
    }

    get partnersPage(): PartnersScreen {
        return this._partnersPage ??= new PartnersScreen(this.page);
    }

    get partnerDetailOverviewPage(): PartnerDetailOverviewScreen {
        return this._partnerDetailOverviewPage ??= new PartnerDetailOverviewScreen(this.page);
    }

    get groupBillingPage(): GroupBillingScreen {
        return this._groupBillingPage ??= new GroupBillingScreen(this.page);
    }

    get groupBillingDetailPage(): GroupBillingDetailScreen {
        return this._groupBillingDetailPage ??= new GroupBillingDetailScreen(this.page);
    }

    get affiliateDashboardPage(): AffiliateDashboardScreen {
        return this._affiliateDashboardPage ??= new AffiliateDashboardScreen(this.page);
    }

    get addAffiliatePage(): AddAffiliateScreen {
        return this._addAffiliatePage ??= new AddAffiliateScreen(this.page);
    }

    get leadFeeTierDetailPage(): LeadFeeTierDetailScreen {
        return this._leadFeeTierDetailPage ??= new LeadFeeTierDetailScreen(this.page);
    }

    get leadFeeTiersDashboardPage(): LeadFeeTiersDashboardScreen {
        return this._leadFeeTiersDashboardPage ??= new LeadFeeTiersDashboardScreen(this.page);
    }

    get leadFeeStateManagementDashboardPage(): LeadFeeStateManagementDashboardScreen {
        return this._leadFeeStateManagementDashboardPage ??= new LeadFeeStateManagementDashboardScreen(this.page);
    }

    get denialCodeCreationPage(): DenialCodeCreationScreen {
        return this._denialCodeCreationPage ??= new DenialCodeCreationScreen(this.page);
    }

    get documentLibrarySearchPage(): DocumentLibrarySearchScreen {
        return this._documentLibrarySearchPage ??= new DocumentLibrarySearchScreen(this.page);
    }

    get adjusterProfilePage(): ClaimAdjusterProfileScreen {
        return this._adjusterProfilePage ??= new ClaimAdjusterProfileScreen(this.page);
    }

    get filingPage(): FilingScreen {
        return this._filingPage ??= new FilingScreen(this.page);
    }

    get stateManagementPage(): StateManagementScreen {
        return this._stateManagementPage ??= new StateManagementScreen(this.page);
    }

    get filingDetailPage(): FilingDetailScreen {
        return this._filingDetailPage ??= new FilingDetailScreen(this.page);
    }
    /**
     * Create a new manager for a different page (e.g., new tab)
     * @param newPage - The new page instance
     * @returns New OrcaPageManager instance
     */
    withPage(newPage: Page): OrcaScreenManager {
        return new OrcaScreenManager(newPage);
    }
}