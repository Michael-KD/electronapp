var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var _this = this;
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow, remote = _a.remote, ipcMain = _a.ipcMain, Menu = _a.Menu;
var totalmem = require('os').totalmem;
var os = require('os-utils');
var path = require('path');
var Store = require('electron-store');
var schema = {
    height: {
        type: 'number',
        "default": 600
    },
    width: {
        type: 'number',
        "default": 1000
    },
    darkMode: {
        type: 'boolean',
        "default": false
    }
};
var store = new Store({ schema: schema });
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}
var width = store.get('width');
var height = store.get('height');
var createWindow = function () {
    // Create the browser window.
    var mainWindow = new BrowserWindow({
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
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    ipcMain.on('show-settings', function (event, arg) {
        var settingsWindow = new BrowserWindow({
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
    setInterval(function () {
        os.cpuUsage(function (v) {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('cpu', v * 100);
                mainWindow.webContents.send('mem', 100 - (os.freememPercentage() * 100));
                mainWindow.webContents.send('total-mem', os.totalmem() / 1024);
                // console.log(store.get('test'));
                var windowDims = mainWindow.getSize();
                // console.log(windowDims);
                store.set('height', windowDims[1]);
                store.set('width', windowDims[0]);
                // console.log(app.getPath('appData'));
            }
        });
    }, 1000);
};
//create custom electron menu
var isMac = process.platform === 'darwin';
var template = __spreadArray(__spreadArray([], (isMac ? [{
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
    }] : [])), [
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
        submenu: __spreadArray([
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' }
        ], (isMac ? [
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
        ]))
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
        submenu: __spreadArray([
            { role: 'minimize' },
            { role: 'zoom' }
        ], (isMac ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
        ] : [
            { role: 'close' }
        ]))
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
                click: function () { return __awaiter(_this, void 0, void 0, function () {
                    var shell;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                shell = require('electron').shell;
                                return [4 /*yield*/, shell.openExternal('https://electronjs.org')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }
            },
            {
                label: 'My Portfolio',
                click: function () { return __awaiter(_this, void 0, void 0, function () {
                    var shell;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                shell = require('electron').shell;
                                return [4 /*yield*/, shell.openExternal('https://michaelkd.herokuapp.com/')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }
            }
        ]
    }
]);
var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
