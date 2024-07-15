@echo off

:: Change to the script's directory
cd /d "%~dp0"

:: Function to check if a port is in use and kill the process
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a 2>nul

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm is not installed. Please install npm first.
    exit /b 1
)

:: Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Python is not installed. Please install Python first.
    exit /b 1
)

:: Create and activate virtual environment
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate

:: Check if required Python packages are installed
pip show python-docx >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Installing required Python packages...
    pip install -r requirements.txt
)

:: Install Node.js dependencies
npm install

:: Start the server
npx nodemon src\server.ts

:: Deactivate virtual environment
call venv\Scripts\deactivate

pause
exit

