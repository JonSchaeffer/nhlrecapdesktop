const electron = require('electron');
const path = require('path');
const url = require('url');

//SET Environment
process.env.NODE_ENV = 'production';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

//Listen for the app to be ready
app.on('ready', function(){
    //Create a new window
    mainWindow = new BrowserWindow({});
    //Load HTML in the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert a menu
    Menu.setApplicationMenu(mainMenu);
});

//Handle the favorite window
function createFavoriteWindow(){
    addWindow = new BrowserWindow({
        width: 600,
        height: 750,
        title:'Select Favorite Team(s)'
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'favoriteWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    //Handle garbage collection!
    addWindow.on('close', function(){
        addWindow = null;
    });
}

//Create the Menu Template
const mainMenuTemplate = [
    //Each object is a dropdown
    {
        label: 'File',
        submenu:[
            {
                label: 'Quit',
                accelerator:process.platform == 'darwin' ? 'Command+q' : 'Ctrl+q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//If os == MacOS then add empty object to menu ro remove the "electron" menu item
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//Add developer tools option if in developer environment
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                role: 'reload',
                accelerator:process.platform == 'darwin' ? 'Command+r' : 'Ctrl+r',
                click(){
                    app.reload();
                }
            },
            {
                label: 'Toggle DevTools',
                accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}