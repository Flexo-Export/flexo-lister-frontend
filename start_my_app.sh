#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Navigate to the app directory
cd "$SCRIPT_DIR"

# Function to kill any process running on the specified port
kill_process_on_port() {
  PORT=$1
  PID=$(lsof -t -i:$PORT)
  if [ -n "$PID" ]; then
    echo "Killing process $PID running on port $PORT"
    kill -9 $PID
  else
    echo "No process running on port $PORT"
  fi
}

# Kill any process running on port 3000
kill_process_on_port 3000

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install npm."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Python3 is not installed. Please install Python3."
    exit 1
fi

# Create and activate virtual environment
VENV_DIR="$SCRIPT_DIR/venv"
if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv "$VENV_DIR"
fi
source "$VENV_DIR/bin/activate"

# Check if required Python packages are installed
REQUIRED_PKG="python-docx"
PKG_OK=$(python3 -m pip show $REQUIRED_PKG)
if [ "" = "$PKG_OK" ]; then
  echo "Installing required Python packages..."
  python3 -m pip install -r requirements.txt
fi

# Install Node.js dependencies if node_modules directory does not exist
if [ ! -d "node_modules" ]; then
  npm install
fi

# Start the server in the background with suppressed deprecation warnings
npx nodemon --no-deprecation src/server.ts &

# Store the PID of the background process
SERVER_PID=$!

# Give the server a few seconds to start
sleep 5

# Open the default web browser to the application
if command -v open &> /dev/null
then
  open "http://localhost:3000"
elif command -v xdg-open &> /dev/null
then
  xdg-open "http://localhost:3000"
elif command -v start &> /dev/null
then
  start "http://localhost:3000"
else
  echo "Please open your web browser and navigate to http://localhost:3000"
fi

# Keep the terminal window open
echo "Press any key to stop the server and exit..."
read -n 1

# Kill the server process
kill $SERVER_PID

# Deactivate virtual environment
deactivate

# Keep the terminal window open (for Git Bash)
echo "Press any key to exit..."
read -n 1

# Exit the script
exit
