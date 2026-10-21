import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Types consolidated
interface RunnerConfig {
    tagInput?: string;
    suite?: string;
    spec?: string;
    environment: string;
    workers: number;
    projects?: string[];
    ui?: boolean;
    debug?: boolean;
    listTests?: boolean;
    lastFailed?: boolean;
    headed?: boolean;
    updateSnapshots?: boolean;
}

export class TestRunner {
    private readonly DEFAULT_PROJECTS = ['main-tests', 'mobile-tests', 'api-tests'];
    private readonly DEFAULT_RUNNER_CONFIG: RunnerConfig = {
        environment: 'qas',
        workers: 1,
        ui: false,
        debug: false,
        listTests: false,
        lastFailed: false,
        headed: true,
        updateSnapshots: false
    };
    private readonly DEFAULT_GREP_INVERT = '@Bug';

    public run(argv: string[]): void {
        this.validateArgs(argv);
        const config = this.parseAndResolve(argv);
        const command = this.buildCommand(config);
        this.printInfo(config, command);
        this.executeTests(command);
    }

    private validateArgs(argv: string[]): void {

        const allowedKeys = new Set(['tag', 'suite', 'spec', 'env', 'workers', 'project', 'ui', 'debug', 'listTests', 'lastFailed', 'headed', 'updateSnapshots']);
        const found: Record<string, string> = {};
        for (const arg of argv) {
            if (arg.startsWith('--')) {
                console.error('[TestRunner.validateArgs] - Passing raw --flags is not allowed. Use commands from package.json (for example npm run ui, debug, rerun:failed) or run Playwright directly if you need an unsupported flag.');
                process.exit(1);
            }

            const match = arg.match(/^([^=]+)=(.*)$/);
            if (!match) {
                console.error(`[TestRunner.validateArgs] - Unknown argument format: '${arg}'. Use key=value form (for example: tag=@Smoke or workers=10).`);
                console.error(`  ❌ env= qas  (extra space)`);
                console.error(`  ✅ env=qas   (correct)`);
                process.exit(1);
            }

            // match[0] is the full string, match[1] is the key, match[2] is the value
            const [, key, val] = match;
            if (!allowedKeys.has(key)) {
                console.error(`[TestRunner.validateArgs] - Unknown argument key: '${key}'.`);
                console.error('  Valid keys: tag, suite, spec, env, workers, project, ui, debug, listTests, lastFailed, headed, updateSnapshots');
                process.exit(1);
            }

            found[key] = val ?? '';

            if (key === 'tag') {
                this.validateTagFormat(found['tag']);
            }

            // Inline environment file validation (previously in validateEnvironmentFile)
            const envToCheck = (found['env'] && found['env'].trim()) ? found['env'].trim() : this.DEFAULT_RUNNER_CONFIG.environment;
            const envFile = path.resolve(process.cwd(), 'config', `.env.${envToCheck}`);
            if (!fs.existsSync(envFile)) {
                console.error(`[TestRunner.validateArgs] - Environment file missing: ${envFile}`);
                process.exit(1);
            }
        }
    }

    private validateTagFormat(tagValue: string): void {
        const rawTag = (tagValue || '').trim();
        const pieces = rawTag.split(/(?:\s+and\s+|\s+or\s+)/i).map(p => p.trim()).filter(Boolean);

        if (pieces.length === 0) {
            console.error('[TestRunner.validateArgs] - Tag value is empty.');
            process.exit(1);
        }

        for (const piece of pieces) {
            if (!piece.startsWith('@')) {
                console.error(`[TestRunner.validateArgs] - Tag must start with '@': '${piece}'`);
                process.exit(1);
            }
        }
    }

    private parseAndResolve(argv: string[]): RunnerConfig {
        const config: RunnerConfig = { ...this.DEFAULT_RUNNER_CONFIG };

        for (const arg of argv) {
            if (arg.startsWith('tag=')) {
                config.tagInput = arg.slice(4).trim();
            } else if (arg.startsWith('spec=')) {
                config.spec = arg.slice(5).trim();
            } else if (arg.startsWith('env=')) {
                const envVal = arg.slice(4).trim();
                if (envVal) config.environment = envVal;
            } else if (arg.startsWith('workers=')) {
                const n = parseInt(arg.slice(8), 10);
                if (!Number.isNaN(n)) config.workers = n;
            } else if (arg.startsWith('project=')) {
                config.projects = arg.slice(8).trim().split(/\s+and\s+/i).map(p => p.trim()).filter(Boolean);
            } else if (arg.startsWith('ui=')) {
                const val = arg.slice(3).trim();
                config.ui = val.toLowerCase() === 'true';
            } else if (arg.startsWith('debug=')) {
                const val = arg.slice(6).trim();
                config.debug = val.toLowerCase() === 'true';
            } else if (arg.startsWith('listTests=')) {
                const val = arg.slice(10).trim();
                config.listTests = val.toLowerCase() === 'true';
            } else if (arg.startsWith('lastFailed=')) {
                const val = arg.slice(11).trim();
                config.lastFailed = val.toLowerCase() === 'true';
            } else if (arg.startsWith('headed=')) {
                const val = arg.slice(7).trim();
                config.headed = val.toLowerCase() === 'true';
            } else if (arg.startsWith('updateSnapshots=')) {
                const val = arg.slice(16).trim();
                config.updateSnapshots = val.toLowerCase() === 'true';
            }
        }

        if (!config.projects?.length) {
            config.projects = this.DEFAULT_PROJECTS;
        }

        process.env.NODE_ENV = config.environment;
        process.env.TAG = config.tagInput || '';
        return config;
    }

    private buildCommand(config: RunnerConfig): string {
        const parts: string[] = ['npx playwright test'];
        if (config.spec) parts.push(`"${config.spec}"`);

        if (config.tagInput) {
            const input = config.tagInput.trim().replace(/^['"]|['"]$/g, '');
            const hasAnd = /\s+and\s+/i.test(input);
            const hasOr = /\s+or\s+/i.test(input);

            if (hasAnd && hasOr) {
                console.error('[TestRunner.buildCommand] - Cannot mix "and" and "or" operators in tag input. Use either " and " (AND) or " or " (OR).');
                process.exit(1);
            }

            if (hasAnd) {
                // repeated --grep flags don't AND in Playwright's CLI (last one wins), so use lookaheads instead
                const tags = input.split(/\s+and\s+/i).map(p => p.trim()).filter(Boolean);
                const lookaheads = tags.map(tag => `(?=.*${tag})`).join('');
                parts.push(`--grep="${lookaheads}"`);
            } else if (hasOr) {
                const tags = input.split(/\s+or\s+/i).map(p => p.trim()).filter(Boolean);
                if (tags.length) {
                    parts.push(`--grep="${tags.join('|')}"`);
                }
            } else {
                parts.push(`--grep="${input}"`);
            }
        }

        config.projects?.forEach(p => parts.push(`--project=${p}`));
        parts.push(`--workers=${config.workers}`);

        parts.push(`--grep-invert="${this.DEFAULT_GREP_INVERT}"`);
        if (config.ui) parts.push('--ui');
        if (config.debug) parts.push('--debug');
        if (config.listTests) parts.push('--list');
        if (config.lastFailed) parts.push('--last-failed');
        if (config.headed) parts.push('--headed');
        if (config.updateSnapshots) parts.push('--update-snapshots');
        return parts.join(' ');
    }

    private printInfo(config: RunnerConfig, command: string): void {
        console.log(`\x1b[32mRunning Playwright tests:`);
        if (config.tagInput) console.log(`Tags: ${config.tagInput}`);
        if (config.spec) console.log(`Spec: ${config.spec}`);
        console.log(`Projects: ${(config.projects || []).join(', ')}`);
        console.log(`Workers: ${config.workers} | Environment: ${config.environment}`);
        console.log(`Command: ${command}\x1b[0m`);
    }

    private executeTests(command: string): void {
        try {
            execSync(command, { stdio: 'inherit' });
        } catch (e) {
            console.error('[TestRunner.executeTests] - Playwright tests failed:', (e as Error).message);
            process.exit(1);
        }
    }
}

// If this file is executed directly (ts-node ./test-runner.ts), run the TestRunner.
// Guard with require.main === module so importing this file doesn't trigger execution.
if (require.main === module) {
    const runner = new TestRunner();
    runner.run(process.argv.slice(2));
}