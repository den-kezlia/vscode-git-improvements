// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposableSetCommitMessage = vscode.commands.registerCommand('gitImprovements.setCommitMessage', async(uri?) => {
		const vscodeGit = vscode.extensions.getExtension('vscode.git');
		const gitExtension = vscodeGit && vscodeGit.exports;
		const git = gitExtension && gitExtension.getAPI(1);
		let selectedRepository;

		if (!git) {
		  vscode.window.showErrorMessage("Unable to load Git Extension");
		  return;
		}

		vscode.commands.executeCommand("workbench.view.scm");

		if (uri) {
			selectedRepository = git.repositories.find((repository: { rootUri: { path: any; }; }) => {
				return repository.rootUri.path === uri._rootUri.path;
			});
		} else {
			for (let repo of git.repositories) {
				selectedRepository = repo;
			}
		}

		if (selectedRepository && selectedRepository.state && selectedRepository.state.HEAD && selectedRepository.state.HEAD.name) {
			const branchName = selectedRepository.state.HEAD.name;
			const jiraMatcher = /((?!([A-Z0-9a-z]{1,10})-?$)[A-Z]{1}[A-Z0-9]+-\d+)/g;
			const ticket = branchName.match(jiraMatcher)[0];

			selectedRepository.inputBox.value = `${ticket} ${selectedRepository.inputBox.value}`;
		}
	});

	context.subscriptions.push(disposableSetCommitMessage);
}

// this method is called when your extension is deactivated
export function deactivate() {}
