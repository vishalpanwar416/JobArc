# Complete Installation Guide

## System Requirements

### Minimum Requirements
- **RAM**: 2 GB
- **Disk Space**: 500 MB
- **OS**: Windows, macOS, or Linux

### Software Requirements
- **Node.js**: Version 14.0.0 or higher
- **npm**: Version 6.0.0 or higher (comes with Node.js)
- **pdflatex**: LaTeX compiler

## Step-by-Step Installation

### Step 1: Install Node.js

#### Windows
1. Go to https://nodejs.org/
2. Download the LTS version
3. Run the installer
4. Accept all defaults
5. Click "Install"
6. Restart your computer

#### macOS
```bash
# Using Homebrew (install from https://brew.sh if needed)
brew install node
```

Or download from https://nodejs.org/

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Linux (Fedora)
```bash
sudo dnf install nodejs
```

**Verify Installation:**
```bash
node --version
npm --version
```

### Step 2: Install LaTeX (pdflatex)

#### Windows
1. Download MiKTeX from https://miktex.org/download
2. Run the installer
3. Accept defaults
4. Wait for installation to complete
5. Restart your computer

#### macOS
```bash
# Using Homebrew
brew install basictex

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
export PATH="/usr/local/texlive/2023/bin/universal-darwin:$PATH"
```

Or install MacTeX from https://www.tug.org/mactex/

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install texlive-latex-base
sudo apt-get install texlive-fonts-recommended
sudo apt-get install texlive-fonts-extra
sudo apt-get install texlive-latex-extra
```

#### Linux (Fedora)
```bash
sudo dnf install texlive-scheme-basic
sudo dnf install texlive-latex
```

**Verify Installation:**
```bash
pdflatex --version
```

### Step 3: Clone or Download the Project

```bash
# Option 1: If you have git
git clone <repository-url>
cd resume-maker

# Option 2: If you downloaded a zip file
unzip resume-maker.zip
cd resume-maker
```

### Step 4: Run Setup

#### Windows
```bash
setup.bat
```

#### macOS/Linux
```bash
chmod +x setup.sh
./setup.sh
```

#### Manual Setup
```bash
npm install
```

### Step 5: Start the Server

```bash
npm start
```

You should see:
```
Server running on http://localhost:5000
```

### Step 6: Open in Browser

Open your web browser and navigate to:
```
http://localhost:5000
```

You're done! Start editing LaTeX!

## Troubleshooting

### Issue: "pdflatex not found"

**Cause**: LaTeX is not installed or not in PATH

**Solutions**:

1. **Verify Installation**
   ```bash
   which pdflatex        # macOS/Linux
   where pdflatex        # Windows
   ```

2. **Install LaTeX** (see Step 2 above)

3. **Add to PATH** (if already installed)

   **Windows**:
   - Open "Environment Variables"
   - Add MiKTeX bin directory to PATH
   - Example: `C:\Program Files\MiKTeX\miktex\bin\x64`

   **macOS**:
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile
   export PATH="/usr/local/texlive/2023/bin/universal-darwin:$PATH"
   source ~/.zshrc
   ```

   **Linux**: pdflatex should already be in PATH

### Issue: "Port 5000 is already in use"

**Solution 1**: Use a different port
```bash
# Edit server.js
# Change: const PORT = process.env.PORT || 5000;
# To: const PORT = process.env.PORT || 3000;
npm start
```

**Solution 2**: Kill the process using port 5000

**Linux/macOS**:
```bash
lsof -ti:5000 | xargs kill -9
npm start
```

**Windows**:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
npm start
```

### Issue: "Cannot find module 'express'"

**Cause**: Dependencies not installed

**Solution**:
```bash
npm install
npm start
```

### Issue: LaTeX code doesn't compile, showing errors

**Common LaTeX Errors**:

| Error | Solution |
|-------|----------|
| `! Undefined control sequence.` | Check spelling of LaTeX commands |
| `! File not found.` | Use `\usepackage{packagename}` for missing packages |
| `! Missing $ inserted.` | Math mode syntax error - check `$...$` |
| `! Extra }` or `Missing }` | Mismatched braces - check `{...}` |

**Troubleshooting Steps**:
1. Copy code from TEMPLATES.md
2. Test with a simple example first
3. Add content gradually
4. Check the error message for line number

### Issue: PDF won't display in preview

**Solutions**:

1. **Check Server Logs**
   - Look at terminal where you ran `npm start`
   - Check for error messages

2. **Try Manual Compile**
   - Click the "Compile" button
   - Check error message in preview panel

3. **Check LaTeX Syntax**
   - Ensure LaTeX code is valid
   - Start with a template from TEMPLATES.md

4. **Clear Browser Cache**
   - Press Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (macOS)
   - Clear all cache
   - Reload page

### Issue: Server crashes on startup

**Cause**: Port binding or missing dependencies

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Try again
npm start
```

### Issue: Cannot download PDF

**Solution**:

1. **Ensure PDF was compiled**
   - Check if preview shows PDF
   - If error shown, fix LaTeX code first

2. **Try again**
   - Compile the document
   - Click Download PDF button
   - Check browser's download folder

3. **Check browser console**
   - Press F12 to open developer tools
   - Check Console tab for errors

### Issue: Slow compilation

**Causes**:
- Complex LaTeX with many packages
- Large images
- System resources limited

**Solutions**:
1. Reduce image quality
2. Remove unused packages
3. Close other applications
4. Upgrade system RAM

## Port Configuration

If you need to use a different port:

1. Open `server.js`
2. Find the line: `const PORT = process.env.PORT || 5000;`
3. Change `5000` to your desired port number
4. Save the file
5. Restart the server

Example:
```javascript
const PORT = process.env.PORT || 3000;  // Now uses port 3000
```

## Running in Background

### Windows
```bash
npm start
# Or use npm package "cross-env"
npm install -g pm2
pm2 start server.js
```

### macOS/Linux
```bash
npm start &
# Or use PM2
npm install -g pm2
pm2 start server.js
```

## Advanced Configuration

### Add CORS

The app already has CORS enabled for localhost. To allow specific origins:

Edit `server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://yoursite.com'],
  credentials: true
}));
```

### Increase Upload Size

Edit `server.js`:
```javascript
app.use(bodyParser.json({ limit: '100mb' }));  // Change from 50mb
```

### Change Compilation Timeout

Add to `server.js`:
```javascript
const COMPILE_TIMEOUT = 60000;  // 60 seconds
execSync(command, { stdio: 'pipe', timeout: COMPILE_TIMEOUT });
```

## Production Deployment

For deploying to production:

1. **Use Environment Variables**
   ```bash
   npm install dotenv
   ```

2. **Add Error Monitoring**
   ```bash
   npm install sentry-node
   ```

3. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 startup
   pm2 start server.js --name "latex-editor"
   pm2 save
   ```

4. **Set Up Reverse Proxy**
   - Use Nginx or Apache
   - Forward requests to Node.js

5. **Use HTTPS**
   - Install SSL certificate
   - Configure Express for HTTPS

## Getting Help

1. **Check Logs**: Look at terminal output when errors occur
2. **Read Error Messages**: They usually tell you what's wrong
3. **Check Documentation**: See README.md and ARCHITECTURE.md
4. **Try Templates**: Use TEMPLATES.md as a starting point
5. **Test Incrementally**: Add features gradually, not all at once

## System Information

To get your system information for troubleshooting:

```bash
# Node version
node --version

# npm version
npm --version

# pdflatex version
pdflatex --version

# Operating System (macOS/Linux)
uname -a

# Operating System (Windows - in PowerShell)
systeminfo
```

## Next Steps

After successful installation:

1. Read QUICKSTART.md for first steps
2. Check out TEMPLATES.md for example documents
3. Learn LaTeX at https://www.latex-project.org/
4. Explore ARCHITECTURE.md to understand how it works

Enjoy your LaTeX editor! 📝✨
