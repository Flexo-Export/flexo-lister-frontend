@echo off

:: Change to the script's directory
cd /d "%~dp0"
echo Changed directory to script's location

:: Function to check if a port is in use and kill the process
echo Checking if port 3000 is in use...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a 2>nul
echo Done checking port 3000

:: Check if Node.js is installed
echo Checking if Node.js is installed...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo Node.js is installed

:: Check if npm is installed
echo Checking if npm is installed...
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm is not installed. Please install npm first.
    pause
    exit /b 1
)
echo npm is installed

:: Check if Python is installed
echo Checking if Python is installed...
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Python is not installed. Please install Python first.
    pause
    exit /b 1
)
echo Python is installed

:: Create and activate virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
echo Activating virtual environment...
call venv\Scripts\activate
echo Virtual environment activated

:: Check if required Python packages are installed
pip show python-docx >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Installing required Python packages...
    pip install -r requirements.txt
)
echo Required Python packages are installed

:: Install Node.js dependencies
echo Installing Node.js dependencies...
npm install
echo Node.js dependencies installed

:: Start the server
echo Starting the server...
npx nodemon src\server.ts

:: Deactivate virtual environment
echo Deactivating virtual environment...
call venv\Scripts\deactivate
echo Virtual environment deactivated

pause
exit
