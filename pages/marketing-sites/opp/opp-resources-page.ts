import { Button } from '@controls/button';
import { Link } from '@controls/link';
import { BasePage } from '@pages/base-page';

export class OppResourcesPage extends BasePage {

    // Main navigation
    resourcesNavLink = new Link(this.page, this.page.getByRole('link', { name: 'Resources', exact: true }));

    // Resources sub-navigation
    videosSubNavLink = new Link(this.page, this.page.getByRole('link', { name: 'Videos', exact: true }));
    researchSubNavLink = new Link(this.page, this.page.getByRole('link', { name: 'Research and Guides', exact: true }));

    // Blogs section — scoped to main, href unique per section. .first() deduplicates desktop/mobile DOM copies
    blogsViewAllLink = new Link(this.page,
        this.page.locator('main').locator('a[href="/resources/blog/"]').filter({ hasText: 'View All' }).first());
    blogReadMoreLink = new Link(this.page, this.page.getByRole('link', { name: 'Read More' }).first());
    viewMoreBlogsLink = new Link(this.page, this.page.getByRole('link', { name: 'View More Blogs' }));

    // Case Studies section — scoped to main, href unique per section. .first() deduplicates desktop/mobile DOM copies
    caseStudiesViewAllLink = new Link(this.page,
        this.page.locator('main').locator('a[href="/resources/case-studies/"]').filter({ hasText: 'View All' }).first());
    caseStudyReadMoreLink = new Link(this.page, this.page.getByRole('link', { name: 'Read More' }).first());
    caseStudyDownloadPdfLink = new Link(this.page, this.page.getByRole('link', { name: 'Download the PDF Here (opens' }));
    viewMoreCaseStudiesLink = new Link(this.page, this.page.getByRole('link', { name: 'View More Case Studies' }));

    // Videos section (navigate via videosSubNavLink first)
    watchVideoLink = new Link(this.page, this.page.getByRole('link', { name: 'Watch Video' }));
    playVideoButton = new Button(this.page, '//*[@class="play-video-label"]');
    viewMoreVideosLink = new Link(this.page, this.page.getByRole('link', { name: 'View More Videos' }));

    // Research & Guides section (navigate via researchSubNavLink first)
    downloadPdfLink = new Link(this.page, this.page.getByRole('link', { name: 'Download PDF' }));
    viewMoreResearchLink = new Link(this.page, this.page.getByRole('link', { name: 'View More Research and Guides' }));
}
