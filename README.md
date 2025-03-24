# vscode-copy-code-contents

A Visual Studio Code extension that copies the contents of selected code files (or all code files within selected directories) to the clipboard, with file paths included as headers. Supports various code file extensions and provides robust error handling.

## Features

* **Copy Code File Contents:** Copies the contents of selected code files to the clipboard.
* **Directory Support:** Recursively copies the contents of all code files within selected directories.
* **File Path Headers:** Includes the relative file path as a header before the content of each file.
* **Code File Extension Filtering:** Only copies files with recognized code file extensions (configurable).
* **Error Handling:** Provides informative error and warning messages.
* **Clipboard Management:** Safely handles and restores the clipboard during path retrieval.
* **Multi-selection support:** Handles multiple file and folder selections.
* **Active Editor Fallback:** If nothing is selected, copies the content of the currently active editor.

## Supported File Extensions

The extension supports the following code file extensions by default:

    .ts, .tsx, .js, .jsx, .py, .java, .cpp, .c, .cs, .go, .rb, .php, .html, .css, .scss, .json, .md

You can customize this list by modifying the `codeFileExtensions` set in the extension's code.

## Usage

1.  **Select Files or Folders:** Select the code files or directories you want to copy the contents from in the VS Code Explorer.
2.  **Run the Command:** Open the command palette (Ctrl+Shift+P or Cmd+Shift+P) and type "Copy File Contents" and select `Copy File Contents`.
3.  **Paste the Contents:** Paste the copied contents from the clipboard into your desired location.

## Installation

1.  Open Visual Studio Code.
2.  Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X).
3.  Search for "vscode-copy-code-contents".
4.  Click "Install".

## Example

If you select two files, `file1.js` and `file2.py`, and run the command, the clipboard will contain:

\`\`\`
--- File: file1.js ---
// Content of file1.js

--- File: file2.py ---
# Content of file2.py
\`\`\`

If you select a folder, the extension will recursively copy the contents of all code files within that folder.

## Development

1.  Clone the repository.
2.  Run `npm install`.
3.  Open the project in VS Code.
4.  Press F5 to start debugging.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

[MIT](LICENSE)
