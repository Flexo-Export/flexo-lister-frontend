@echo off

:: Open Git Bash and run the start_my_app.sh script

:: Get the directory of the script
set SCRIPT_DIR=%~dp0

:: Start Git Bash and run the script
"C:\Program Files\Git\bin\bash.exe" --login -i -c "cd '%SCRIPT_DIR%' && ./start_my_app.sh"
pause
