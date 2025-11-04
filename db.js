const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'resume-maker.db');

// Create/open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

// Initialize database tables
function initializeTables() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Files table
  db.run(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      file_type TEXT DEFAULT 'latex',
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_deleted BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // File versions table
  db.run(`
    CREATE TABLE IF NOT EXISTS file_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_id INTEGER NOT NULL,
      version_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      version_label TEXT,
      is_autosave BOOLEAN DEFAULT 0,
      FOREIGN KEY (file_id) REFERENCES files(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Compiled PDFs table
  db.run(`
    CREATE TABLE IF NOT EXISTS compiled_pdfs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_id INTEGER NOT NULL,
      version_id INTEGER NOT NULL,
      pdf_path TEXT NOT NULL,
      file_size INTEGER,
      compiled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (file_id) REFERENCES files(id),
      FOREIGN KEY (version_id) REFERENCES file_versions(id)
    )
  `);

  // Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      theme TEXT DEFAULT 'light',
      auto_save BOOLEAN DEFAULT 1,
      auto_save_interval INTEGER DEFAULT 30000,
      default_template TEXT DEFAULT 'blank',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('Database tables initialized');
}

// Helper functions
const dbHelpers = {
  // User functions
  createUser: (username, email, passwordHash) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, passwordHash],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  getUserByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Session functions
  createSession: (sessionId, userId, expiresAt) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
        [sessionId, userId, expiresAt],
        function(err) {
          if (err) reject(err);
          else resolve(sessionId);
        }
      );
    });
  },

  getSession: (sessionId) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM sessions WHERE id = ?', [sessionId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  updateSessionAccess: (sessionId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE sessions SET last_accessed = CURRENT_TIMESTAMP WHERE id = ?',
        [sessionId],
        function(err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  },

  deleteSession: (sessionId) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM sessions WHERE id = ?', [sessionId], function(err) {
        if (err) reject(err);
        else resolve(true);
      });
    });
  },

  // File functions
  createFile: (userId, fileName, fileType = 'latex', description = '') => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO files (user_id, file_name, file_type, description) VALUES (?, ?, ?, ?)',
        [userId, fileName, fileType, description],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  getUserFiles: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM files WHERE user_id = ? AND is_deleted = 0 ORDER BY updated_at DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  getFile: (fileId, userId) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM files WHERE id = ? AND user_id = ?',
        [fileId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  updateFile: (fileId, fileName, description) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE files SET file_name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [fileName, description, fileId],
        function(err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  },

  deleteFile: (fileId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE files SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [fileId],
        function(err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  },

  // File version functions
  createFileVersion: (fileId, content, createdBy, versionLabel = null, isAutosave = false) => {
    return new Promise((resolve, reject) => {
      // Get current version number
      db.get(
        'SELECT MAX(version_number) as max_version FROM file_versions WHERE file_id = ?',
        [fileId],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          const nextVersion = (row?.max_version || 0) + 1;

          db.run(
            'INSERT INTO file_versions (file_id, version_number, content, created_by, version_label, is_autosave) VALUES (?, ?, ?, ?, ?, ?)',
            [fileId, nextVersion, content, createdBy, versionLabel, isAutosave ? 1 : 0],
            function(err) {
              if (err) reject(err);
              else resolve({ id: this.lastID, version_number: nextVersion });
            }
          );
        }
      );
    });
  },

  getFileVersions: (fileId) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM file_versions WHERE file_id = ? ORDER BY version_number DESC',
        [fileId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  getFileVersion: (versionId) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM file_versions WHERE id = ?',
        [versionId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  getLatestFileVersion: (fileId) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM file_versions WHERE file_id = ? ORDER BY version_number DESC LIMIT 1',
        [fileId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  // Compiled PDF functions
  createCompiledPdf: (fileId, versionId, pdfPath, fileSize) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO compiled_pdfs (file_id, version_id, pdf_path, file_size) VALUES (?, ?, ?, ?)',
        [fileId, versionId, pdfPath, fileSize],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  getFileCompiledPdfs: (fileId) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM compiled_pdfs WHERE file_id = ? ORDER BY compiled_at DESC',
        [fileId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  // Settings functions
  getUserSettings: (userId) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM user_settings WHERE user_id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  createOrUpdateSettings: (userId, settings) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO user_settings (user_id, theme, auto_save, auto_save_interval, default_template)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET
         theme = excluded.theme,
         auto_save = excluded.auto_save,
         auto_save_interval = excluded.auto_save_interval,
         default_template = excluded.default_template,
         updated_at = CURRENT_TIMESTAMP`,
        [userId, settings.theme, settings.auto_save, settings.auto_save_interval, settings.default_template],
        function(err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }
};

module.exports = {
  db,
  dbHelpers
};
