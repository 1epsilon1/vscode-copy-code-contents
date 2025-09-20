"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function activate(context) {
    // Log a message to confirm activation
    console.log('Copy File Contents extension activated!');
    let disposable = vscode.commands.registerCommand('copy-file-contents.copy', (...args) => __awaiter(this, void 0, void 0, function* () {
        // Log the raw arguments to see what VS Code is passing
        console.log('Raw arguments:', args);
        // Determine the paths to process (files or folders)
        let paths = [];
        // Workaround: Use copyFilePath to get the selected paths
        try {
            // Save the current clipboard content
            const originalClipboard = yield vscode.env.clipboard.readText();
            // Invoke copyFilePath to copy the selected paths to the clipboard
            yield vscode.commands.executeCommand('copyFilePath');
            // Read the clipboard to get the selected paths
            const clipboardContent = yield vscode.env.clipboard.readText();
            console.log('Clipboard content after copyFilePath:', clipboardContent);
            // Parse the clipboard content (paths are newline-separated on Windows, may vary by platform)
            paths = clipboardContent.split(/\r?\n/).filter((path) => path.trim() !== '');
            console.log('Parsed paths:', paths);
            // Restore the original clipboard content
            yield vscode.env.clipboard.writeText(originalClipboard);
            console.log('Restored original clipboard content');
        }
        catch (error) {
            console.log('Error using copyFilePath workaround:', error);
            // Fallback to the original resourceUri if the workaround fails
            const resourceUri = args[0];
            if (resourceUri) {
                if (Array.isArray(resourceUri)) {
                    paths = resourceUri.map((uri) => uri.fsPath);
                    console.log('Multiple items selected (fallback):', paths);
                }
                else if (resourceUri instanceof vscode.Uri) {
                    paths = [resourceUri.fsPath];
                    console.log('Single item selected (fallback):', paths);
                }
            }
            else if (vscode.window.activeTextEditor) {
                paths = [vscode.window.activeTextEditor.document.uri.fsPath];
                console.log('Using active text editor (fallback):', paths);
            }
        }
        if (paths.length === 0) {
            vscode.window.showErrorMessage('No item selected. Please select a file or folder, or open a file in the editor.');
            return;
        }
        // Define code file extensions (customize this list as needed)
        const codeFileExtensions = new Set([
            '.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rb', '.php', '.html', '.css', '.scss', '.json', '.md'
        ]);
        // Collect all code files to process
        const codeFiles = [];
        // Function to recursively find code files in a folder
        const findCodeFiles = (dir) => {
            const foundFiles = [];
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                try {
                    const itemStats = fs.statSync(fullPath);
                    if (itemStats.isDirectory()) {
                        // Recursively process subfolders
                        const subFiles = findCodeFiles(fullPath);
                        foundFiles.push(...subFiles);
                    }
                    else if (itemStats.isFile()) {
                        // Check if the file has a code file extension
                        const ext = path.extname(fullPath).toLowerCase();
                        if (codeFileExtensions.has(ext)) {
                            foundFiles.push(fullPath);
                        }
                    }
                }
                catch (error) {
                    vscode.window.showWarningMessage(`Failed to process ${fullPath}: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
                }
            }
            return foundFiles;
        };
        // Process each selected item
        for (const itemPath of paths) {
            try {
                const stats = fs.statSync(itemPath);
                if (stats.isDirectory()) {
                    // If it's a folder, recursively find all code files
                    const folderFiles = findCodeFiles(itemPath);
                    codeFiles.push(...folderFiles);
                }
                else if (stats.isFile()) {
                    // If it's a file, check if it's a code file
                    const ext = path.extname(itemPath).toLowerCase();
                    if (codeFileExtensions.has(ext)) {
                        codeFiles.push(itemPath);
                    }
                    else {
                        vscode.window.showWarningMessage(`Skipping ${itemPath}: Not a recognized code file.`);
                    }
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to process ${itemPath}: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
                return;
            }
        }
        console.log('Code files to process:', codeFiles);
        if (codeFiles.length === 0) {
            vscode.window.showErrorMessage('No code files found to copy. Please select files or folders containing code files.');
            return;
        }
        // Read the contents of all code files and concatenate them
        try {
            const fileContents = [];
            for (const filePath of codeFiles) {
                const content = fs.readFileSync(filePath, 'utf8');
                console.log(`Reading file: ${filePath}, content length: ${content.length}`);
                // Include the file path as a header
                const relativePath = path.relative(path.dirname(paths[0]), filePath);
                fileContents.push(`--- File: ${relativePath} ---\n${content}`);
            }
            console.log('File contents array:', fileContents);
            // Concatenate the contents with a newline separator
            const combinedContent = fileContents.join('\n\n');
            console.log('Combined content:', combinedContent);
            console.log('Combined content length:', combinedContent.length);
            // Copy the combined contents to the clipboard
            yield vscode.env.clipboard.writeText(combinedContent);
            vscode.window.showInformationMessage(`Contents of ${codeFiles.length} code file${codeFiles.length > 1 ? 's' : ''} copied to clipboard.`);
        }
        catch (error) {
            if (error instanceof Error) {
                if ('code' in error && error['code'] === 'ENOENT') {
                    vscode.window.showErrorMessage(`Failed to copy file contents: File not found: ${codeFiles.join(', ')}`);
                }
                else {
                    vscode.window.showErrorMessage(`Failed to copy file contents: ${error.message}`);
                }
            }
            else {
                vscode.window.showErrorMessage(`Failed to copy file contents: An unknown error occurred`);
            }
        }
    }));
    console.log('Command copy-file-contents.copy registered!');
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map