import { BasePage } from '@pages/base-page';
import { ClaimProcessingClaimInfoPage } from './claim-processing-claim-info-page';

import { ClaimDetailPage } from './claim-detail-page';
import { ClaimPreprocessingPage } from './claim-preprocessing-page';
import { ClaimProcessingPage } from './claim-processing-page';
import { ClaimSearchPage } from './claim-search-page';
import { TopClaimSection } from './top-claim-section';
import { LoadingCoverBarSection } from '../common/loading-cover-bar-section';

export class ClaimPage extends BasePage {
    topClaimSection = new TopClaimSection(this.page);
    claimDetailPage = new ClaimDetailPage(this.page);
    claimProcessingClaimInfoPage = new ClaimProcessingClaimInfoPage(this.page);
    claimPreprocessingPage = new ClaimPreprocessingPage(this.page);
    claimProcessingPage = new ClaimProcessingPage(this.page);
    claimSearchPage = new ClaimSearchPage(this.page);
    loadingCoverBarSection = new LoadingCoverBarSection(this.page);

    
}

