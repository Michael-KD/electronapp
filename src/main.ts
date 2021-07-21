const { app, session, BrowserWindow, remote, ipcMain, Menu } = require('electron');
const { totalmem } = require('os');
const os = require('os-utils');
const path = require('path');
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
    frame: false,
    // icon: path.join(__dirname, 'assets/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
  }
});

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'react.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

ipcMain.on('show-settings', (event, arg) => {
  const settingsWindow = new BrowserWindow({
    width: 600,
    height: 400,
    parent: mainWindow,
    frame: false,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  settingsWindow.loadFile(path.join(__dirname, 'settings.html'));
});


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

//create custom electron menu
const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    label: 'Zoom',
    submenu: [
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'resetZoom' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }, 
      },
      {
        label: 'My Portfolio',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://michaelkd.herokuapp.com/')
        },
        
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


// const reactDevToolsPath = 'C:/Users/micha/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi'

// app.whenReady().then(async () => {
//   await session.defaultSession.loadExtension(reactDevToolsPath)
// })


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
