import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import path, { join } from 'path'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import migrations from './migrations'
import token from './security/token'
import utils from './utils/utils'
import Ipc from './ipc'
import Controller from './controller'


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  const ipc = new Ipc(mainWindow.webContents)
  const controller = new Controller()

  migrations.createTables()

  ipc.request('setup_check',  async (data) => {
    if(data.action === 'Setting.save'){
      data.data.token = token.encode(data.data.adminpass)
    }
    const exec = await controller.exec_query(data)
    ipc.response(data.listen, exec)
  })

  ipc.request('big_boss',  async (data) => {
    const exec = await controller.exec_query(data)
    ipc.response(data.listen, exec)
  })

  ipc.request('upload_image', (data) => {
    const upDir = path.join(app.getPath('userData'), 'uploads')
    if(!fs.existsSync(upDir)){
      fs.mkdirSync(upDir, {recursive: true})
    }

    const filePath = path.join(upDir, utils.rdname(10)+'.jpeg')
    fs.writeFile(filePath, Buffer.from(data.image, 'base64'), (err) => { console.log(err)})
    ipc.response(data.listen, filePath)
  })

  mainWindow.on('ready-to-show', () => {
    
    // mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
