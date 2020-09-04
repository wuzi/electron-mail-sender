'use strict'

import fs from 'fs'
import path from 'path'
import ejs from 'ejs'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import { createTransport } from 'nodemailer'
import Store from 'electron-store'

declare const __static: string;
const isDevelopment = process.env.NODE_ENV !== 'production'

interface WindowBounds {
  width: number;
  height: number;
}

interface TransportSettings {
  host: string | null;
  port: number | null;
  auth: {
    user: string | null;
    pass: string | null;
  };
}

interface SendMailDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Create a store instance
const store = new Store({
  // We'll call our data file 'user-preferences'
  name: 'user-preferences',
  defaults: {
    windowBounds: {
      width: 1000,
      height: 800
    },
    transport: {
      host: null,
      port: null,
      auth: {
        user: null,
        pass: null
      }
    }
  }
})

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow () {
  let { width, height } = store.get('windowBounds') as WindowBounds;

  // Create the browser window.
  win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    win.removeMenu()
  }

  // The resize event is emitted when the window size changes.
  win.on('resize', () => {
    if (!win) return

    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let { width, height } = win.getBounds();

    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
  });

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// Receive recipient data from the renderer
ipcMain.on('sendEmail', async (event, arg: SendMailDto) => {
  const { host, port, auth } = store.get('transport') as TransportSettings;

  if (!host || !port || !auth.user || !auth.pass) {
    event.returnValue = 'missing_transport'
    return
  }

  const transporter = createTransport({
    host,
    port,
    secure: false,
    auth: {
      user: auth.user,
      pass: auth.pass
    }
  })

  const html = ejs.render(fs.readFileSync(path.join(__static, 'template.ejs'), 'utf-8'), arg)

  const options = {
    from: auth.user,
    to: arg.email,
    subject: arg.subject,
    html
  }

  await transporter.sendMail(options)
  event.returnValue = 'success'
})

// Receive SMTP config
ipcMain.on('saveSMTP', (event, arg: TransportSettings) => {
  store.set('transport', arg);
  event.returnValue = 'success'
})

// Send SMTP config
ipcMain.on('getSMTP', (event) => {
  event.returnValue = store.get('transport')
})
