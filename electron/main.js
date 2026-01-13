const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

let mainWindow;
let nextProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Remove default menu
    autoHideMenuBar: true,
  });

  // URL of the local Next.js server
  const url = 'http://localhost:3000';

  // Wait for the server to be ready before loading the window
  waitOn({ resources: [url] }, (err) => {
    if (err) {
      console.error('Failed to wait for server:', err);
      return;
    }
    mainWindow.loadURL(url);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  const isDev = process.env.NODE_ENV === 'development';
  const rootPath = isDev ? path.join(__dirname, '..') : app.getAppPath();
  
  if (isDev) {
    // In development, we use the existing npm run dev command
    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const args = ['run', 'dev'];

    nextProcess = spawn(command, args, {
      cwd: rootPath,
      env: { 
        ...process.env, 
        NODE_ENV: 'development',
        DATABASE_URL: `file:${path.join(rootPath, 'prisma', 'dev.db')}`
      },
      shell: true,
    });

    nextProcess.stdout.on('data', (data) => console.log(`Next.js: ${data}`));
    nextProcess.stderr.on('data', (data) => console.error(`Next.js Error: ${data}`));
    
    createWindow();
  } else {
    // In production, we fork the serve.js script
    // This avoids using cmd.exe or shell: true
    const servePath = path.join(__dirname, 'serve.js');
    
    // rootPath is .../app.asar
    // We cannot use a file as cwd. We must use the directory containing it.
    const cwdPath = path.dirname(rootPath); 

    nextProcess = require('child_process').fork(servePath, [], {
      cwd: cwdPath,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        // Note: attempting to write to this DB inside ASAR will fail. 
        // Read-only access might work if SQLite supports it.
        DATABASE_URL: `file:${path.join(rootPath, 'prisma', 'dev.db')}`
      }
    });

    nextProcess.on('message', (msg) => {
      console.log('Next.js process message:', msg);
    });

    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (nextProcess) nextProcess.kill();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
