const { app, BrowserWindow, remote, ipcMain } = require('electron');
const { totalmem } = require('os');
const os = require('os-utils');
const path = require('path');
const si = require('systeminformation');
const Store = require('electron-store');


const schema = {
	height: {
		type: 'number',
		default: 600 
	},
  width: {
		type: 'number',
		default: 1000 
	},
  darkMode: {
    type: 'boolean',
    default: false
  }
};

const store = new Store({schema});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let width = store.get('width');
let height = store.get('height');
const createWindow = () => {
  
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
  }
});

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

// store.set('test', 'hi this is a test');


setInterval(() => {
  os.cpuUsage(function(v){
    if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('cpu', v*100);
    mainWindow.webContents.send('mem', 100 - (os.freememPercentage()*100));
    mainWindow.webContents.send('total-mem', os.totalmem()/1024);
    // console.log(store.get('test'));
    let windowDims = mainWindow.getSize();
    // console.log(windowDims);
    store.set('height', windowDims[1]);
    store.set('width', windowDims[0]);
    // console.log(app.getPath('appData'));
    }
  });
},1000);

};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
