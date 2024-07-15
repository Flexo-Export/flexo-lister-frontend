@echo off
setlocal enabledelayedexpansion

:: Function to pause and check for user input
:pause_for_debug
echo Press any key to continue...
pause >nul
goto :eof

:: Function to check if a program is installed
:check_installed
where %1 >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo %1 is not installed. Please install %1 first.
    call :pause_for_debug
    exit /b 1
)
echo %1 is installed
goto :eof

:: Main script starts here
cd /d "%~dp0"
echo Changed directory to script's location: %~dp0
call :pause_for_debug

:: Check if Node.js is installed
echo Checking if Node.js is installed...
call :check_installed node

:: Check if npm is installed
echo Checking if npm is installed...
call :check_installed npm

:: Check if Python is installed
echo Checking if Python is installed...
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    where python3 >nul 2>nul
    if %ERRORLEVEL% neq 0 (
        echo Python is not installed. Please install Python first.
        call :pause_for_debug
        exit /b 1
    ) else (
        set "PYTHON=python3"
    )
) else (
    set "PYTHON=python"
)
echo Python is installed: %PYTHON%
call :pause_for_debug

:: Check if pip is installed
echo Checking if pip is installed...
%PYTHON% -m pip --version >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo pip is not installed. Installing pip...
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    %PYTHON% get-pip.py
    if %ERRORLEVEL% neq 0 (
        echo Failed to install pip. Please install pip manually.
        call :pause_for_debug
        exit /b 1
    )
)
echo pip is installed
call :pause_for_debug

:: Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    %PYTHON% -m venv venv
    if %ERRORLEVEL% neq 0 (
        echo Failed to create virtual environment.
        call :pause_for_debug
        exit /b 1
    )
)
echo Virtual environment is set up
call :pause_for_debug

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %ERRORLEVEL% neq 0 (
    echo Failed to activate virtual environment.
    call :pause_for_debug
    exit /b 1
)
echo Virtual environment activated
call :pause_for_debug

:: Check if required Python packages are installed
echo Checking for required Python packages...
%PYTHON% -m pip show python-docx >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Installing required Python packages...
    %PYTHON% -m pip install -r requirements.txt
    if %ERRORLEVEL% neq 0 (
        echo Failed to install Python packages.
        call :pause_for_debug
        exit /b 1
    )
)
echo Required Python packages are installed
call :pause_for_debug

:: Install Node.js dependencies
echo Installing Node.js dependencies...
npm install
if %ERRORLEVEL% neq 0 (
    echo Failed to install Node.js dependencies.
    call :pause_for_debug
    exit /b 1
)
echo Node.js dependencies installed
call :pause_for_debug

:: Start the server
echo Starting the server...
start "Node.js Server" cmd /k "npx nodemon src\server.ts"
if %ERRORLEVEL% neq 0 (
    echo Failed to start the server.
    call :pause_for_debug
    exit /b 1
)
echo Server started
call :pause_for_debug

:: Open the default web browser to the application
start "" "http://localhost:3000"
echo Opened default web browser to http://localhost:3000
call :pause_for_debug

:: Keep the terminal window open
echo Press any key to stop the server and exit...
pause >nul

:: Kill the server process
echo Killing the server process...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /f /pid %%a 2>nul
)
echo Server process killed

:: Deactivate virtual environment
call venv\Scripts\deactivate.bat

:: Exit the script
call :pause_for_debug
exit /b 0
