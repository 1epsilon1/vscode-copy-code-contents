# Copy File Contents - VS Code Extension

The _Copy File Contents_ extension for Visual Studio Code allows users to quickly copy the contents of selected code files or entire folders containing code files to the clipboard. It is designed to streamline workflows for developers who need to share, document, or process code snippets efficiently.

---

## Features

- **Copy Single File Contents**: Copy the contents of a single code file directly to the clipboard.
- **Copy Multiple Files**: Select multiple files or folders and copy the contents of all recognized code files within them.
- **Folder Support**: Recursively processes folders to find and copy contents of all supported code files.
- **File Path Headers**: Includes relative file paths as headers in the copied content for better organization.
- **Customizable Code File Extensions**: Supports a predefined set of code file extensions (e.g., `.ts`, `.js`, `.py`, etc.), which can be customized.
- **Clipboard Preservation**: Restores the original clipboard content after execution to avoid disrupting your workflow.
- **Error Handling**: Provides informative error and warning messages for unsupported files or processing issues.

---

## Installation

1. **Via VS Code Marketplace (Recommended)**:
   - Search for "Copy File Contents" in the VS Code Extensions Marketplace.
   - Click **Install** to add it to your VS Code environment.

2. **Manual Installation**:
   - Clone or download this repository.
   - Open a terminal in the project directory and run:
     ```bash
     npm install
     ```
   - Package the extension:
     ```bash
     vsce package
     ```
   - Install the generated `.vsix` file in VS Code via the "Install from VSIX" option in the Extensions view.

---

## Usage

1. **Activate the Extension**:
   - The extension activates automatically when installed in VS Code.

2. **Copy File Contents**:
   - **Single File**: Right-click a code file in the Explorer or open it in the editor, then select **"Copy File Contents"** from the context menu (if registered) or run the command manually.
   - **Multiple Files/Folders**: Select multiple files or folders in the Explorer, then execute the command.
   - **Command Palette**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS), type `Copy File Contents`, and select the command.

3. **Supported File Types**:
   - The extension recognizes common code file extensions such as `.ts`, `.js`, `.py`, `.cpp`, `.java`, `.html`, `.css`, `.json`, `.md`, and more. Unsupported files are skipped with a warning.

4. **Output**:
   - The contents of all processed files are copied to the clipboard, separated by newlines, with each file prefixed by its relative path (e.g., `--- File: src/index.ts ---`).

---

## Configuration

Currently, the extension uses a hardcoded list of supported file extensions. To customize this:

1. Open the extension's source code (`extension.ts`).
2. Modify the `codeFileExtensions` Set to include or exclude file extensions as needed:
   ```typescript
   const codeFileExtensions = new Set(['.ts', '.js', '.py', /* add your extensions */]);
   ```
3. Rebuild and reinstall the extension.

Future updates may include a settings UI for easier customization.

---

## Development

### Prerequisites
- [Node.js](https://nodejs.org/) and npm (required for package management and building the extension)
- [Visual Studio Code](https://code.visualstudio.com/) (the development environment)
- [TypeScript](https://www.typescriptlang.org/) (for compiling the extension code)
- VS Code Extension Development dependencies (e.g., the `vscode` npm package)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/copy-file-contents
   cd copy-file-contents
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open the project in VS Code:
   - Launch VS Code and open the cloned folder (**File > Open Folder**).

### Building and Running
- Compile the TypeScript code:
  ```bash
  npm run compile
  ```
- Run the extension in development mode:
  1. In VS Code, press `F5` to open a new Extension Development Host window.
  2. Test the extension by selecting files or folders and running the **"Copy File Contents"** command.
- Package the extension (optional, for distribution):
  ```bash
  vsce package
  ```

### Notes
- Ensure you have the latest version of Node.js installed to avoid compatibility issues.
- Changes to the code require recompilation (`npm run compile`) before testing with `F5`.

---

## Known Issues

- **Clipboard Workaround**: The extension uses a workaround (`copyFilePath`) to detect selected paths due to inconsistent argument passing from VS Code. This may fail in rare cases, falling back to the active editor or selected resource.
- **Platform-Specific Path Parsing**: Clipboard path separation (e.g., newlines) may behave differently across operating systems.
- **Performance**: Processing large folders with many files may take time due to recursive file reading.

Report additional issues or suggestions in the [Issues](https://github.com/yourusername/copy-file-contents/issues) section.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

---

## License

This extension is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- Built with the [VS Code Extension API](https://code.visualstudio.com/api).
- Powered by [TypeScript](https://www.typescriptlang.org/).
- Inspired by the need to simplify code sharing workflows.