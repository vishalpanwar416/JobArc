# JobArc - AI Resume Editor

An intelligent, AI-powered resume editor with LaTeX compilation, version control, real-time scoring, and professional PDF generation. Build, refine, and perfect your resume with cutting-edge AI insights.

**Repository**: https://github.com/vishalpanwar416/JobArc

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Usage Guide](#usage-guide)
7. [LaTeX Templates](#latex-templates)
8. [Troubleshooting](#troubleshooting)
9. [Technical Details](#technical-details)
10. [Contributing](#contributing)

---

## ⚡ Quick Start

### Prerequisites Check
```bash
node --version      # Should be v14 or higher
npm --version       # Should be v6 or higher
pdflatex --version  # Should be installed
```

### Install & Run (2 minutes)
```bash
# 1. Clone the repository
git clone https://github.com/vishalpanwar416/JobArc.git
cd JobArc

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
# Navigate to http://localhost:3000
```

---

## ✨ Features

### Core Functionality
- **AI-Powered Resume Scoring**: 8-category analysis with 300+ action verb recognition
- **Version Control System**: Auto-save every 30s with full version history
- **Undo/Redo Support**: Complete history with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- **LaTeX Editor**: Professional resume building with live syntax support
- **Real-time PDF Preview**: Instant rendering with zoom controls (50-300%)
- **Quantifiable Metrics Detection**: Identifies and suggests data-driven accomplishments

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Sidebar**: Quick file access and management
- **Smooth Animations**: Professional UI with cubic-bezier transitions
- **Toast Notifications**: Real-time feedback on actions
- **Collapsible Sidebar**: Hide/show sidebar with ☰ button

### Advanced Features
- **Auto-Save**: Automatic saving every 30 seconds (configurable)
- **Session Management**: Secure 24-hour sessions
- **SQLite3 Database**: Persistent storage across sessions
- **PDF Download**: Export professional resumes as PDFs
- **LaTeX Error Handling**: Auto-fix duplicate `\documentclass` commands
- **File Management**: Create, load, and delete multiple resume versions

---

## 📦 Requirements

### System Requirements
- **RAM**: 2 GB minimum
- **Disk Space**: 500 MB
- **OS**: Windows, macOS, or Linux

### Software Requirements
- **Node.js**: v14 or higher
- **npm**: v6 or higher (comes with Node.js)
- **pdflatex**: LaTeX compiler

---

## 💻 Installation

### Step 1: Install Node.js

**Windows**:
1. Download from https://nodejs.org/ (LTS version)
2. Run the installer and follow prompts
3. Restart your computer

**macOS**:
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Linux (Ubuntu/Debian)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify**:
```bash
node --version
npm --version
```

### Step 2: Install LaTeX (pdflatex)

**Windows**:
1. Download MiKTeX from https://miktex.org/download
2. Run installer and accept defaults
3. Restart your computer

**macOS**:
```bash
brew install basictex
# Add to PATH (add to ~/.zshrc or ~/.bash_profile):
export PATH="/usr/local/texlive/2023/bin/universal-darwin:$PATH"
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get update
sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra
```

**Verify**:
```bash
pdflatex --version
```

### Step 3: Clone Repository

```bash
git clone https://github.com/vishalpanwar416/JobArc.git
cd JobArc
```

### Step 4: Install Dependencies

```bash
npm install
```

---

## 🚀 Running the Application

### Start the Server

```bash
npm start
```

You should see:
```
Server running on http://localhost:3000
Connected to SQLite database
Database tables initialized
```

### Open in Browser

Navigate to: **http://localhost:3000**

### Stop the Server

Press `Ctrl+C` in the terminal

---

## 📖 Usage Guide

### Creating a Resume

1. **New File**: Click "New File" in the sidebar
2. **Write in LaTeX**: Enter your resume content
3. **Auto-Save**: Work is automatically saved every 30 seconds
4. **Manual Save**: Click "Save" to create a named version

### Version Control

1. **View History**: Click "History" button to see all versions
2. **Restore Versions**: Select any previous version to restore
3. **Version Stats**: See detailed metadata for each version
4. **Keyboard Shortcuts**: Ctrl+Z (Undo), Ctrl+Y (Redo)

### Resume Scoring

1. **Calculate Score**: Click "⭐ Score" button
2. **View Analysis**: Resume analyzed across 8 categories:
   - Contact Information (15%)
   - Professional Summary (12%)
   - Work Experience (20%)
   - Education (12%)
   - Skills (12%)
   - Formatting (4%)
   - Action Verbs (15%)
   - Quantifiable Results (10%)
3. **Get Recommendations**: View actionable suggestions
4. **Implement & Rescore**: Apply feedback and track improvements

### PDF Compilation & Download

1. **Compile**: Click "🔄 Compile" to generate PDF
2. **Preview**: View compiled PDF in the preview panel
3. **Navigate**: Use controls to navigate multi-page documents
4. **Zoom**: Adjust zoom from 50% to 300%
5. **Download**: Click "Download PDF" to save to your computer

---

## 📝 LaTeX Templates

### 1. Basic Resume

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\geometry{margin=0.5in}

\title{Your Name}
\author{}
\date{}

\begin{document}

\centering
\textbf{\LARGE Your Name} \\
Email: your@email.com | Phone: (555) 123-4567 | GitHub: github.com/yourname

\section*{Professional Summary}
Brief summary of your professional background and goals.

\section*{Experience}
\textbf{Job Title} at Company Name (2020-Present)
\begin{itemize}
    \item Achieved key accomplishment with quantifiable result
    \item Led initiative that improved efficiency by 40\%
    \item Mentored team members and contributed to growth
\end{itemize}

\section*{Education}
\textbf{Bachelor of Science in Computer Science} \\
University Name (2020)

\section*{Skills}
\begin{itemize}
    \item Languages: JavaScript, Python, Java
    \item Tools: Git, Docker, AWS
    \item Frameworks: React, Express, Django
\end{itemize}

\end{document}
```

### 2. Modern Resume with Sections

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{xcolor}
\geometry{margin=0.75in}

\title{\textbf{John Doe}}
\author{}
\date{}

\begin{document}

\maketitle

\textit{Senior Software Engineer | Full-Stack Developer}

\textcolor{blue}{\section*{PROFESSIONAL SUMMARY}}
Results-driven software engineer with 8+ years developing scalable web applications. Expert in React, Node.js, and cloud technologies. Proven track record of delivering high-impact projects on time and within budget.

\textcolor{blue}{\section*{EXPERIENCE}}

\textbf{Senior Engineer} | TechCorp Inc. (2021-Present)
\begin{itemize}
    \item Architected microservices platform reducing latency by 60\%
    \item Led team of 5 engineers delivering 15+ features quarterly
    \item Increased code coverage from 45\% to 92\%
\end{itemize}

\textbf{Software Engineer} | StartupXYZ (2018-2021)
\begin{itemize}
    \item Built React dashboard used by 50K+ users
    \item Implemented CI/CD pipeline reducing deployment time by 75\%
    \item Reduced API response time from 2s to 200ms
\end{itemize}

\textcolor{blue}{\section*{EDUCATION}}

\textbf{Bachelor of Science in Computer Science} | State University (2018)
\begin{itemize}
    \item GPA: 3.8/4.0
    \item Dean's List all 4 years
\end{itemize}

\textcolor{blue}{\section*{SKILLS}}

\textbf{Languages}: JavaScript, Python, Java, SQL, Go \\
\textbf{Frontend}: React, Vue.js, HTML5, CSS3 \\
\textbf{Backend}: Node.js, Express, Django, FastAPI \\
\textbf{Databases}: PostgreSQL, MongoDB, Redis \\
\textbf{DevOps}: Docker, Kubernetes, AWS, GitHub Actions

\end{document}
```

### 3. Academic Resume

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\geometry{margin=1in}

\title{Dr. Jane Smith}
\author{}
\date{}

\begin{document}

\maketitle

\section*{Education}
\textbf{PhD in Computer Science} | MIT (2023) \\
Dissertation: "Machine Learning Applications in NLP"

\textbf{Bachelor of Science in Mathematics} | Harvard University (2019)

\section*{Research Experience}
\textbf{Research Scientist} | AI Lab (2023-Present)
\begin{itemize}
    \item Published 5 papers in top-tier conferences
    \item Developed novel algorithm achieving 95\% accuracy
\end{itemize}

\section*{Publications}
\begin{enumerate}
    \item Smith, J. et al. (2023). "Deep Learning for Text Analysis." NeurIPS.
    \item Smith, J. et al. (2022). "Efficient NLP Methods." ICML.
\end{enumerate}

\end{document}
```

### Tips for LaTeX Resumes

- Keep margins between 0.5-1 inch
- Use 10-12pt font for body text
- Limit to 1-2 pages for early career, 2-3 for experienced
- Use `\textbf{}` for bold, `\textit{}` for italics
- Use bullet points with `\begin{itemize}...\end{itemize}`
- Include quantifiable metrics and results
- Use action verbs: Led, Architected, Implemented, Designed, etc.

---

## 🔧 Troubleshooting

### "pdflatex not found" Error

**Problem**: LaTeX compiler not installed or not in PATH

**Solution**:
```bash
# Check if installed
which pdflatex        # macOS/Linux
where pdflatex        # Windows

# If not found, install it (see Installation section)

# If installed but not in PATH:
# macOS: Add to ~/.zshrc
export PATH="/usr/local/texlive/2023/bin/universal-darwin:$PATH"

# Windows: Add C:\Program Files\MiKTeX\miktex\bin\x64 to PATH
```

### "Port 3000 is already in use"

**Solution**:
```javascript
// Edit server.js - change:
const PORT = process.env.PORT || 3000;

// To a different port:
const PORT = process.env.PORT || 8080;

// Then restart: npm start
```

### "Cannot find module 'express'"

**Solution**:
```bash
npm install
npm start
```

### LaTeX Compilation Error

**Common Errors**:

| Error | Solution |
|-------|----------|
| `Two \documentclass commands` | Auto-fixed! App removes duplicates automatically |
| `Undefined control sequence` | Check spelling of LaTeX commands |
| `Missing $ inserted` | Math mode error - check `$...$` |
| `File not found` | Use `\usepackage{packagename}` for missing packages |
| `Extra }` or `Missing }` | Check bracket matching `{...}` |

**Debugging Steps**:
1. Check error message in preview panel
2. Look for line number in error
3. Try with a simple template first
4. Add content gradually

### PDF won't display

**Solutions**:
1. Check server logs (look at terminal output)
2. Ensure pdflatex is installed
3. Try manual compile (click "Compile" button)
4. Clear browser cache (Ctrl+Shift+Delete)

### Slow compilation

**Causes**:
- Complex LaTeX with many packages
- Large images
- Limited system resources

**Solutions**:
- Reduce image quality
- Remove unused packages
- Close other applications
- Consider upgrading RAM

---

## 📊 Technical Details

### Database Schema

JobArc uses SQLite3 with these tables:

- **users**: User accounts
- **sessions**: Session management (24-hour expiry)
- **files**: User resumes/documents
- **file_versions**: Version history with metadata
- **compiled_pdfs**: Compiled PDF records
- **user_settings**: User preferences

### API Endpoints

**Session Management**:
- `POST /api/session/create` - Create new session
- `GET /api/settings/:sessionId` - Get user settings
- `POST /api/settings/:sessionId/update` - Update settings

**File Management**:
- `GET /api/files/:sessionId` - List user files
- `POST /api/files/:sessionId/create` - Create new file
- `DELETE /api/files/:fileId/:sessionId` - Delete file

**Version Control**:
- `POST /api/files/:fileId/save-version` - Save version
- `GET /api/files/:fileId/versions/:sessionId` - Get history
- `GET /api/versions/:versionId/:sessionId` - Get version content

**Compilation**:
- `POST /api/compile` - Compile LaTeX to PDF
- `GET /api/download/:sessionId` - Download PDF

### Project Structure

```
JobArc/
├── server.js              # Express backend
├── db.js                  # SQLite3 setup
├── package.json           # Dependencies
├── public/
│   ├── index.html        # Main interface
│   ├── app.js            # JavaScript logic
│   └── styles.css        # Styling
├── temp_latex/           # LaTeX compilation cache
├── uploads/              # File uploads
└── README.md             # This file
```

### Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Express.js, Node.js
- **Database**: SQLite3
- **PDF Rendering**: PDF.js
- **LaTeX Compilation**: pdflatex
- **Session Management**: Crypto-based secure tokens

### Performance Optimizations

- Auto-compile debounce: 1 second
- Auto-save interval: 30 seconds
- Max edit history: 50 entries
- Temporary file cleanup: 1 hour
- PDF.js efficient rendering
- Base64 PDF transfer over HTTP

---

## 🔗 Additional Resources

- **LaTeX Learning**: https://www.latex-project.org/
- **Overleaf**: https://www.overleaf.com/ (Great for learning)
- **LaTeX Symbols**: https://tug.ctan.org/info/symbols/comprehensive/
- **Architecture Details**: See ARCHITECTURE.md

---

## 📜 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+Shift+Z` | Redo (alternative) |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request with your improvements.

---

## 📄 License

MIT

---

## 💬 Support

For issues, feature requests, or questions:
- **GitHub Issues**: https://github.com/vishalpanwar416/JobArc/issues
- **Discussions**: https://github.com/vishalpanwar416/JobArc/discussions

---

**JobArc** - Your AI-powered path to a perfect resume. ✨
