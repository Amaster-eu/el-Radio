const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    center: true,
    width: 1200,
    height: 600,
    minWidth: 402,
    minHeight: 165,
    icon: path.join(__dirname, 'assets/icons/logo.png')
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  let { ipcMain } = electron;
  ipcMain.on('resize', function (e, x, y) {
    mainWindow.setSize(x, y);
    if (y === 165) {
    mainWindow.minHeight = 165;
    }
  });

  // DevTools
  // mainWindow.webContents.openDevTools();
}

app.on('ready', function () {
  createMainWindow();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
