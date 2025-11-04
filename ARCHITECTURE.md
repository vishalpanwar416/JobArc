# Architecture Documentation

## Overview

The LaTeX Editor is a web application that provides a real-time LaTeX code editor with live PDF preview, similar to Overleaf. It uses a client-server architecture:

- **Frontend**: React-based single-page application
- **Backend**: Node.js/Express server for LaTeX compilation
- **PDF Rendering**: PDF.js for client-side PDF display

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Frontend)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          React Application (app.js)                  │   │
│  │  ┌──────────────────┐        ┌─────────────────┐   │   │
│  │  │  LaTeX Editor    │        │  PDF Preview    │   │   │
│  │  │  (textarea)      │        │  (PDF.js)       │   │   │
│  │  └──────────────────┘        └─────────────────┘   │   │
│  └──────────────┬───────────────────────────┬──────────┘   │
│                 │                           │               │
└─────────────────┼───────────────────────────┼───────────────┘
                  │                           │
              HTTP POST                   HTTP GET
              /api/compile             /api/download/:id
                  │                           │
┌─────────────────▼───────────────────────────▼───────────────┐
│          Express Server (Node.js)                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         API Handlers (server.js)                       │ │
│  │  • POST /api/compile                                   │ │
│  │  • GET /api/download/:sessionId                        │ │
│  │  • Static file serving (HTML, CSS, JS)                 │ │
│  └──────────────┬─────────────────────────────────────────┘ │
│                 │                                             │
│                 ▼                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │     LaTeX Compilation Engine                          │ │
│  │  • Write .tex file to temp directory                   │ │
│  │  • Execute pdflatex command                            │ │
│  │  • Generate .pdf output                                │ │
│  │  • Return base64 encoded PDF or error                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                 │                                             │
└─────────────────┼─────────────────────────────────────────────┘
                  │
              File System
         temp_latex/
         ├── [sessionId]/
         │   ├── document.tex
         │   ├── document.pdf
         │   ├── document.log
         │   └── ...
         └── [sessionId]/
             └── ...
```

## Component Details

### Frontend (React)

**File**: `public/app.js`

**Main Component**: `LaTexEditor`

**State Variables**:
- `latexCode`: The LaTeX source code in the editor
- `pdfData`: Base64-encoded PDF data from server
- `isCompiling`: Boolean flag for compilation status
- `error`: Error message if compilation fails
- `sessionId`: Server session ID for download functionality
- `status`: Current status (ready, compiling, success, error)
- `currentPage`: Current PDF page being viewed
- `totalPages`: Total number of pages in PDF

**Key Functions**:
- `compileLatex()`: Sends LaTeX code to server for compilation
- `renderPdfPage()`: Renders PDF page on canvas using PDF.js
- `downloadPdf()`: Initiates PDF download from server
- `handleCompileClick()`: Manual compilation trigger

**Features**:
- Auto-compile with 1-second debounce
- Real-time error display
- Multi-page PDF navigation
- Base64 PDF data transfer

### Backend (Express Server)

**File**: `server.js`

**API Endpoints**:

#### POST `/api/compile`
- Accepts LaTeX code in JSON request body
- Creates temporary directory with unique session ID
- Writes LaTeX code to `.tex` file
- Executes `pdflatex` command via shell
- Returns base64-encoded PDF or error message
- Session ID is used for later downloads

**Request**:
```json
{
  "latexCode": "\\documentclass{article}..."
}
```

**Response (Success)**:
```json
{
  "success": true,
  "pdf": "JVBERi0xLjQK...",
  "sessionId": "1730711234567"
}
```

**Response (Error)**:
```json
{
  "error": "! Undefined control sequence."
}
```

#### GET `/api/download/:sessionId`
- Retrieves compiled PDF from session directory
- Sends file as attachment for browser download
- Returns 404 if session/PDF not found

**Response**: Binary PDF file

### File System Structure

```
temp_latex/
├── 1730711234567/          # Session 1
│   ├── document.tex        # Source LaTeX file
│   ├── document.pdf        # Compiled PDF
│   ├── document.log        # Compilation log
│   ├── document.aux        # Auxiliary files
│   └── ...
└── 1730711234890/          # Session 2
    ├── document.tex
    ├── document.pdf
    └── ...
```

**Cleanup**: Sessions older than 1 hour are automatically deleted every 10 minutes.

## Data Flow

### Compilation Flow

1. **User Types LaTeX Code**
   - React state updates with each keystroke

2. **Auto-Compile Trigger**
   - 1-second debounce timer resets on each keystroke
   - Timer fires and calls `compileLatex()`

3. **Send to Server**
   - HTTP POST request to `/api/compile`
   - Body contains LaTeX code as JSON
   - `isCompiling` state set to true

4. **Server Processing**
   - Create unique session directory
   - Write LaTeX code to file
   - Execute pdflatex command
   - Capture PDF output
   - Return base64-encoded PDF

5. **Render Preview**
   - PDF.js decodes base64 data
   - Renders PDF page on canvas
   - Display in preview panel
   - Update status badge

### Download Flow

1. **User Clicks Download**
   - Browser initiates GET request
   - URL: `/api/download/{sessionId}`

2. **Server Response**
   - Locate PDF file from session directory
   - Stream file to browser
   - Set Content-Disposition header
   - Browser triggers download dialog

3. **File Saved**
   - User's file system receives PDF file
   - Named as `document.pdf`

## Technology Choices

### Frontend
- **React** (via CDN): Fast, component-based UI updates
- **PDF.js**: Industry-standard for PDF rendering in browsers
- **Vanilla JavaScript**: No complex build process needed for frontend

### Backend
- **Express.js**: Lightweight, fast HTTP server
- **Node.js**: JavaScript runtime for cross-platform compatibility
- **pdflatex**: Industry-standard LaTeX compiler for accuracy
- **child_process**: Execute system commands for compilation

### Why This Architecture?

1. **Client-Server Separation**
   - Heavy compilation work on server (pdflatex)
   - Lightweight rendering on client (PDF.js)
   - Reduces client resource usage

2. **Real-time Compilation**
   - Debounced auto-compile for responsive feel
   - Manual compile button as backup
   - Prevents excessive server load

3. **Base64 PDF Transfer**
   - Works seamlessly with HTTP
   - Easy to cache in browser
   - Simple error handling

4. **Session-Based Downloads**
   - Prevents accidental file overwrites
   - Allows multiple simultaneous sessions
   - Easy cleanup with TTL

## Performance Considerations

### Optimization Strategies

1. **Debounce Compilation**
   - 1-second delay prevents unnecessary compilations
   - Typical user types 40-60 WPM
   - ~4-6 characters per second

2. **Base64 Encoding**
   - Slightly increases PDF size (~33%)
   - Avoids binary data handling in JSON
   - Negligible impact on modern networks

3. **Session Cleanup**
   - Automatic cleanup after 1 hour
   - Prevents disk space issues
   - 10-minute cleanup intervals

4. **Canvas Rendering**
   - Single page rendered at a time
   - PDF.js handles page caching
   - Smooth multi-page navigation

## Error Handling

### Compilation Errors
- `pdflatex` logs captured from `.log` file
- Error messages extracted and displayed to user
- Original LaTeX code preserved for editing

### Network Errors
- Server unreachable handled gracefully
- User-friendly error messages
- Retry capability via manual compile button

### File Errors
- PDF not found returns 404
- Session expired handled with cleanup
- Temporary file creation failures caught

## Security Considerations

1. **LaTeX Injection**
   - LaTeX code executed server-side only
   - No direct file system access from client
   - Commands sandboxed to temp directories

2. **File Access**
   - Session IDs are timestamps + random
   - Hard to guess other sessions
   - Files automatically deleted after 1 hour

3. **Input Validation**
   - LaTeX code length limits
   - File size validation
   - Timeout on compilation (can be added)

## Scaling Considerations

For production deployment:

1. **Add Compilation Timeout**
   ```javascript
   execSync(command, { stdio: 'pipe', timeout: 30000 });
   ```

2. **Implement Job Queue**
   - Use Bull/RabbitMQ for large scale
   - Prevent server overload
   - Better resource management

3. **Add Caching Layer**
   - Cache common compilations
   - Redis for session data
   - Reduce redundant compilations

4. **Distribute LaTeX Compilation**
   - Multiple compilation servers
   - Load balancing
   - Horizontal scaling

5. **Add Database**
   - Store compilation history
   - User accounts
   - Document persistence

6. **Add Storage**
   - S3/Cloud storage for PDFs
   - Remove temporary files quickly
   - Better cleanup strategy

## Future Enhancements

1. **Features**
   - Syntax highlighting for LaTeX
   - Code completion
   - Package suggestions
   - Template library

2. **Performance**
   - WebSocket for real-time updates
   - Incremental compilation
   - Caching layer

3. **Collaboration**
   - Real-time collaborative editing
   - Version control
   - Comment system

4. **Advanced**
   - Dark mode
   - Custom fonts
   - Document history
   - Export to other formats (HTML, DOCX)
