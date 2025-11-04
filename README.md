# LaTeX Overleaf Editor

A modern web-based LaTeX editor with live PDF preview and download functionality, similar to Overleaf.

## Features

- **Live LaTeX Editor**: Write LaTeX code with syntax highlighting support
- **Real-time PDF Preview**: See your document rendered in real-time as you type
- **Auto-compilation**: Automatically compiles LaTeX 1 second after you stop typing
- **PDF Download**: Download the compiled PDF to your computer
- **Multi-page Support**: Navigate through multi-page PDFs with page controls
- **Error Messages**: Clear error reporting when LaTeX compilation fails
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Clean UI**: Modern interface inspired by Overleaf

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **pdflatex** - LaTeX compiler

### Installing pdflatex

#### On Ubuntu/Debian:
```bash
sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra
```

#### On macOS (using Homebrew):
```bash
brew install basictex
# Then add to PATH:
export PATH="/usr/local/texlive/2023/bin/universal-darwin:$PATH"
```

#### On Windows:
Download and install MiKTeX from https://miktex.org/download

## Installation

1. Navigate to the project directory:
```bash
cd resume-maker
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

The server will start on `http://localhost:5000`

2. Open your web browser and go to:
```
http://localhost:5000
```

## Usage

1. **Write LaTeX Code**: Enter your LaTeX code in the editor on the left side
2. **See Live Preview**: The PDF preview updates automatically after you stop typing for 1 second
3. **Manual Compile**: Click the "Compile" button to manually compile the document
4. **Download**: Click "Download PDF" to save the compiled PDF to your computer
5. **Navigate Pages**: Use the Previous/Next buttons to navigate through multi-page documents

## Example LaTeX Document

A basic template is provided by default:

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\title{My Document}
\author{Your Name}
\date{\today}
\begin{document}
\maketitle
\section{Introduction}
This is a simple LaTeX document to get you started.
\end{document}
```

## API Endpoints

### POST /api/compile
Compiles LaTeX code to PDF

**Request:**
```json
{
  "latexCode": "\\documentclass{article}..."
}
```

**Response:**
```json
{
  "success": true,
  "pdf": "base64encodedpdfdata",
  "sessionId": "sessionid123"
}
```

### GET /api/download/:sessionId
Downloads the compiled PDF file

## Project Structure

```
resume-maker/
├── server.js              # Express backend server
├── package.json           # Node dependencies
├── public/
│   ├── index.html        # HTML entry point
│   ├── app.js            # React application
│   └── styles.css        # CSS styling
├── temp_latex/           # Temporary directory for LaTeX compilation
└── README.md             # This file
```

## Technical Stack

- **Frontend**: React 18 (CDN-based)
- **Backend**: Express.js
- **PDF Rendering**: PDF.js
- **LaTeX Compilation**: pdflatex (system command)
- **Server**: Node.js

## Troubleshooting

### pdflatex not found
If you get an error that `pdflatex` is not found, ensure it's installed and in your system PATH:

```bash
# Test if pdflatex is available
which pdflatex
# or on Windows
where pdflatex
```

### Port already in use
If port 5000 is already in use, you can change it by modifying the PORT variable in `server.js`

### LaTeX compilation errors
Check the error message in the preview panel. Common issues:
- Missing packages (add them with `\usepackage{...}`)
- Syntax errors in your LaTeX code
- Special characters that need escaping

## Performance Notes

- The server automatically cleans up temporary files older than 1 hour
- Compilation happens server-side with pdflatex for best compatibility
- PDFs are rendered using PDF.js for fast, reliable preview

## Future Enhancements

- [ ] Syntax highlighting for LaTeX code
- [ ] Package management and auto-complete
- [ ] Cloud storage integration
- [ ] Collaborative editing
- [ ] Custom templates library
- [ ] Dark mode theme
- [ ] Export to formats other than PDF

## License

MIT

## Support

For issues or feature requests, please open an issue on the GitHub repository.
