@echo off

:: Get the directory of the script
set SCRIPT_DIR=%~dp0

:: Change to the script's directory
cd /d "%SCRIPT_DIR%"

:: Start Git Bash and run the shell script
"C:\Program Files\Git\bin\bash.exe" --login -i -c "%SCRIPT_DIR%start_my_app.sh"

pause
