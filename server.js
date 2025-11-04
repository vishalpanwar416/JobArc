const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const multer = require('multer');
const crypto = require('crypto');
const { dbHelpers } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root path and SPA routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const upload = multer({ dest: 'uploads/' });
const compilationDir = path.join(__dirname, 'temp_latex');

// Ensure temp directory exists
if (!fs.existsSync(compilationDir)) {
  fs.mkdirSync(compilationDir, { recursive: true });
}

// API endpoint to compile LaTeX
app.post('/api/compile', (req, res) => {
  const { latexCode } = req.body;

  if (!latexCode) {
    return res.status(400).json({ error: 'LaTeX code is required' });
  }

  const sessionId = Date.now().toString();
  const sessionDir = path.join(compilationDir, sessionId);

  try {
    // Create session directory
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    // Write LaTeX file
    const texFile = path.join(sessionDir, 'document.tex');
    fs.writeFileSync(texFile, latexCode);

    // Compile LaTeX to PDF
    const command = `cd ${sessionDir} && pdflatex -interaction=nonstopmode -halt-on-error document.tex`;

    try {
      execSync(command, { stdio: 'pipe' });
    } catch (err) {
      // pdflatex might fail but still generate output
      console.error('LaTeX compilation warning:', err.message);
    }

    // Check if PDF was generated
    const pdfFile = path.join(sessionDir, 'document.pdf');

    if (fs.existsSync(pdfFile)) {
      const pdfBuffer = fs.readFileSync(pdfFile);
      const base64Pdf = pdfBuffer.toString('base64');
      res.json({ success: true, pdf: base64Pdf, sessionId });
    } else {
      // Try to extract detailed errors from log file
      const logFile = path.join(sessionDir, 'document.log');
      let errorMessage = 'Failed to compile LaTeX';
      let errorDetails = [];

      if (fs.existsSync(logFile)) {
        const logContent = fs.readFileSync(logFile, 'utf8');

        // Extract all LaTeX errors and warnings
        const errorPattern = /^!.*?(?=^(?:!|Type |L\.|\(|$))/gms;
        const errors = logContent.match(errorPattern) || [];

        if (errors.length > 0) {
          errorDetails = errors.map((err, idx) => {
            // Clean up error message
            const cleaned = err.trim().split('\n')[0];
            return cleaned;
          }).slice(0, 5); // Get first 5 errors

          errorMessage = errorDetails[0] || 'LaTeX compilation error';
        }

        // Also look for specific error patterns
        const undefinedControl = logContent.match(/Undefined control sequence[^]*?l\.\d+ .*$/gm);
        const fileNotFound = logContent.match(/File `[^`]+' not found/gm);
        const packageErrors = logContent.match(/Package.*Error:.*$/gm);

        if (fileNotFound) {
          errorDetails.push(...fileNotFound.slice(0, 3));
        }
        if (packageErrors) {
          errorDetails.push(...packageErrors.slice(0, 3));
        }
      }

      res.status(400).json({
        error: errorMessage,
        details: errorDetails.length > 0 ? errorDetails : ['Check LaTeX syntax and package dependencies'],
        hint: 'Common issues: Missing packages (use \\usepackage), undefined commands (\\fa* icons), or invalid LaTeX syntax'
      });
    }
  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({ error: 'Internal server error during compilation' });
  }
});

// API endpoint to download PDF
app.get('/api/download/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const pdfFile = path.join(compilationDir, sessionId, 'document.pdf');

  if (fs.existsSync(pdfFile)) {
    res.download(pdfFile, 'document.pdf');
  } else {
    res.status(404).json({ error: 'PDF not found' });
  }
});

// Cleanup old files (older than 1 hour)
setInterval(() => {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour

  try {
    fs.readdirSync(compilationDir).forEach(dir => {
      const dirPath = path.join(compilationDir, dir);
      const stats = fs.statSync(dirPath);

      if (now - stats.mtime.getTime() > maxAge) {
        fs.rmSync(dirPath, { recursive: true });
      }
    });
  } catch (err) {
    // Directory might not exist yet
  }
}, 10 * 60 * 1000); // Check every 10 minutes

// ==================== DATABASE API ROUTES ====================

// Create a new session (guest or authenticated)
app.post('/api/session/create', async (req, res) => {
  try {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // For now, store session without userId (guest session)
    // In future: add user authentication
    await dbHelpers.createSession(sessionId, 1, expiresAt); // userId 1 for guest

    res.json({
      success: true,
      sessionId,
      message: 'Session created successfully'
    });
  } catch (err) {
    console.error('Session creation error:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get user's files
app.get('/api/files/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Verify session
    const session = await dbHelpers.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Get user files
    const files = await dbHelpers.getUserFiles(session.user_id);
    res.json({ success: true, files });
  } catch (err) {
    console.error('Error getting files:', err);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Create a new file
app.post('/api/files/:sessionId/create', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { fileName, fileType = 'latex', description = '' } = req.body;

    // Verify session
    const session = await dbHelpers.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Create file
    const fileId = await dbHelpers.createFile(session.user_id, fileName, fileType, description);

    res.json({
      success: true,
      fileId,
      message: 'File created successfully'
    });
  } catch (err) {
    console.error('File creation error:', err);
    res.status(500).json({ error: 'Failed to create file' });
  }
});

// Save file version
app.post('/api/files/:fileId/save-version', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { sessionId, content, versionLabel = null, isAutosave = false } = req.body;

    // Verify session
    const session = await dbHelpers.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Verify file ownership
    const file = await dbHelpers.getFile(fileId, session.user_id);
    if (!file) {
      return res.status(403).json({ error: 'File not found or access denied' });
    }

    // Create new version
    const version = await dbHelpers.createFileVersion(fileId, content, session.user_id, versionLabel, isAutosave);

    res.json({
      success: true,
      version,
      message: 'Version saved successfully'
    });
  } catch (err) {
    console.error('Version save error:', err);
    res.status(500).json({ error: 'Failed to save version' });
  }
});

// Get file versions
app.get('/api/files/:fileId/versions/:sessionId', async (req, res) => {
  try {
    const { fileId, sessionId } = req.params;

    // Verify session
    const session = await dbHelpers.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Verify file ownership
    const file = await dbHelpers.getFile(fileId, session.user_id);
    if (!file) {
      return res.status(403).json({ error: 'File not found or access denied' });
    }

    // Get versions
    const versions = await dbHelpers.getFileVersions(fileId);
    res.json({ success: true, versions });
  } catch (err) {
    console.error('Error getting versions:', err);
    res.status(500).json({ error: 'Failed to get versions' });
  }
});

// Get specific version content
app.get('/api/versions/:versionId/:sessionId', async (req, res) => {
  try {
    const { versionId, sessionId } = req.params;

    // Verify session
    const session = await dbHelpers.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Get version
    const version = await dbHelpers.getFileVersion(versionId);
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }

    res.json({ success: true, version });
  } catch (err) {
    console.error('Error getting version:', err);
    res.status(500).json({ error: 'Failed to get version' });
  }
});

// Delete file
app.delete('/api/files/:fileId/:sessionId', async (req, res) => {
  try {
    const { fileId, sessionId } = req.params;

    // Verify session
    const session = await dbHelpers.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Verify file ownership
    const file = await dbHelpers.getFile(fileId, session.user_id);
    if (!file) {
      return res.status(403).json({ error: 'File not found or access denied' });
    }

    // Delete file (soft delete)
    await dbHelpers.deleteFile(fileId);

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    console.error('File deletion error:', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Store compiled PDF record
app.post('/api/pdfs/:fileId/save', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { sessionId, versionId, pdfPath, fileSize } = req.body;

    // Verify session
    const session = await dbHelpers.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Verify file ownership
    const file = await dbHelpers.getFile(fileId, session.user_id);
    if (!file) {
      return res.status(403).json({ error: 'File not found or access denied' });
    }

    // Save PDF record
    const pdfId = await dbHelpers.createCompiledPdf(fileId, versionId, pdfPath, fileSize);

    res.json({
      success: true,
      pdfId,
      message: 'PDF record saved'
    });
  } catch (err) {
    console.error('PDF save error:', err);
    res.status(500).json({ error: 'Failed to save PDF record' });
  }
});

// Get user settings
app.get('/api/settings/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Verify session
    const session = await dbHelpers.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Get settings
    const settings = await dbHelpers.getUserSettings(session.user_id);
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Error getting settings:', err);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Update user settings
app.post('/api/settings/:sessionId/update', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const settings = req.body;

    // Verify session
    const session = await dbHelpers.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Update settings
    await dbHelpers.createOrUpdateSettings(session.user_id, settings);

    res.json({ success: true, message: 'Settings updated' });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Catch-all route handler for 404s
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
