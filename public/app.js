console.log('app.js loaded');
console.log('React:', window.React);
console.log('ReactDOM:', window.ReactDOM);

const { useState, useEffect, useRef } = React;

console.log('React hooks loaded');

const LaTexEditor = () => {
  console.log('LaTexEditor component rendering');
  const [latexCode, setLatexCode] = useState(`\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\title{My Document}
\\author{Your Name}
\\date{\\today}
\\begin{document}
\\maketitle
\\section{Introduction}
This is a simple LaTeX document to get you started.
\\end{document}`);

  const [pdfData, setPdfData] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState('ready');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const canvasRef = useRef(null);

  // Auto-compile with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (latexCode.trim()) {
        compileLatex();
      }
    }, 1000); // Compile 1 second after user stops typing

    return () => clearTimeout(timer);
  }, [latexCode]);

  // Render PDF on canvas when it changes
  useEffect(() => {
    if (pdfData && canvasRef.current) {
      renderPdfPage();
    }
  }, [pdfData, currentPage]);

  const compileLatex = async () => {
    setIsCompiling(true);
    setStatus('compiling');
    setError(null);

    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latexCode }),
      });

      const data = await response.json();

      if (response.ok && data.pdf) {
        setPdfData(data.pdf);
        setSessionId(data.sessionId);
        setStatus('success');
        setError(null);
      } else {
        setStatus('error');
        // Build detailed error message
        let errorMsg = data.error || 'Failed to compile LaTeX';
        if (data.details && data.details.length > 0) {
          errorMsg += '\n\nDetails:\n' + data.details.join('\n');
        }
        if (data.hint) {
          errorMsg += '\n\n💡 Hint: ' + data.hint;
        }
        setError(errorMsg);
        setPdfData(null);
      }
    } catch (err) {
      setStatus('error');
      setError('Error connecting to server: ' + err.message);
      setPdfData(null);
    } finally {
      setIsCompiling(false);
    }
  };

  const renderPdfPage = async () => {
    const pdfjsLib = window.pdfjsWorker || window.pdfjsLib;
    if (!pdfjsLib) return;

    try {
      // Set up PDF.js worker
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      const binaryString = atob(pdfData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const pdf = await pdfjsLib.getDocument(bytes).promise;
      setTotalPages(pdf.numPages);

      const page = await pdf.getPage(currentPage);
      const scale = 2;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext('2d');
      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
    } catch (err) {
      console.error('Error rendering PDF:', err);
    }
  };

  const downloadPdf = () => {
    if (!sessionId) {
      alert('No PDF available to download');
      return;
    }

    const link = document.createElement('a');
    link.href = `/api/download/${sessionId}`;
    link.download = 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCompileClick = () => {
    compileLatex();
  };

  const getStatusBadge = () => {
    if (isCompiling) {
      return <span className="status-badge status-compiling">
        <span className="loading-spinner">⟳</span> Compiling...
      </span>;
    }
    if (status === 'success' && pdfData) {
      return <span className="status-badge status-success">✓ Ready</span>;
    }
    if (status === 'error') {
      return <span className="status-badge status-error">✗ Error</span>;
    }
    return <span className="status-badge">Waiting...</span>;
  };

  return (
    <div className="container">
      <div className="header">
        <h1>LaTeX Editor</h1>
        <div className="button-group">
          <button className="btn btn-secondary" onClick={handleCompileClick} disabled={isCompiling}>
            {isCompiling ? '⟳ Compiling...' : 'Compile'}
          </button>
          <button
            className="btn btn-primary"
            onClick={downloadPdf}
            disabled={!pdfData}
          >
            ⬇ Download PDF
          </button>
        </div>
      </div>

      <div className="content">
        {/* Editor Section */}
        <div className="editor-section">
          <div className="editor-header">
            📝 LaTeX Code
          </div>
          <div className="editor-container">
            <textarea
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              placeholder="Enter your LaTeX code here..."
              spellCheck="false"
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <div className="preview-header">
            <h2>📄 PDF Preview</h2>
            {getStatusBadge()}
          </div>
          <div className="preview-container">
            {error ? (
              <div className="error-message">{error}</div>
            ) : pdfData ? (
              <div className="pdf-viewer">
                <canvas ref={canvasRef} />
              </div>
            ) : (
              <div className="placeholder">
                {isCompiling ? '⟳ Compiling...' : 'Enter LaTeX code and compile to see preview'}
              </div>
            )}
          </div>
          {pdfData && totalPages > 1 && (
            <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #ddd' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span style={{ margin: '0 1rem', color: '#333' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

console.log('About to render LaTexEditor to root element');
const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);
if (rootElement) {
  ReactDOM.render(<LaTexEditor />, rootElement);
  console.log('LaTexEditor rendered successfully');
} else {
  console.error('Root element not found!');
}
