const {app, dialog, BrowserWindow, Menu} = require('electron')
const path = require('path')
const {createMenu} = require('./menu')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const projectsWindows = new Map()

function createProjectWindow(projectDir) {
  const oldProjectWindow = projectsWindows.get(projectDir)
  if (oldProjectWindow) {
    oldProjectWindow.show()
  } else {
    // Create the browser window.
    const projectWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      title: `API designer - ${projectDir}`,
      backgroundColor: '#ffffff',
      icon: path.join(__dirname, './build/logo.png')
    })

    // warn before closing unsaved
    // projectWindow.on('close', function(e){
    //   console.log(projectWindow.location.hash)
    //   if (projectWindow.location.hash === 'unsaved') {
    //     const choice = dialog.dialog.showMessageBox(this, {
    //       type: 'question',
    //       buttons: ['Stay', 'Leave'],
    //       title: 'Confirm',
    //       message: 'You have unsaved changed.'
    //     });
    //     if (choice == 1) {
    //       e.preventDefault();
    //     }
    //   }
    // });

    // and load the index.html of the app.
    projectWindow.loadURL(`file://${__dirname}/index.html?projectDir=${encodeURIComponent(projectDir)}`);

    // Open the DevTools.
    // projectWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    projectWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      projectsWindows.delete(projectDir)
    })

    projectsWindows.set(projectDir, projectWindow)

    // when opening files, add to recent
    // app.addRecentDocument(projectDir)
  }
}

function openNewProject() {
  const projectDir = dialog.showOpenDialog({
    title: 'Open project',
    buttonLabel: 'Open project',
    properties: ['openDirectory', 'createDirectory']
  })

  if (projectDir) {
    createProjectWindow(projectDir[0])
  } else if (projectsWindows.size === 0) {
    app.quit()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function appReady() {
  const menuTemplate = createMenu(openNewProject)
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
  openNewProject()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})

// Dragging files out of the window
// const ipcMain = electron.ipcMain;
// ipcMain.on('ondragstart', (event, filePath) => {
//   event.sender.startDrag({
//     file: filePath
//     // icon: '/path/to/icon.png'
//   })
// })