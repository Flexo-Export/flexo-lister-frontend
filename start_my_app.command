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
    echo "Node.js is not installed. Installing Node.js..."
    # Install Node.js (using Homebrew for macOS)
    if command -v brew &> /dev/null
    then
        brew install node
    else
        echo "Homebrew is not installed. Please install Homebrew first."
        exit 1
    fi
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Installing npm..."
    # Install npm
    npm install -g npm
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Python3 is not installed. Installing Python3..."
    # Install Python3 (using Homebrew for macOS)
    if command -v brew &> /dev/null
    then
        brew install python
    else
        echo "Homebrew is not installed. Please install Homebrew first."
        exit 1
    fi
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

# Install Node.js dependencies
npm install

# Start the server in the background
npx nodemon src/server.ts &

# Store the PID of the background process
SERVER_PID=$!

# Give the server a few seconds to start
sleep 5

# Open the default web browser to the application
open "http://localhost:3000"

# Keep the terminal window open
echo "Press any key to stop the server and exit..."
read -n 1

# Kill the server process
kill $SERVER_PID

# Deactivate virtual environment
deactivate

# Exit the script
exit

