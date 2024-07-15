@echo off
setlocal enabledelayedexpansion

:: Get the directory of the script
cd /d "%~dp0"
echo Changed directory to script's location: %~dp0

:: Function to check if a port is in use and kill the process
echo Checking if port 3000 is in use...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Killing process %%a running on port 3000
    taskkill /f /pid %%a 2>nul
)
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

:: Check if required Python packages are installed
echo Checking for required Python packages...
%PYTHON% -m pip show python-docx >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Installing required Python packages...
    %PYTHON% -m pip install -r requirements.txt
)
echo Required Python packages are installed

:: Install Node.js dependencies
echo Installing Node.js dependencies...
npm install
if %ERRORLEVEL% neq 0 (
    echo Failed to install Node.js dependencies.
    pause
    exit /b 1
)
echo Node.js dependencies installed

:: Start the server in a new command window
echo Starting the server...
start "Node.js Server" cmd /k "npx nodemon src\server.ts"
if %ERRORLEVEL% neq 0 (
    echo Failed to start the server.
    pause
    exit /b 1
)
echo Server started

:: Wait a few seconds to let the server start
timeout /t 5

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

:: Exit the script
exit /b 0
