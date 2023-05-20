import * as vscode from 'vscode';

export const message = (txt: string) => vscode.window.showInformationMessage(txt);