# LaTeX Templates

This document contains example LaTeX templates you can use in the editor.

## 1. Basic Article

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}

\title{My First Document}
\author{Your Name}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}
Welcome to LaTeX!

\section{Main Content}
This is where you write your content.

\subsection{Subsection}
More detailed information here.

\end{document}
```

## 2. Resume/CV

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\geometry{margin=0.5in}

\title{John Doe}
\author{}
\date{}

\begin{document}

\centering
\textbf{\LARGE John Doe} \\
Email: john@example.com | Phone: (555) 123-4567 | GitHub: github.com/johndoe

\section*{Professional Summary}
Experienced software developer with 5+ years in web development.

\section*{Experience}
\textbf{Software Engineer} at Tech Company (2020-Present)
\begin{itemize}
    \item Led development of new features
    \item Improved performance by 40\%
    \item Mentored junior developers
\end{itemize}

\section*{Education}
\textbf{Bachelor of Science in Computer Science} \\
University Name (2020)

\section*{Skills}
\begin{itemize}
    \item Languages: Python, JavaScript, Java
    \item Frameworks: React, Django, Spring
    \item Tools: Git, Docker, PostgreSQL
\end{itemize}

\end{document}
```

## 3. Report with Math

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{amsmath}

\title{Mathematical Report}
\author{Your Name}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}
This report demonstrates mathematical typesetting in LaTeX.

\section{Equations}

An inline equation: $E = mc^2$

A displayed equation:
\[
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
\]

Using the equation environment:
\begin{equation}
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\end{equation}

\section{Matrices}

\[
\begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix}
\]

\section{Multi-line Equations}

\begin{align*}
f(x) &= x^2 + 3x + 2 \\
     &= (x+1)(x+2)
\end{align*}

\end{document}
```

## 4. Thesis Template

```latex
\documentclass[12pt]{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\geometry{margin=1in}
\usepackage{setspace}
\doublespacing

\title{My Thesis Title}
\author{Student Name}
\date{December 2024}

\begin{document}

\maketitle

\tableofcontents
\newpage

\section{Introduction}
State your research question and motivation.

\section{Literature Review}
Review existing work in the field.

\section{Methodology}
Explain your research approach.

\section{Results}
Present your findings.

\section{Discussion}
Analyze and interpret your results.

\section{Conclusion}
Summarize contributions and future work.

\begin{thebibliography}{99}
\bibitem{Einstein1905} Einstein, A. (1905). "On the electrodynamics of moving bodies." Annalen der Physik.
\bibitem{Newton1687} Newton, I. (1687). \textit{Philosophiæ Naturalis Principia Mathematica}.
\end{thebibliography}

\end{document}
```

## 5. Presentation (Beamer)

```latex
\documentclass{beamer}
\usetheme{Madrid}
\usecolortheme{default}

\title{My Presentation}
\author{Your Name}
\date{\today}

\begin{document}

\frame{\titlepage}

\begin{frame}
\frametitle{Outline}
\tableofcontents
\end{frame}

\section{First Topic}

\begin{frame}
\frametitle{First Slide}
\begin{itemize}
  \item Point one
  \item Point two
  \item Point three
\end{itemize}
\end{frame}

\begin{frame}
\frametitle{Second Slide}
\textbf{Important information}

This is a key point that needs emphasis.
\end{frame}

\section{Second Topic}

\begin{frame}
\frametitle{Summary}
\begin{itemize}
  \item Conclusion 1
  \item Conclusion 2
  \item Future work
\end{itemize}
\end{frame}

\end{document}
```

## 6. Letter

```latex
\documentclass{letter}
\usepackage[utf8]{inputenc}

\signature{John Doe}
\address{123 Main Street \\ City, State 12345}

\begin{document}

\begin{letter}{Jane Smith \\ Hiring Manager \\ Company Name \\ Address}

\opening{Dear Ms. Smith,}

I am writing to express my strong interest in the Software Engineer position at your company.

With my experience in web development and passion for solving complex problems, I believe I would be a great fit for your team.

I would welcome the opportunity to discuss how my skills can contribute to your organization.

\closing{Sincerely,}

\end{letter}

\end{document}
```

## 7. Technical Documentation

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{listings}
\usepackage{xcolor}

\lstset{
  basicstyle=\ttfamily,
  colnames=blue,
  commentstyle=\color{gray},
  keywordstyle=\color{blue},
  breaklines=true
}

\title{API Documentation}
\author{Dev Team}
\date{\today}

\begin{document}

\maketitle

\section{Getting Started}

\subsection{Installation}
Install the package using npm:
\begin{lstlisting}
npm install my-package
\end{lstlisting}

\subsection{Basic Usage}
\begin{lstlisting}
const package = require('my-package');
package.initialize();
\end{lstlisting}

\section{API Reference}

\subsection{Function: doSomething()}
\texttt{doSomething(parameter1, parameter2)}

\textbf{Parameters:}
\begin{itemize}
  \item parameter1: String - The first parameter
  \item parameter2: Number - The second parameter
\end{itemize}

\textbf{Returns:} Boolean - True if successful

\end{document}
```

## 8. Styled Article with Color

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{xcolor}
\usepackage{geometry}
\geometry{margin=1.2in}

\title{\Large\textbf{Colored Article Title}}
\author{Author Name}
\date{\today}

\begin{document}

\maketitle

\section{\textcolor{blue}{First Section}}

This section has a blue heading.

\subsection{\textcolor{red}{Important Subsection}}

\textcolor{red}{Red text} for important information.

\textcolor{green}{Green text} for positive points.

\textcolor{gray}{Gray text} for less important details.

\section{Using Boxes}

\colorbox{yellow}{Highlighted text in a box}

\section{Final Thoughts}

\textbf{Bold text} and \textit{italic text} for emphasis.

\end{document}
```

## How to Use Templates

1. **Copy** the template code from above
2. **Paste** it into the LaTeX Editor
3. The PDF preview will automatically appear on the right
4. **Edit** the content to customize for your needs
5. **Download** the final PDF using the Download button

## Tips for Using LaTeX

- Always start with `\documentclass{...}`
- Wrap content in `\begin{document}...\end{document}`
- Use `\section{}` for main headings
- Use `\subsection{}` for sub-headings
- Use `$...$` for inline math
- Use `\[...\]` or `$$...$$` for display math
- Use `\begin{itemize}...\end{itemize}` for bullet lists
- Use `\begin{enumerate}...\end{enumerate}` for numbered lists

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Undefined control sequence` | Check spelling of LaTeX commands |
| `Missing $ inserted` | Ensure math mode is properly opened/closed |
| `File not found` | Make sure package is installed with `\usepackage{}` |
| `Extra }` or `Missing }` | Check bracket matching |
| `Overfull \hbox` | Text extends beyond margin, use smaller fonts or shorter content |

## Resources

- **Overleaf**: https://www.overleaf.com/ - Great for learning
- **LaTeX Documentation**: https://www.latex-project.org/help/documentation/
- **Comprehensive LaTeX Symbol List**: https://tug.ctan.org/info/symbols/comprehensive/

## Advanced Features

Once comfortable with basics, explore:

- **Tables**: `\begin{table}...\end{table}`
- **Figures**: `\begin{figure}...\end{figure}` with `\includegraphics{}`
- **Bibliography**: Using `.bib` files with BibTeX
- **Custom Formatting**: Define your own commands with `\newcommand{}`
- **Packages**: Extend LaTeX with `\usepackage{}`

Happy LaTeX editing!
