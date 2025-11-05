# JobArc - AI Resume Editor

An intelligent, AI-powered resume editor with LaTeX compilation, version control, real-time scoring, and professional PDF generation. Build, refine, and perfect your resume with cutting-edge AI insights.

## Features

### Core Functionality
- **AI-Powered Resume Scoring**: Analyze your resume across 8 key categories with actionable feedback
- **Version Control System**: Automatic and manual version saving with version history timeline
- **Undo/Redo Support**: Full undo/redo capability with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- **LaTeX Editor**: Professional LaTeX resume building with live syntax support
- **Real-time PDF Preview**: Instant PDF rendering with zoom controls (50-300%)
- **AI Recommendations**: 300+ action verb database for professional language detection
- **Quantifiable Metrics Detection**: Identifies and suggests data-driven accomplishments

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional Sidebar**: Quick access to all saved files and documents
- **Dark/Light Theme Support**: Comfortable viewing in any lighting condition
- **Toast Notifications**: Real-time feedback on user actions
- **File Management**: Create, load, and delete multiple resume versions

### Advanced Features
- **Auto-Save**: Automatic saving every 30 seconds (configurable)
- **Session Management**: Secure session-based file access
- **Database Storage**: Persistent storage using SQLite3
- **PDF Download**: Export polished resumes as professional PDFs
- **LaTeX Error Handling**: Detailed error messages with troubleshooting hints

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

1. Clone the repository:
```bash
git clone https://github.com/vishalpanwar416/jobarc.git
cd jobarc
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

The server will start on `http://localhost:3000`

2. Open your web browser and navigate to:
```
http://localhost:3000
```

## Usage

### Creating a Resume
1. **Start Fresh**: Click "New File" in the sidebar to create a new resume
2. **Write in LaTeX**: Enter your resume content in LaTeX format
3. **Auto-Save**: Your work is automatically saved every 30 seconds
4. **Manual Save**: Click "Save" to create a named version

### Version Control
1. **View History**: Click the "History" button to see all versions
2. **Restore Versions**: Select any previous version to restore it
3. **Version Stats**: See detailed metadata for each version (size, creation time, type)
4. **Compare Versions**: Review what changed between versions

### AI Resume Scoring
1. **Calculate Score**: Click the "⭐ Score" button
2. **View Analysis**: See your resume analyzed across 8 categories:
   - Contact Information (15%)
   - Professional Summary (12%)
   - Work Experience (20%)
   - Education (12%)
   - Skills (12%)
   - Formatting (4%)
   - Action Verbs (15%)
   - Quantifiable Results (10%)
3. **Get Recommendations**: Receive actionable suggestions to improve your score
4. **Implement Changes**: Apply feedback and rescore to track improvements

### PDF Generation
1. **Compile**: Click "🔄 Compile" to generate PDF
2. **Preview**: View the compiled PDF in the preview panel
3. **Navigate**: Use page controls to navigate multi-page documents
4. **Zoom**: Adjust zoom level from 50% to 300%
5. **Download**: Save the final PDF to your computer

## Database Schema

JobArc uses SQLite3 with the following tables:

- **users**: User accounts and authentication
- **sessions**: Session management and expiry tracking
- **files**: User documents/resumes
- **file_versions**: Version history with metadata
- **compiled_pdfs**: Compiled PDF records
- **user_settings**: Personalized preferences

## API Endpoints

### Session Management
- `POST /api/session/create` - Create new user session
- `GET /api/settings/:sessionId` - Get user settings
- `POST /api/settings/:sessionId/update` - Update user settings

### File Management
- `GET /api/files/:sessionId` - List user files
- `POST /api/files/:sessionId/create` - Create new file
- `DELETE /api/files/:fileId/:sessionId` - Delete file

### Version Control
- `POST /api/files/:fileId/save-version` - Save file version
- `GET /api/files/:fileId/versions/:sessionId` - Get version history
- `GET /api/versions/:versionId/:sessionId` - Get version content

### Compilation
- `POST /api/compile` - Compile LaTeX to PDF
- `GET /api/download/:sessionId` - Download compiled PDF

## Project Structure

```
jobarc/
├── server.js              # Express backend server
├── db.js                  # SQLite3 database setup
├── package.json           # Node dependencies
├── public/
│   ├── index.html        # Main HTML interface
│   ├── app.js            # JavaScript application logic
│   └── styles.css        # CSS styling and layouts
├── temp_latex/           # Temporary directory for LaTeX compilation
├── uploads/              # File upload directory
└── README.md             # This file
```

## Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Express.js, Node.js
- **Database**: SQLite3
- **PDF Rendering**: PDF.js
- **LaTeX Compilation**: pdflatex
- **Session Management**: Crypto-based secure tokens

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+Shift+Z` | Redo (alternative) |

## Troubleshooting

### pdflatex not found
If you get an error that `pdflatex` is not found:

```bash
# Test if pdflatex is available
which pdflatex
# or on Windows
where pdflatex
```

### Port already in use
If port 3000 is already in use, modify the PORT variable in `server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

### LaTeX compilation errors
- Check error messages in the preview panel
- Ensure required packages are included: `\usepackage{...}`
- Verify syntax and special character escaping
- Review common LaTeX pitfalls

### Database errors
- Ensure `resume-maker.db` is not locked by another process
- Clear temporary files: `rm -rf temp_latex/*`
- Reinitialize database if corrupted

## Performance Optimization

- Automatic cleanup of temporary compilation files (1 hour retention)
- Server-side LaTeX compilation for reliability
- Efficient PDF.js rendering for fast previews
- Debounced auto-save (30 seconds) and history recording (300ms)
- Maximum edit history: 50 entries to manage memory

## Future Enhancements

- [ ] Collaborative editing with real-time sync
- [ ] Multiple resume templates library
- [ ] LinkedIn profile import
- [ ] ATS (Applicant Tracking System) score analysis
- [ ] Custom branding and white-label options
- [ ] Mobile native applications
- [ ] Advanced analytics and insights dashboard
- [ ] Integration with job board APIs

## License

MIT

## Support

For issues, feature requests, or contributions, please visit the GitHub repository:
https://github.com/vishalpanwar416/jobarc

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request with your improvements.

---

**JobArc** - Your AI-powered path to a perfect resume.
