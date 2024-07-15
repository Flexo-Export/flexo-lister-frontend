@echo off
setlocal

REM Get the directory of the script
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Function to kill any process running on the specified port
set "PORT=3000"
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo Killing process %%a running on port %PORT%
    taskkill /PID %%a /F
    goto :PORT_KILLED
)
echo No process running on port %PORT%
:PORT_KILLED

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm is not installed. Installing npm...
    npm install -g npm
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python3 is not installed. Please install Python3 first.
    pause
    exit /b 1
)

REM Create and activate virtual environment
set "VENV_DIR=%SCRIPT_DIR%\venv"
if not exist "%VENV_DIR%" (
    python -m venv "%VENV_DIR%"
)
call "%VENV_DIR%\Scripts\activate.bat"

REM Check if required Python packages are installed
python -m pip show python-docx >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing required Python packages...
    python -m pip install -r requirements.txt
)

REM Install Node.js dependencies
npm install

REM Start the server in the background
start "" npx nodemon src\server.ts

REM Give the server a few seconds to start
timeout /t 5 /nobreak

REM Open the default web browser to the application
start http://localhost:3000

REM Keep the terminal window open
echo Press any key to stop the server and exit...
pause >nul

REM Kill the server process
for /f "tokens=2" %%a in ('tasklist ^| findstr node') do taskkill /PID %%a /F

REM Deactivate virtual environment
call "%VENV_DIR%\Scripts\deactivate.bat"

endlocal
exit /b
