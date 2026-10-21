# Agent & MCP Setup Instructions: IPG.Automation

This document covers the discovery/authoring/healing agents, the Playwright Test MCP server, and the create-new-tests workflows. Complete the base project setup in [setup-instructions.md](setup-instructions.md) first (Node.js, clone, dependencies, environment variables, extensions, and `npx playwright install` from its step 7).

---

## Quick Start: "I just need locators for a screen"

There is no separate script or terminal command for this — after the one-time MCP server setup below, you start the whole flow by **typing a chat message to an agent** (`qa-orchestrator` or `test-planner` directly). The example requests throughout this doc are literal messages, not pseudo-code.

1. Set up the `playwright-test` MCP server once (section 1 below).
2. Open a chat with `qa-orchestrator`, describe the app/screen, environment, and either point to an existing seed spec that reaches that screen or ask the owning brand agent (`quote-tool`/`orca`/`wombat`) to write one.
3. The orchestrator hands the seed to `test-planner`, which drives the real MCP-controlled browser to that screen and captures the actual locators/state into a `.tmp/<scope>-discovery.md` report (see [step 2, "Automatic Checkpoint Flow"](#automatic-checkpoint-flow)).
4. If you'd rather navigate to the screen yourself instead of relying on a seed, ask for `manual-start` mode instead (see ["Manual Browser Handoff"](#manual-browser-handoff)).
5. The owning brand agent turns that report into page objects/tests using the actual locators found.

### Example prompt — seeded (automatic mode)

Use this when an existing seed spec already reaches the target screen, or you're fine asking the owning author to prepare one:

```markdown
Use test-planner in automatic mode for [app/brand], project [project], environment [environment].
Seed: [existing seed spec path], target screen: [logical page/state].
Inspect [states/controls] only and report locators/behavior for [requirement or work item].
Do not submit purchases or change existing policies.
```

### Example prompt — manual start (you navigate yourself)

Use this when there's no seed yet, or it's faster for you to click through to the target screen:

```markdown
Use test-planner in manual-start mode for [app/brand], project [project], environment [environment].
Seed: [seed spec reaching a safe starting screen, e.g. login/home].
I will navigate in the MCP browser to [target screen]. Stop and leave it open for me.
Report path: .tmp/[scope]-discovery.md.
```

Once you're at the target screen, reply:

```markdown
I am now at [target screen] in the retained MCP browser. Use test-planner in manual-resume mode.
Continue from .tmp/[scope]-discovery.md. Do not rerun the seed or reset the browser.
Inspect [states/controls] only; stop before [submission or other boundary].
```

## 1. Discovery, Authoring, and Healing Agents

Use `qa-orchestrator` for the complete flow, `test-planner` for seeded new-screen discovery, or `test-healer` for an existing failing test. Brand/API agents remain source-code authors. The planner may execute a setup seed and inspect the bounded target; the healer owns regression execution, repair, and final verification. Both use the same `playwright-test` server, serially. Code-only requests do not trigger execution, and discovery-only requests stop at a report.

| Work | Owner | Output |
| --- | --- | --- |
| Prepare a short seed, write page objects/tests | `quote-tool` (all quote brands/OPP), `orca` (Orca/Group/Canada), `wombat` | Source following existing fixtures/managers/controls |
| Run the seed or inspect the developer-prepared screen | `test-planner` | State map, locator evidence, proposed scenarios, minimal authoring handoff |
| Execute finished tests and repair failures | `test-healer` | Verified result or an explicit blocker |
| Coordinate the stages | `qa-orchestrator` | Serial handoffs without repeated discovery |

API-only work stays with the API author/healer; it does not need browser discovery. For an app without a dedicated author, the orchestrator identifies the appropriate owner before code generation. The planner does not assume every app uses Sidney's fixtures or page structure.

The healer follows [Playwright Test Agents](https://playwright.dev/docs/test-agents): inspect failure evidence, replay the selected test with its fixtures, inspect the paused page, repair the owning code, and rerun. It does not rebuild login/navigation in a separate browser. Unlike the stock healer's quarantine policy, ours leaves product failures visible unless a developer approves skipping them. Attempts are bounded to three patch/rerun cycles per distinct failure.

### Playwright Test MCP Setup

Use a current VS Code with Copilot agent support (Playwright documents v1.105 as the minimum), the project's installed dependencies, and the browsers installed via [setup-instructions.md step 7](setup-instructions.md#7-run-tests). The required server is **`playwright-test`**, provided by the installed Playwright package, not the standalone `@playwright/mcp` browser server.

The local [.vscode/mcp.json](.vscode/mcp.json) is **gitignored**. Each developer must configure the server locally; this documentation is the shared setup. Merge the following server into existing settings without replacing unrelated servers:

```json
{
  "servers": {
    "playwright-test": {
      "type": "stdio",
      "command": "node",
      "cwd": "${workspaceFolder:IPG.Automation}",
      "args": [
        "${workspaceFolder:IPG.Automation}/node_modules/playwright/cli.js",
        "run-test-mcp-server",
        "--config",
        "${workspaceFolder:IPG.Automation}/playwright.config.ts"
      ]
    }
  }
}
```

The named workspace variable prevents the Sidney checkout from being selected in a multi-root workspace. If your folder is named differently, adjust it; in a single-folder window `${workspaceFolder}` is sufficient. The explicit working directory also matters because the environment loader resolves `config/.env.*` from it. Using the local CLI avoids an implicit download or a mismatched global Playwright version.

1. Run **MCP: List Servers**, select `playwright-test`, and start/restart it. Review any trust prompt yourself. Start a new chat after changing agent definitions so the new tool allowlists and routing are loaded.
2. Confirm that the healer can access `test_list`, `test_run`, `test_debug`, `browser_snapshot`, `browser_generate_locator`, `browser_evaluate`, `browser_console_messages`, `browser_network_requests`, and `browser_close` from this server. The planner also needs `planner_setup_page` and its scoped interaction tools, listed in [test-planner.agent.md](.github/agents/test-planner.agent.md). Both allowlists were checked against the installed server. Other Playwright integrations expose different tools; names are not interchangeable. An unused standalone `playwright` server is not needed by these agents and can be disabled locally.
3. Match the server environment to the failing run. The project defaults to `qas` when `NODE_ENV` is unset; set a non-secret `env` object on this server (for example `"env": { "NODE_ENV": "qas", "TAG": "" }`) when an explicit environment/tag is needed, and restart it after changes. Keep credentials in the existing local environment files, never in prompts or agent definitions. A terminal `$env:NODE_ENV` change does not update a server already running in VS Code.
4. Supply the spec/location or title, project, environment, original command, and available failure artifacts. `test_run` accepts locations/projects, not the wrapper's `env=...` or `tag=...` arguments; `test_debug` needs the exact test ID/title returned by the server. The healer must preserve the requested selection rather than run all projects. MCP does not execute `test-runner.ts` or inherit its `@Bug` exclusion automatically.

Example request to `test-healer` (replace the target with the actual failing test):

```markdown
Heal <spec path:line or exact test title> in project <project>, environment <environment>.
Original command: <command that failed>
Failure/artifacts: <error text and report/trace paths>
Fix the owning test/page-object/helper code and rerun only this target.
Keep assertions and business intent intact; report application bugs without skipping tests.
```

### Evidence and Limitations

- Start with the error/call log and selected test's `error-context.md`. CLI reports live in `playwright-report/playwright-results.json` and `playwright-report/html-report/`; test attachments live under `test-results/`. MCP can disable configured reporters, so use the artifact paths it actually returns. Preserve supplied artifacts under `.tmp/` before reruns overwrite them.
- UI projects already use `trace: 'retain-on-failure'`; API/unit projects disable tracing by default. Inspect archived ZIPs locally with an archive tool and structured JSON/JSONL parsing only when simpler evidence is insufficient. Trace internals vary by version; no custom trace parser is required. Do not expose credentials or customer/payment data from traces or network logs.
- `test_debug` replays the existing test and pauses on failure. It **does not open a historical trace ZIP**. `npx playwright show-trace <trace.zip>` is the human-facing [Trace Viewer](https://playwright.dev/docs/trace-viewer), not an agent-readable archive API. The healer must distinguish historical artifact evidence from a fresh live replay.
- Debug replay requires Playwright-managed `page`/`context` fixtures. API-only tests, unsupported custom contexts, missing credentials, or unavailable MCP tools use scoped CLI/artifact/source diagnosis; report blocked verification explicitly instead of guessing.
- No automatic `page.pause()`, placeholder replacement of existing broken selectors, weakened assertions, blind timeout increases, or automatic `test.fixme()`. Unresolved new authoring fields are reported using [the shared locator contract](.github/instructions/page-objects.instructions.md).

### Playwright Upgrades

The customized allowlists were checked against the installed Playwright **1.63.0** test server. After upgrading, restart the server and compare its tools and bundled agent definitions with [our healer](.github/agents/test-healer.agent.md) and [our planner](.github/agents/test-planner.agent.md). Playwright recommends regenerating stock definitions with `npx playwright init-agents --loop=vscode`; do that in a disposable checkout and review the differences rather than introducing duplicate stock agents or overwriting repository conventions. Recheck tool availability, then verify seeded discovery and the repair loop on known non-production targets before relying on the upgrade.

## 2. Create New Tests or Page Objects

### Automatic Checkpoint Flow

1. **Choose the target and limits.** Supply the app, logical page, view, project/environment, requirements/work item, states to cover, and actions to avoid. Say whether you want a plan, page object only, or tests plus execution. Use the actual configured project: for example `mobile-tests` for an `@Mobile` Sidney seed or `main-tests` for desktop. Canada has its own project/filter; check [playwright.config.ts](playwright.config.ts) rather than guessing a project named `chromium`.
2. **Prepare/reuse one short seed.** Ask the owning brand author, or let the orchestrator route a seed-only request. It should use existing fixtures/page managers to do only the navigation/data setup needed to reach the checkpoint, then assert the checkpoint is ready. No test for the new target feature is required yet. Keep the seed to one test; do not pass a whole regression suite to the planner. For a brand-new page with unknown navigation, use the manual flow below starting at the last supported screen.
3. **Make the seed discoverable.** Keep it under the selected project's real test directory/match pattern with the required tags. An arbitrary `.tmp/` seed is not discovered by this config. Decide whether a newly created normal spec is a useful navigation test to keep or a temporary seed to remove after authoring; normal specs can participate in CI. Do not add skips or change global discovery to hide a seed. Never remove an existing user's test.
4. **Run the planner.** Select `test-planner` or ask the orchestrator to invoke it with `mode=automatic`, the explicit seed file and project, environment, target states, and stop boundary. It calls `planner_setup_page({ seedFile, project })`; the tool executes the seed with its hooks/fixtures and pauses at the end automatically. No source `page.pause()` is necessary. Server environment must already match the requested environment; the tool has no `env` argument.
5. **Inspect only the target.** The planner records relevant defaults, controls, validation, transitions, and state-specific visibility in one `.tmp/<scope>-discovery.md` report. It compares observations to requirements/source rather than treating every observed behavior as correct. It does not revisit earlier screens or scan the whole app. It stops on a failing seed instead of rebuilding login manually.
6. **Author the requested code.** The orchestrator sends the report to `quote-tool`, `orca`, or `wombat`. The author reuses existing objects, adds only missing typed controls, registers genuinely new logical pages, and writes the requested independent scenarios. A page-object-only request does not generate extra tests. No `clickOnButton()` or other single-call wrapper methods: tests call the control directly. Multi-step methods need real reuse/meaning.
7. **Verify when requested.** After the planner closes its session, the healer runs only the generated/affected tests in the agreed project/environment. A discovery report or successful browser interaction is not a passing test. The author makes each test recreate its own setup, not depend on the seed's still-open browser or import a seed spec. Remove only newly created temporary seed files whose agreed purpose is complete; keep reports local or promote an approved plan separately when requested.

Example request to `qa-orchestrator` (replace bracketed values with your actual target):

```markdown
Create new tests for [app and logical page] in [project], environment [environment].
Requirements: [work item or expected behavior]. View/states: [requested states].
Reuse [seed spec path], or have the owning author prepare a short fixture-backed seed.
Use test-planner in automatic mode to inspect only the target, then have the owning
brand agent author minimal page objects/tests and test-healer verify those tests.
Do not submit purchases or change existing policies. No single-click wrapper methods.
Treat any newly created setup-only seed as temporary and remove it after its purpose ends.
```

For **page-object-only** work, replace "Create new tests" with "Create/update the page object only for these controls" and specify the controls/workflow needed. Discovery still needs a seed or manual handoff; final test execution needs an existing consuming test or a separately authorized new scenario. No agent can prove all behaviors from one snapshot.

### Manual Browser Handoff

Use this when navigation is not automated yet or you can reach the screen faster yourself. You must use the **MCP-owned visible browser**, not an unrelated Chrome tab. Keep the same chat/server session throughout; a new chat can lose the context needed to identify the retained browser. Ensure the server is not configured with `--headless`.

1. Supply a reviewed seed that opens the app/login or last known safe screen using its normal fixtures. Ask `test-planner` for `manual-start` through the orchestrator or directly. For a missing seed, first ask the owning author for seed-only authoring.
2. The planner executes the seed once, verifies the starting screen, and returns `awaiting-user` with the browser left open. The orchestrator yields to you. No polling or repeated tool calls occur while you navigate.
3. Navigate in that browser to the target and stop before consequential actions. Note any decisions/data needed to reproduce your path; do not share credentials. Do not restart MCP, run another test, or invoke the healer while this session is retained.
4. Reply that you are ready and supply the same report/target with `mode=manual-resume`. The planner takes a fresh tab/snapshot of the current state **without calling setup again**. If the session has expired, it reports that and asks for an explicit restart; it does not create a cold-browser replacement.
5. The planner explores only the agreed states, updates the same report, then closes its session. Authoring and requested verification follow steps 6-7 above. Any manual navigation must be translated into repeatable setup before generated tests are called runnable.

Start request:

```markdown
Use test-planner in manual-start mode for [app], project [project], environment [environment].
Seed: [single-test seed path reaching a safe screen].
I will navigate in the MCP browser to [target]. Stop and leave it open for me.
Do not inspect other pages or start authoring yet. Report path: .tmp/[scope]-discovery.md.
```

Resume request:

```markdown
I am now at [target] in the retained MCP browser. Use test-planner in manual-resume mode.
Continue from .tmp/[scope]-discovery.md. Do not rerun the seed or reset the browser.
Inspect [states/controls] only; stop before [submission or other boundary].
Return findings for the owning author; then create [page-object-only / requested tests].
```

To cancel, ask the planner to close its retained session. A discovery report under `.tmp/` is local and may be incomplete; check its status and evidence labels before sending it to another agent.

### Sidney Step 3 Example

- [The existing Step 2 journey](tests/aspca/regression/aspca-whats-covered-to-add-a-pet-journey.spec.ts) already ends at `quote.aspca.checkoutPage.letsFinishUpHeading`. A short seed can reuse that navigation through existing pet-info/coverage objects without replaying all its unrelated assertions/accessibility scans. Preserve `@fixtures/aspca-fixtures` and `ASPCAUrl.stepper`; mobile uses the `@Mobile` tag and `mobile-tests` project.
- **Step 3 remains one logical `AspcaCheckoutPage`.** Address, payment information, and other mini-screens are progressive states under `quote.aspca.checkoutPage`, not independent page objects. Inspect one state at a time: its entry condition, visible/hidden controls, Next/Back action, required-field gating, validation, and retained values. Do not assume every field is visible at once or force hidden fields to appear.
- Use the optional Sidney source checkout for selectors/validation rules, then confirm the requested runtime states. Frame-scoped payment elements need frame-aware evidence; do not copy another brand's Stripe selectors without checking. Stop before final purchase unless explicitly authorized with approved test data.
- Share the same logical objects across views, but do not claim scroller/mobile/desktop coverage from one stepper run. Only add sections if there is real reusable complexity; ordinary clicks and field assertions belong in tests.

### Troubleshooting the Flow

| Symptom | Action |
| --- | --- |
| Planner reports `needs-seed` | Have the owning author prepare one short, discoverable fixture-backed seed; do not fabricate a failing regression test |
| Seed not found or no selected tests | Check path, exactly one test, project `testDir`/`testMatch`, and tag filters; `.tmp/` is not automatically discoverable |
| Wrong environment or authentication | Check the server working directory/environment and app fixtures; restart MCP only outside a retained manual session |
| Seed fails before the checkpoint | Give its error/artifacts to `test-healer` when repair is authorized; do not let discovery wander through login |
| Manual screen disappears | Another setup/test/debug call may have reset the shared runner; explicitly restart the manual flow |
| Hidden mini-screen controls are missing | Reach their state through normal transitions; record hidden versus unmounted behavior instead of inventing selectors |
| Planner reports `blocked` or unverified states | Resolve the specific evidence/scope/tooling gap; do not repeatedly rediscover the entire page |

Tool startup/allowlist and routing validation do not replace a live seed-to-authoring-to-verification acceptance run in your chosen app.

## 3. Additional Resources
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [VS Code Extension for Playwright](https://playwright.dev/docs/getting-started-vscode)
- [Playwright Test Agents](https://playwright.dev/docs/test-agents)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [VS Code MCP Configuration](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)

---

**You're all set!**

If you encounter issues, check the Playwright docs or reach out to your team for help.
