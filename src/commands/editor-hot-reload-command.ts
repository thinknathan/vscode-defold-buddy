import * as vscode from 'vscode';
import { DefoldEditor, EditorCommand } from '../editor/defold-editor';

const fileExtensionsThatTriggerHotReload = ['.script', '.lua', '.gui_script', '.ts'];

export function registerEditorHotReloadCommand(context: vscode.ExtensionContext) {
    // TODO: move outside of the command
    vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (fileExtensionsThatTriggerHotReload.some((ext) => document.fileName.endsWith(ext))) {
            const editor = new DefoldEditor(context);
            editor.showRunningDefoldEditorNotFoundWindow = false;

            // If we have a TypeScript file, wait an arbitrary amount of time
            // so the transpiler has time to write the file
            if (document.fileName.endsWith('.ts')) {
                await sleep(300);
            }
            await editor.executeCommand(EditorCommand.hotReload);
        }
    });

    context.subscriptions.push(vscode.commands.registerCommand('vscode-defold-ide.hotReload', async () => {
        const editor = new DefoldEditor(context);
        await editor.executeCommand(EditorCommand.hotReload);
    }));
};

function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
