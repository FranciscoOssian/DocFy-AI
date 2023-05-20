import * as vscode from 'vscode';
import { docFy } from './docFy';
import { message } from './utils/message';

async function run() {

  const editor = vscode.window.activeTextEditor;
  if(!editor) {return;}

  const document = editor.document;

  const entireRange = new vscode.Range(0, 0, document.lineCount, 0);
  const fileContent = document.getText(entireRange);
  
  const fileName = document.fileName;
  const languageId = document.languageId;

  message('Loading...👨‍💻');
  
  const newCode = await docFy(fileContent, fileName, languageId);
  editor.edit( editBuilder => {
    if( (newCode as any).error ) {return;}
    editBuilder.replace(entireRange, `${newCode}`);
  });

}

export function activate(context: any) {
  let disposable = vscode.commands.registerCommand('extension.generateDoc', run);

  context.subscriptions.push(disposable);

  vscode.commands.executeCommand('setContext', 'showContextMenu', true);
  vscode.commands.executeCommand('setContext', 'menuText', 'Generate Doc');

  vscode.commands.registerCommand('extension.showContextMenu', () => {
    const menuText = vscode.workspace.getConfiguration().get('menuText') as string;
    vscode.window.showInformationMessage(`Clicked on ${menuText}`);
  });
}

export function deactivate() {}
