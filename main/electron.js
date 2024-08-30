const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { spawn } = require('child_process');
const path = require("path");

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });
  // mainWindow.loadURL("http://localhost:3000"); // DEV
  mainWindow.loadURL(`file://${__dirname}/../admin-frontend/build/index.html`); // PROD
  mainWindow.on("closed", () => (mainWindow = null));
}

function startServers() {
  // const backendPath = path.join(__dirname, '../admin-backend/server.js'); // DEV
  // backendProcess = exec(`node ${backendPath}`); // DEV
  // const backendPath = path.join(__dirname, '../admin-backend/dist/admin-backend'); // PROD
  const backendPath = path.join(process.resourcesPath, 'admin-backend/dist/admin-backend');
  
  backendProcess = spawn(backendPath); // PROD

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend INFO: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend ERROR: ${data}`);
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend process:', err);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

app.on("ready", async () => {
  // try {
  //   await startServers();
  //   createWindow();
  // } catch (error) {
  //   console.error("Failed to start servers:", error);
  //   app.quit();
  // }
  startServers();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// to kill the backend process when the app is to quit.
app.on("before-quit", () => {
  if (backendProcess) {
    backendProcess.kill('SIGINT');
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
