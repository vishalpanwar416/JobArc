#!/bin/bash

echo "==================================="
echo "LaTeX Editor Setup Script"
echo "==================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    echo "  Node.js version: $(node --version)"
else
    echo "  ✗ Node.js not found. Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check npm
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    echo "  npm version: $(npm --version)"
else
    echo "  ✗ npm not found"
    exit 1
fi

# Check pdflatex
echo "✓ Checking pdflatex..."
if command -v pdflatex &> /dev/null; then
    echo "  pdflatex is installed ✓"
else
    echo "  ✗ pdflatex not found"
    echo ""
    echo "  Please install LaTeX:"
    echo "  Ubuntu/Debian: sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra"
    echo "  macOS: brew install basictex"
    echo "  Windows: Download from https://miktex.org/download"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "✓ Installing npm dependencies..."
npm install

echo ""
echo "==================================="
echo "Setup Complete!"
echo "==================================="
echo ""
echo "To start the application, run:"
echo "  npm start"
echo ""
echo "Then open http://localhost:5000 in your browser"
echo ""
