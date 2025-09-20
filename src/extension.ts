import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // Log a message to confirm activation
  console.log('Copy File Contents extension activated!');

  let disposable = vscode.commands.registerCommand('copy-file-contents.copy', async (...args: any[]) => {
    // Log the raw arguments to see what VS Code is passing
    console.log('Raw arguments:', args);

    // Determine the paths to process (files or folders)
    let paths: string[] = [];

    // Workaround: Use copyFilePath to get the selected paths
    try {
      // Save the current clipboard content
      const originalClipboard = await vscode.env.clipboard.readText();

      // Invoke copyFilePath to copy the selected paths to the clipboard
      await vscode.commands.executeCommand('copyFilePath');

      // Read the clipboard to get the selected paths
      const clipboardContent = await vscode.env.clipboard.readText();
      console.log('Clipboard content after copyFilePath:', clipboardContent);

      // Parse the clipboard content (paths are newline-separated on Windows, may vary by platform)
      paths = clipboardContent.split(/\r?\n/).filter((path: string) => path.trim() !== '');
      console.log('Parsed paths:', paths);

      // Restore the original clipboard content
      await vscode.env.clipboard.writeText(originalClipboard);
      console.log('Restored original clipboard content');
    } catch (error) {
      console.log('Error using copyFilePath workaround:', error);
      // Fallback to the original resourceUri if the workaround fails
      const resourceUri = args[0];
      if (resourceUri) {
        if (Array.isArray(resourceUri)) {
          paths = resourceUri.map((uri: vscode.Uri) => uri.fsPath);
          console.log('Multiple items selected (fallback):', paths);
        } else if (resourceUri instanceof vscode.Uri) {
          paths = [resourceUri.fsPath];
          console.log('Single item selected (fallback):', paths);
        }
      } else if (vscode.window.activeTextEditor) {
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
    const codeFiles: string[] = [];

    // Function to recursively find code files in a folder
    const findCodeFiles = (dir: string): string[] => {
      const foundFiles: string[] = [];
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        try {
          const itemStats = fs.statSync(fullPath);
          if (itemStats.isDirectory()) {
            // Recursively process subfolders
            const subFiles = findCodeFiles(fullPath);
            foundFiles.push(...subFiles);
          } else if (itemStats.isFile()) {
            // Check if the file has a code file extension
            const ext = path.extname(fullPath).toLowerCase();
            if (codeFileExtensions.has(ext)) {
              foundFiles.push(fullPath);
            }
          }
        } catch (error) {
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
        } else if (stats.isFile()) {
          // If it's a file, check if it's a code file
          const ext = path.extname(itemPath).toLowerCase();
          if (codeFileExtensions.has(ext)) {
            codeFiles.push(itemPath);
          } else {
            vscode.window.showWarningMessage(`Skipping ${itemPath}: Not a recognized code file.`);
          }
        }
      } catch (error) {
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
      const fileContents: string[] = [];
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
      await vscode.env.clipboard.writeText(combinedContent);
      vscode.window.showInformationMessage(
        `Contents of ${codeFiles.length} code file${codeFiles.length > 1 ? 's' : ''} copied to clipboard.`
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ('code' in error && error['code'] === 'ENOENT') {
          vscode.window.showErrorMessage(`Failed to copy file contents: File not found: ${codeFiles.join(', ')}`);
        } else {
          vscode.window.showErrorMessage(`Failed to copy file contents: ${error.message}`);
        }
      } else {
        vscode.window.showErrorMessage(`Failed to copy file contents: An unknown error occurred`);
      }
    }
  });

  console.log('Command copy-file-contents.copy registered!');
  context.subscriptions.push(disposable);
}

export function deactivate() {}