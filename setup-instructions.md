# Project Setup Instructions: IPG.Automation

Follow these steps to set up this Playwright TypeScript automation project from scratch on a clean computer.

---

## 1. Prerequisites

- **Node.js** (v20 or newer recommended)
  - Current version in use: **v20.18.0**
  - Check your current version if you see an error install the node - in powershell:
  - If you already have Node.js installed and version 20+ you can skip the installation step.
    ```powershell
    node --version
    ```
  - Download and install from: [https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi]

---

## 2. Clone the Repository

Open a terminal (Command Prompt, PowerShell, or the integrated terminal in VS Code) and run:

This will clone the repository into a new folder named `IPG.Automation` inside your current working directory (the directory where you run the command):

```powershell
git clone https://github.com/petpartners/IPG.Automation.git
```

After cloning, navigate into the project directory:

```powershell
cd IPG.Automation
```

If you want to clone it into a specific directory, you can specify the path like this:

`git clone <repository-url> <target-directory>`

```powershell
git clone https://github.com/petpartners/IPG.Automation.git D:\Projects\IPG.Automation
```

After cloning, navigate into the project directory:

```powershell
cd D:\Projects\IPG.Automation
```

---

## 3. Open the Project in VS Code and Open a Terminal

- Open the project folder in VS Code:
  1. Launch Visual Studio Code.
  2. Go to **File > Open Folder...** and select the `IPG.Automation` folder you just cloned.
- Open a terminal in VS Code:
  1. Go to **Terminal > New Terminal** 
       - Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>`</kbd> on an English keyboard.
       - Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>ñ</kbd> on a Spanish keyboard.

---

## 4. Install Dependencies

```powershell
npm install
```

---

## 5. Configure Environment Variables

Create a file named `.env.keys` inside the `config` folder:

```powershell
notepad config\.env.keys
```

Add the following content (replace with your actual keys) - ask Ivan or Eynar for the values:

```
stripeSecretKey=your_stripe_secret_key
emailApikey=your_email_api_key
figmaApiKey=figma_key
sqlPassword=sql_password
```

---

## 6. Must Have Extensions
- [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=github.copilot)
- [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=github.copilot-chat)


---

## 7. Run Tests

Before running tests for the first time (or after updating Playwright), install the required browsers:

```powershell
npx playwright install
```

To run tests with a specific tag (e.g., `@demo1`):
```powershell
npm run test tag='@demo1'
```
---

## 8. Nice to have Extensions
- [GitHub Pull Requests and Issues](https://marketplace.visualstudio.com/items?itemName=github.vscode-pull-request-github)
- [Rainbow CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv)
- [JSON Tools](https://marketplace.visualstudio.com/items?itemName=meezilla.json)
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [PowerShell](https://marketplace.visualstudio.com/items?itemName=ms-vscode.powershell)
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=pkief.material-icon-theme)

## 9. Discovery, Authoring, and Healing Agents

Setup for the discovery/authoring/healing agents (`qa-orchestrator`, `test-planner`, `test-healer`, brand/API authors), the Playwright Test MCP server, and the create-new-tests/page-object workflows has moved to [agent-mcp-setup-instructions.md](agent-mcp-setup-instructions.md). Continue there once the base setup above is complete.

---

**You're all set!**

If you encounter issues, check the Playwright docs or reach out to your team for help.
