import { GroupCertificateDashboardPage } from '@pages/orca-group/certificate/group-certificate-dashboard-page';
import { GroupCertificateDetailPage } from '@pages/orca-group/certificate/group-certificate-detail-page';
import { GroupFollowupDetailPage } from '@pages/orca-group/certificate/group-followup-detail-page';
import { GroupClaimDetailsPage } from '@pages/orca-group/claim/group-claim-details-page';
import { GroupRequestMedicalRecordPage } from '@pages/orca-group/claim/group-claim-medical-record-page';
import { MenuSectionsGroup } from '@pages/orca-group/common-section/menu-sections-group';
import { GroupLossDetailsPage } from '@pages/orca-group/group-loss-details-page';
import { GroupPetCoverageInfoPage } from '@pages/orca-group/group-pet-coverage-info-page';
import { GroupPetDetailPage } from '@pages/orca-group/group-pet-detail-page';
import { FooterSection } from '@pages/orca/common-section/footer-section';
import { GroupClaimDashboard } from './../orca-group/claim/group-claim-dashboard';
import { GroupClaimSearch } from './../orca-group/claim/group-claim-search';
import { BasePageManager } from './base-page-manager';

import { Page } from '@playwright/test';

export class OrcaGroupPageManager extends BasePageManager {
    readonly menuSectionsGroup: MenuSectionsGroup;
    readonly groupPetCoverageInfoPage: GroupPetCoverageInfoPage;
    readonly groupLossDetailsPage: GroupLossDetailsPage;
    readonly groupClaimDetailsPage: GroupClaimDetailsPage;
    readonly groupClaimDashboard: GroupClaimDashboard;
    readonly groupClaimSearch: GroupClaimSearch;
    readonly groupCertificateDashboardPage: GroupCertificateDashboardPage;
    readonly groupCertificateDetailPage: GroupCertificateDetailPage;
    readonly groupFollowupDetailPage: GroupFollowupDetailPage;
    readonly groupClaimMedicalRecordPage: GroupRequestMedicalRecordPage;
    readonly groupPetDetailPage: GroupPetDetailPage;
    readonly footerSection: FooterSection;

    constructor(page: Page) {
        super(page);
        this.menuSectionsGroup = new MenuSectionsGroup(page);
        this.groupPetCoverageInfoPage = new GroupPetCoverageInfoPage(page);
        this.groupLossDetailsPage = new GroupLossDetailsPage(page);
        this.groupClaimDetailsPage = new GroupClaimDetailsPage(page);
        this.groupClaimSearch = new GroupClaimSearch(page);
        this.groupClaimDashboard = new GroupClaimDashboard(page);
        this.groupCertificateDashboardPage = new GroupCertificateDashboardPage(page);
        this.groupCertificateDetailPage = new GroupCertificateDetailPage(page);
        this.groupFollowupDetailPage = new GroupFollowupDetailPage(page);
        this.groupClaimMedicalRecordPage = new GroupRequestMedicalRecordPage(page);
        this.groupPetDetailPage = new GroupPetDetailPage(page);
        this.footerSection = new FooterSection(page);
    }

    /**
     * Create a new manager for a different page (e.g., new tab)
     * @param newPage - The new page instance
     * @returns New OrcaGroupPageManager instance
     */
    forPage(newPage: Page): OrcaGroupPageManager {
        return new OrcaGroupPageManager(newPage);
    }
}
