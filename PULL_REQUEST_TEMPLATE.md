## CHECKLIST for Pull Request

- [ ] verify that the test has the @tag >  Suite / App /Area / Id Manual Test
- [ ] verify there are not locator with bad practice (positions in xpath, absolute xpath)
- [ ] verify the comment in the PR describes all changes
- [ ] verify standard for typescript
- [ ] verify the controls are added in the correct page/section
- [ ] add a Copilot as reviewer in the Pull Request
- [ ] verify that commit names are descriptive and follow the project convention (use copilot help)
- [ ] ensure that temporary files, credentials or sensitive data are not uploaded
- [ ] check that automated tests pass correctly in CI/CD
- [ ] review that relevant documentation is updated (README, comments, etc.)
- [ ] validate that no unauthorized dependencies are introduced
- [ ] if new method is added (util/helper) add at least 1 unit test
- [ ] test() is enough for one single test per file (use test.describe, test.beforeEach, test.breforeAll only if it is needed)
- [ ] branching name: feature/suite-test-case-id or feature/functionality
- [ ] test cases name structure: Application > Scenario Name e.g. ('Orca > Test login functionality')