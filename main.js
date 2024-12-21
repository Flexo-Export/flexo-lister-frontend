const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const serverApp = require('./src/app'); // Your existing express app

// Load environment variables from config.json if it exists, otherwise from .env file
const configPath = path.join(__dirname, 'config.json');
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  process.env.DROPBOX_ACCESS_TOKEN = config.DROPBOX_ACCESS_TOKEN;
  process.env.ENTRY_PATH = config.ENTRY_PATH;
  process.env.OPENAI_API_KEY = config.OPENAI_API_KEY;
} else {
  dotenv.config();  // Fallback to .env file
}

let mainWindow;
let settingsWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the Express server URL
  mainWindow.loadURL('http://localhost:3000');
}

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 400,
    height: 400,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  settingsWindow.loadFile(path.join(__dirname, 'src', 'views', 'settings.ejs'));
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

app.whenReady().then(() => {
  serverApp.listen(3000, () => {
    console.log('Express server running on port 3000');
    createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('open-settings', () => {
  if (!settingsWindow) {
    createSettingsWindow();
  }
});

ipcMain.on('settings-saved', () => {
  if (settingsWindow) {
    settingsWindow.close();
  }
});

