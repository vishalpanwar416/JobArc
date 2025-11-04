# Quick Start Guide

## 1. Prerequisites Check

Before starting, make sure you have:
- Node.js installed: `node --version`
- npm installed: `npm --version`
- pdflatex installed: `pdflatex --version`

If pdflatex is missing, install it first:

### Ubuntu/Debian:
```bash
sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra
```

### macOS:
```bash
brew install basictex
```

### Windows:
Download MiKTeX from https://miktex.org/download

## 2. Install Dependencies

```bash
npm install
```

This will install all required Node packages.

## 3. Start the Server

```bash
npm start
```

You should see:
```
Server running on http://localhost:5000
```

## 4. Open in Browser

Open your web browser and navigate to:
```
http://localhost:5000
```

## 5. Start Editing!

- The left side is the LaTeX editor
- The right side shows the live PDF preview
- Code automatically compiles 1 second after you stop typing
- Click "Download PDF" to save your document

## Example: Create a Simple Document

Replace the default text with:

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}

\title{Hello LaTeX}
\author{Your Name}
\date{\today}

\begin{document}

\maketitle

\section{My First Section}
Hello, this is my first LaTeX document!

\section{Mathematics}
Here's a simple equation: $E = mc^2$

\subsection{More Math}
\[
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
\]

\end{document}
```

You'll see the PDF appear in the preview panel!

## Common Commands

### Stop the Server
Press `Ctrl+C` in the terminal

### Compile Manually
Click the "Compile" button at the top

### Download Your PDF
Click the "Download PDF" button

## Troubleshooting

### Page shows "Waiting..."
- Make sure pdflatex is installed correctly
- Check the browser console for errors (F12)
- Check the server logs for compilation errors

### "pdflatex not found" error
- Ensure pdflatex is in your system PATH
- On macOS, you may need to add it to your PATH:
  ```bash
  export PATH="/usr/local/texlive/2023/bin/universal-darwin:$PATH"
  ```

### Port 5000 is already in use
- Edit `server.js` and change `const PORT = 5000` to a different port
- Then restart the server

## Need Help?

Refer to the full documentation in `README.md`
