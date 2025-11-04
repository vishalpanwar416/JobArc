@echo off
echo ===================================
echo LaTeX Editor Setup Script
echo ===================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js not found. Please install from https://nodejs.org
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo Node.js version: %%i
)

REM Check npm
echo Checking npm...
where npm >nul 2>nul
if errorlevel 1 (
    echo npm not found
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo npm version: %%i
)

REM Check pdflatex
echo Checking pdflatex...
where pdflatex >nul 2>nul
if errorlevel 1 (
    echo.
    echo pdflatex not found. Please install MiKTeX from https://miktex.org/download
    echo.
    set /p continue="Continue anyway? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
) else (
    echo pdflatex is installed
)

echo.
echo Installing npm dependencies...
call npm install

echo.
echo ===================================
echo Setup Complete!
echo ===================================
echo.
echo To start the application, run:
echo   npm start
echo.
echo Then open http://localhost:5000 in your browser
echo.
pause
