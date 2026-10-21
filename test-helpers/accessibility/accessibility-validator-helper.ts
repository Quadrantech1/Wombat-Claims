import AxeBuilder from '@axe-core/playwright';
import { Page } from '@playwright/test';
import { logger } from '@utils/logger-util';
import { AccessibilityValidatorBuilder } from './accessibility-validator-builder';


export const ACCESSIBILITY_TAGS = {
    WCAG_2A: 'wcag2a',
    WCAG_2AA: 'wcag2aa',
    WCAG_21A: 'wcag21a',
    WCAG_21AA: 'wcag21aa',
    SECTION_508: 'section508',
    BEST_PRACTICE: 'best-practice'
} as const;

export const ACCESSIBILITY_TAG_SETS = {
    STANDARD: [
        ACCESSIBILITY_TAGS.WCAG_2A,
        ACCESSIBILITY_TAGS.WCAG_2AA,
        ACCESSIBILITY_TAGS.WCAG_21A,
        ACCESSIBILITY_TAGS.WCAG_21AA
    ],
    COMPREHENSIVE: [
        ACCESSIBILITY_TAGS.WCAG_2A,
        ACCESSIBILITY_TAGS.WCAG_2AA,
        ACCESSIBILITY_TAGS.WCAG_21A,
        ACCESSIBILITY_TAGS.WCAG_21AA,
        ACCESSIBILITY_TAGS.SECTION_508,
        ACCESSIBILITY_TAGS.BEST_PRACTICE
    ],
    GOVERNMENT: [
        ACCESSIBILITY_TAGS.WCAG_2A,
        ACCESSIBILITY_TAGS.WCAG_2AA,
        ACCESSIBILITY_TAGS.SECTION_508
    ]
} as const;

/**
 * validation for accessibility using axe-core
 * we are able to add more specific validations as needed
 */
export class AccessibilityValidatorHelper {

    private page: Page;
    private focusableSelectors: string;

    private excludeSelectors: string[];
    private enableFullScan: boolean;

    private tabFocusableSelectors: string;
    private enableKeyboardNavigation: boolean;
    private enableElementScan: boolean;
    private enableAccessibleNameCheck: boolean;
    private enableCheckboxValidation: boolean;
    private enableLinkValidation: boolean;
    private enableRadioButtonValidation: boolean;
    private tags: string[]; // 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'section508', 'best-practice'

    constructor(builder: AccessibilityValidatorBuilder) {
        this.page = builder.page;
        this.focusableSelectors = builder.focusableSelectors;
        this.tabFocusableSelectors = builder.tabFocusableSelectors;
        this.excludeSelectors = builder.excludeSelectors;
        this.enableFullScan = builder.enableFullScan;
        this.enableKeyboardNavigation = builder.enableKeyboardNavigation;
        this.enableElementScan = builder.enableElementScan;
        this.enableAccessibleNameCheck = builder.enableAccessibleNameCheck;
        this.enableCheckboxValidation = builder.enableCheckboxValidation;
        this.enableLinkValidation = builder.enableLinkValidation;
        this.enableRadioButtonValidation = builder.enableRadioButtonValidation;
        this.tags = builder.tags;
    }

    /** Run all the validation */
    async validate() {
        logger.info(`[AccessibilityValidatorHelper.validate] - starting accessibility on page: ${this.page.url()}`);
        const report: any = { url: await this.page.url(), results: {} };

        if (this.enableFullScan) {
            report.results.fullScan = await this.runFullScan();
        }
        if (this.enableKeyboardNavigation) {
            report.results.keyboardNavigation = await this.validateKeyboardNavigation();
        }
        if (this.enableAccessibleNameCheck) {
            report.results.accessibleNames = await this.checkAccessibleNames();
        }
        if (this.enableElementScan) {
            report.results.elementScan = await this.runElementScan();
        }
        if (this.enableCheckboxValidation) {
            report.results.checkboxes = await this.validateCheckboxes();
        }
        if (this.enableLinkValidation) {
            report.results.links = await this.validateLinks();
        }
        if (this.enableRadioButtonValidation) {
            report.results.radioButtons = await this.validateRadioButtons();
        }

        logger.info(`[AccessibilityValidatorHelper.validate] - completed accessibility on page: ${this.page.url()}`);
        return report;
    }

    // validation for checkboxes
    private async validateCheckboxes() {
        logger.info(`[AccessibilityValidatorHelper.validateCheckboxes] - starting validation for checkboxes`);
        const checkboxes = this.page.locator('input[type="checkbox"]');
        const count = await checkboxes.count();
        let results: any[] = [];
        for (let i = 0; i < count; i++) {
            const checkbox = checkboxes.nth(i);
            if (!(await checkbox.isVisible())) continue;
            const checked = await checkbox.isChecked();
            const enabled = await checkbox.isEnabled();
            const selector = await this.generateElementSelector(checkbox);
            let scan = null;
            try {
                scan = await new AxeBuilder({ page: this.page }).include(selector).analyze();
                if (scan.violations.length > 0) {
                    logger.warning(`[AccessibilityValidatorHelper.validateCheckboxes] - violations found for checkbox: ${selector}`, scan.violations);
                }
            } catch (err) {
                logger.error(`[AccessibilityValidatorHelper.validateCheckboxes] - error scanning checkbox: ${selector}`, err);
            }
            results.push({ selector, checked, enabled, scan });
        }
        logger.info(`[AccessibilityValidatorHelper.validateCheckboxes] - completed validation for checkboxes`);
        return results;
    }

    // validation for links
    private async validateLinks() {
        logger.info(`[AccessibilityValidatorHelper.validateLinks] - starting validation for links`);
        const links = this.page.locator('a');
        const count = await links.count();
        let results: any[] = [];
        for (let i = 0; i < count; i++) {
            const link = links.nth(i);
            if (!(await link.isVisible())) continue;
            const href = await link.getAttribute('href');
            const selector = await this.generateElementSelector(link);
            let scan = null;
            try {
                scan = await new AxeBuilder({ page: this.page }).include(selector).analyze();
                if (scan.violations.length > 0) {
                    logger.warning(`[AccessibilityValidatorHelper.validateLinks] - violations found for link: ${selector}`, scan.violations);
                }
            } catch (err) {
                logger.error(`[AccessibilityValidatorHelper.validateLinks] - error scanning link: ${selector}`, err);
            }
            results.push({ selector, href, scan });
        }
        logger.info(`[AccessibilityValidatorHelper.validateLinks] - completed validation for links`);
        return results;
    }

    // validation for radio buttons
    private async validateRadioButtons() {
        logger.info(`[AccessibilityValidatorHelper.validateRadioButtons] - starting validation for radio buttons`);
        const radios = this.page.locator('input[type="radio"]');
        const count = await radios.count();
        let results: any[] = [];
        for (let i = 0; i < count; i++) {
            const radio = radios.nth(i);
            if (!(await radio.isVisible())) continue;
            const checked = await radio.isChecked();
            const enabled = await radio.isEnabled();
            const selector = await this.generateElementSelector(radio);
            let scan = null;
            try {
                scan = await new AxeBuilder({ page: this.page }).include(selector).analyze();
                if (scan.violations.length > 0) {
                    logger.warning(`[AccessibilityValidatorHelper.validateRadioButtons] - violations found for radio button: ${selector}`, scan.violations);
                }
            } catch (err) {
                logger.error(`[AccessibilityValidatorHelper.validateRadioButtons] - error scanning radio button: ${selector}`, err);
            }
            results.push({ selector, checked, enabled, scan });
        }
        logger.info(`[AccessibilityValidatorHelper.validateRadioButtons] - completed validation for radio buttons`);
        return results;
    }

    // complete AXE scan
    private async runFullScan() {
        logger.info(`[AccessibilityValidatorHelper.runFullScan] - starting global AXE scan...`);
        const builder = new AxeBuilder({ page: this.page })
            .exclude(this.excludeSelectors);
        if (this.tags && this.tags.length > 0) {
            builder.withTags(this.tags);
        }
        const scan = await builder.analyze();

        if (scan.violations.length > 0) {
            logger.warning(`[AccessibilityValidatorHelper.runFullScan] - accessibility violations found:`, scan.violations);
        }
        logger.info(`[AccessibilityValidatorHelper.runFullScan] - completed global AXE scan`);
        return scan;
    }

    // validation navigation with keyboard
    private async validateKeyboardNavigation() {
        logger.info(`[AccessibilityValidatorHelper.validateKeyboardNavigation] - starting keyboard navigation validation...`);
        const focusable = this.page.locator(this.focusableSelectors);
        const count = await focusable.count();

        let results: any[] = [];
        for (let i = 0; i < count; i++) {
            const el = focusable.nth(i);
            if (!(await el.isVisible())) continue;
            await el.focus();
            const isFocused = await el.evaluate(n => document.activeElement === n);
            results.push({ index: i, focused: isFocused });
        }
        // tabs
        const tabElems = await this.page.locator(this.tabFocusableSelectors);
        const tabCount = await tabElems.count();
        let tabResults: any[] = [];
        for (let i = 0; i < tabCount; i++) {
            await this.page.keyboard.press('Tab');
            await this.page.waitForTimeout(100);
            const active = await this.page.evaluate(() => document.activeElement?.tagName);
            tabResults.push({ tabIndex: i, activeTag: active });

        }
        logger.info(`[AccessibilityValidatorHelper.validateKeyboardNavigation] - completed keyboard navigation validation`);
        return { focusResults: results, tabResults };
    }

    // verify all elements have accessible names
    private async checkAccessibleNames() {
        logger.info(`[AccessibilityValidatorHelper.checkAccessibleNames] - starting accessible names validation...`);
        const all = this.page.locator('body *');
        const total = await all.count();
        let results: any[] = [];
        for (let i = 0; i < total; i++) {
            const el = all.nth(i);
            if (!(await el.isVisible())) continue;
            const accessibleName = await el.evaluate(node => {
                const ariaLabel = node.getAttribute('aria-label');
                const alt = node.getAttribute('alt');
                const title = node.getAttribute('title');
                const text = (node as HTMLElement).innerText || '';
                return ariaLabel || alt || title || text || '';
            });
            results.push({ index: i, accessibleName });
        }
        logger.info(`[AccessibilityValidatorHelper.checkAccessibleNames] - completed accessible names validation`);
        return results;
    }

    // individual element scan
    private async runElementScan() {
        logger.info(`[AccessibilityValidatorHelper.runElementScan] - starting individual element scan...`);
        const elements = this.page.locator('body *');
        const count = await elements.count();
        let results: any[] = [];
        for (let i = 0; i < count; i++) {
            const el = elements.nth(i);
            const tag = await el.evaluate(n => n.tagName.toLowerCase());
            if (tag === 'iframe') continue;

            // Use the helper method for consistent selector generation
            const selector = await this.generateElementSelector(el);
            try {
                const builder = new AxeBuilder({ page: this.page })
                    .exclude(this.excludeSelectors)
                    .include(selector);
                if (this.tags && this.tags.length > 0) {
                    builder.withTags(this.tags);
                }
                const scan = await builder.analyze();
                if (scan.violations.length > 0) {
                    logger.warning(`[AccessibilityValidatorHelper.runElementScan] - problems found ${selector}`, scan.violations);
                }
                results.push({ selector, scan });
            } catch (err) {
                logger.warning(`[AccessibilityValidatorHelper.runElementScan] - error ${selector}`, err);
                results.push({ selector, error: err });
            }
        }
        logger.info(`[AccessibilityValidatorHelper.runElementScan] - completed individual element scan`);
        return results;
    }

    /**
     * Generate a CSS selector for a given element
     * @param element - The Playwright locator element
     * @returns Promise<string> - The generated CSS selector
     */
    private async generateElementSelector(element: any): Promise<string> {
        return await element.evaluate((node: HTMLElement) => {
            let selector = node.tagName.toLowerCase();
            if (node.id) {
                selector += `#${node.id}`;
            }
            if (node.className) {
                selector += '.' + node.className.split(' ').join('.');
            }
            return selector;
        });
    }

}
