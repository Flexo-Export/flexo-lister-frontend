@echo off
setlocal enabledelayedexpansion

:: Get the directory of the script
cd /d "%~dp0"
echo Changed directory to script's location: %~dp0
pause

:: Function to check if a port is in use and kill the process
echo Checking if port 3000 is in use...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Killing process %%a running on port 3000
    taskkill /f /pid %%a 2>nul
)
echo Done checking port 3000
pause

:: Check if Node.js is installed
echo Checking if Node.js is installed...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo Node.js is installed
pause

:: Check if npm is installed
echo Checking if npm is installed...
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm is not installed. Please install npm first.
    pause
    exit /b 1
)
echo npm is installed
pause

:: Check if Python is installed
echo Checking if Python is installed...
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    where python3 >nul 2>nul
    if %ERRORLEVEL% neq 0 (
        echo Python is not installed. Please install Python first.
        pause
        exit /b 1
    ) else (
        set "PYTHON=python3"
    )
) else (
    set "PYTHON=python"
)
echo Python is installed: %PYTHON%
pause

:: Check if pip is installed
echo Checking if pip is installed...
%PYTHON% -m pip --version >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo pip is not installed. Installing pip...
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    %PYTHON% get-pip.py
    if %ERRORLEVEL% neq 0 (
        echo Failed to install pip. Please install pip manually.
        pause
        exit /b 1
    )
)
echo pip is installed
pause

:: Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    %PYTHON% -m venv venv
    if %ERRORLEVEL% neq 0 (
        echo Failed to create virtual environment.
        pause
        exit /b 1
    )
)
echo Virtual environment is set up
pause

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %ERRORLEVEL% neq 0 (
    echo Failed to activate virtual environment.
    pause
    exit /b 1
)
echo Virtual environment activated
pause

:: Check if required Python packages are installed
echo Checking for required Python packages...
%PYTHON% -m pip show python-docx >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Installing required Python packages...
    %PYTHON% -m pip install -r requirements.txt
    if %ERRORLEVEL% neq 0 (
        echo Failed to install Python packages.
        pause
        exit /b 1
    )
)
echo Required Python packages are installed
pause

:: Install Node.js dependencies
echo Installing Node.js dependencies...
npm install
if %ERRORLEVEL% neq 0 (
    echo Failed to install Node.js dependencies.
    pause
    exit /b 1
)
echo Node.js dependencies installed
pause

:: Start the server
echo Starting the server...
start "Node.js Server" cmd /k "npx nodemon src\server.ts"
if %ERRORLEVEL% neq 0 (
    echo Failed to start the server.
    pause
    exit /b 1
)
echo Server started
pause

:: Open the default web browser to the application
start "" "http://localhost:3000"
echo Opened default web browser to http://localhost:3000

:: Keep the terminal window open
echo Press any key to stop the server and exit...
pause

:: Kill the server process
echo Killing the server process...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /f /pid %%a 2>nul
)
echo Server process killed

:: Deactivate virtual environment
call venv\Scripts\deactivate.bat

:: Exit the script
pause
exit /b 0
