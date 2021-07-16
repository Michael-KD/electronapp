const {BrowserWindow} = require('electron').remote;
const ipcRendererForButtons = require('electron').ipcRenderer;

function init() {
    // Minimize task
    document.getElementById("minimize-button").addEventListener("click", (e) => {
        var window = BrowserWindow.getFocusedWindow();
        window.minimize();
    });

    // Maximize window
    document.getElementById("maximize-button").addEventListener("click", (e) => {
        var window = BrowserWindow.getFocusedWindow();
        if(window.isMaximized()){
            window.unmaximize();
        }else{
            window.maximize();
        }
    });

    // Close app
    document.getElementById("close-button").addEventListener("click", (e) => {
        var window = BrowserWindow.getFocusedWindow();
        window.close();
    });

    document.getElementById("settings-button").addEventListener("click", (e) => {
        ipcRendererForButtons.send('show-settings');
    });
};

document.onreadystatechange =  () => {
    if (document.readyState == "complete") {
        init();
    }
};
