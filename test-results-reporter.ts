import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface FailedTestInfo {
    fullTitle: string;
    tags: string[];
}

interface FlakyTestInfo {
    fullTitle: string;
    tags: string[];
    attempts: number;
    failedAttempts: number;
}

/**
 * Custom reporter that outputs both failed and flaky tests to separate text files.
 * Only runs in Docker environments (when RUNNING_IN_DOCKER is set).
 * 
 * Failed tests: Tests that fail on their final retry attempt.
 * Flaky tests: Tests that failed at least once but eventually passed on a retry.
 */
class TestResultsReporter implements Reporter {
    private testResults: Map<string, { fullTitle: string; tags: string[]; attempts: TestResult[] }> = new Map();
    private failedOutputFile: string;
    private flakyOutputFile: string;
    private inDocker: boolean;

    constructor(options: { failedOutputFile?: string; flakyOutputFile?: string } = {}) {
        this.failedOutputFile = options.failedOutputFile || path.join(process.cwd(), 'playwright-report', 'failed-tests-report.txt');
        this.flakyOutputFile = options.flakyOutputFile || path.join(process.cwd(), 'playwright-report', 'flaky-tests-report.txt');

        // Check if running in Docker
        this.inDocker = process.env.RUNNING_IN_DOCKER === 'true';
    }

    onBegin(config: FullConfig, suite: Suite) {
        if (!this.inDocker) {
            console.log('[TestResultsReporter] Skipping - only runs in Docker');
            return;
        }
        this.testResults.clear();
    }

    onTestEnd(test: TestCase, result: TestResult) {
        if (!this.inDocker) {
            return;
        }

        const titlePath = test.titlePath();
        // Skip project name and file path, keep only test suites and test name
        const filteredPath = titlePath.filter(part => part && !part.includes('.spec.') && !part.includes('-tests'));
        const fullTitle = filteredPath.join(' > ');
        const tags = test.tags || [];

        // Use test ID as unique key
        const testId = test.id;

        // Initialize or get existing test result entry
        if (!this.testResults.has(testId)) {
            this.testResults.set(testId, {
                fullTitle,
                tags,
                attempts: []
            });
        }

        // Add this attempt to the test's attempt history
        this.testResults.get(testId)!.attempts.push(result);
    }

    onEnd(result: FullResult) {
        if (!this.inDocker) {
            return;
        }

        const failedTests: FailedTestInfo[] = [];
        const flakyTests: FlakyTestInfo[] = [];

        for (const [testId, testInfo] of this.testResults) {
            const attempts = testInfo.attempts;
            const finalAttempt = attempts[attempts.length - 1];

            // Check if test eventually passed
            const hasPassed = finalAttempt.status === 'passed';

            // Check if there were any failed attempts
            const hasFailures = attempts.some(attempt =>
                attempt.status === 'failed' || attempt.status === 'timedOut'
            );

            if (hasPassed && hasFailures) {
                // Flaky test: failed at least once but eventually passed
                const failedAttempts = attempts.filter(attempt =>
                    attempt.status === 'failed' || attempt.status === 'timedOut'
                ).length;

                flakyTests.push({
                    fullTitle: testInfo.fullTitle,
                    tags: testInfo.tags,
                    attempts: attempts.length,
                    failedAttempts
                });
            } else if (finalAttempt.status !== 'passed' && finalAttempt.status !== 'skipped') {
                // Failed test: ultimately failed after all retries
                failedTests.push({
                    fullTitle: testInfo.fullTitle,
                    tags: testInfo.tags
                });
            }
        }

        // Write failed tests report
        if (failedTests.length > 0) {
            this.writeFailedTestsReport(failedTests);
        }

        // Write flaky tests report
        if (flakyTests.length > 0) {
            this.writeFlakyTestsReport(flakyTests);
        }
    }

    private writeFailedTestsReport(failedTests: FailedTestInfo[]) {
        const dir = path.dirname(this.failedOutputFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        let reportContent = '';
        failedTests.forEach((test) => {
            const tagsText = test.tags.length > 0 ? `Tags: ${test.tags.join(', ')}` : '';
            reportContent += `${test.fullTitle}\t${tagsText}\n`;
        });

        fs.writeFileSync(this.failedOutputFile, reportContent, 'utf-8');

        console.log(`\n[TestResultsReporter] Failed tests report: ${this.failedOutputFile}`);
        console.log(`[TestResultsReporter] Total failed: ${failedTests.length}\n`);
    }

    private writeFlakyTestsReport(flakyTests: FlakyTestInfo[]) {
        const dir = path.dirname(this.flakyOutputFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        let reportContent = '';
        flakyTests.forEach((test) => {
            const tagsText = test.tags.length > 0 ? `Tags: ${test.tags.join(', ')}` : '';
            const attemptsText = `Attempts: ${test.attempts} (${test.failedAttempts} failed)`;
            reportContent += `${test.fullTitle}\t${tagsText}\t${attemptsText}\n`;
        });

        fs.writeFileSync(this.flakyOutputFile, reportContent, 'utf-8');

        console.log(`[TestResultsReporter] Flaky tests report: ${this.flakyOutputFile}`);
        console.log(`[TestResultsReporter] Total flaky: ${flakyTests.length}\n`);
    }

    printsToStdio() {
        return false;
    }
}

export default TestResultsReporter;
