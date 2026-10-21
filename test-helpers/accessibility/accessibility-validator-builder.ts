import { Page } from '@playwright/test';
import { ACCESSIBILITY_TAG_SETS, AccessibilityValidatorHelper } from './accessibility-validator-helper';

/**
 * AccessibilityValidatorHelper.
 */
export class AccessibilityValidatorBuilder {
    page: Page;
    focusableSelectors: string;
    tabFocusableSelectors: string;
    excludeSelectors: string[];
    enableFullScan: boolean;
    enableKeyboardNavigation: boolean;
    enableElementScan: boolean;
    enableAccessibleNameCheck: boolean;
    enableCheckboxValidation: boolean;
    enableLinkValidation: boolean;
    enableRadioButtonValidation: boolean;

    tags: string[];

    constructor(page: Page) {
        this.page = page;
        this.focusableSelectors = [
            'input:not([type="hidden"]):not([disabled])',
            'button:not([disabled])',
            'a[href]',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(',');
        this.tabFocusableSelectors = this.focusableSelectors;
        this.excludeSelectors = ['iframe'];
        this.enableFullScan = false;
        this.enableKeyboardNavigation = false;
        this.enableElementScan = false;
        this.enableAccessibleNameCheck = false;
        this.tags = ['wcag2a']; // default
        this.enableCheckboxValidation = false;
        this.enableLinkValidation = false;
        this.enableRadioButtonValidation = false;
    }

    withFocusableSelectors(selectors: string) {
        this.focusableSelectors = selectors;
        return this;
    }

    withTags(tags: string[]) {
        this.tags = tags;
        return this;
    }

    withStandardTags() {
        this.tags = [...ACCESSIBILITY_TAG_SETS.STANDARD];
        return this;
    }

    withComprehensiveTags() {
        this.tags = [...ACCESSIBILITY_TAG_SETS.COMPREHENSIVE];
        return this;
    }

    withGovernmentTags() {
        this.tags = [...ACCESSIBILITY_TAG_SETS.GOVERNMENT];
        return this;
    }

    exclude(selectors: string[]) {
        this.excludeSelectors = selectors;
        return this;
    }

    enableAll() {
        this.enableFullScan = true;
        this.enableKeyboardNavigation = true;
        this.enableElementScan = true;
        this.enableAccessibleNameCheck = true;
        this.enableCheckboxValidation = true;
        this.enableLinkValidation = true;
        this.enableRadioButtonValidation = true;
        return this;
    }

    disableAll() {
        this.enableFullScan = false;
        this.enableKeyboardNavigation = false;
        this.enableElementScan = false;
        this.enableAccessibleNameCheck = false;
        this.enableCheckboxValidation = false;
        this.enableLinkValidation = false;
        this.enableRadioButtonValidation = false;
        return this;
    }

    withFullScan() {
        this.enableFullScan = true;
        return this;
    }

    withKeyboardNavigation() {
        this.enableKeyboardNavigation = true;
        return this;
    }
    withElementScan() {
        this.enableElementScan = true;
        return this;
    }
    withAccessibleNameCheck() {
        this.enableAccessibleNameCheck = true;
        return this;
    }
    withCheckboxValidation() {
        this.enableCheckboxValidation = true;
        return this;
    }

    withLinkValidation() {
        this.enableLinkValidation = true;
        return this;
    }

    withRadioButtonValidation() {
        this.enableRadioButtonValidation = true;
        return this;
    }

    build() {
        return new AccessibilityValidatorHelper(this);
    }
}
