// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const electronReload = require("electron-reload");
const env = process.env.NODE_ENV || "development";
if (env === "development") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
    hardResetMethod: "exit",
  });
}
function createWindow() {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Menu",
    webPreferences: {
      preload: path.join(__dirname, "app/preloads/preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("app/screens/index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
function facturarWindow() {
  let facturarWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Facturar",
    webPreferences: {
      preload: path.join(__dirname, "app/preloads/facturar.js"),
      //devTools:false
    },
  });
  facturarWindow.loadFile("app/screens/facturar.html");
  facturarWindow.on("closed", () => (facturarWindow = null));
}
function agregarWindow() {
  let agregarWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Agregar Producto",
    webPreferences: {
      preload: path.join(__dirname, "app/preloads/agregar.js"),
      //devTools:false
    },
  });
  agregarWindow.loadFile("app/screens/agregar.html");
  agregarWindow.on("closed", () => (agregarWindow = null));
}
function consultarWindow() {
  let consultarWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Consultar Factura",
    webPreferences: {
      preload: path.join(__dirname, "app/preloads/consultar.js"),
      //devTools:false
    },
  });
  consultarWindow.loadFile("app/screens/consultar.html");
  consultarWindow.on("closed", () => (consultarWindow = null));
}
function editarWindow() {
  let editarWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Editar Producto",
    webPreferences: {
      preload: path.join(__dirname, "app/preloads/editar.js"),
      //devTools:false
    },
  });
  editarWindow.loadFile("app/screens/editar.html");
  editarWindow.on("closed", () => (editarWindow = null));
}

ipcMain.handle("facturarWindow", () => facturarWindow());
ipcMain.handle("editarWindow", () => editarWindow());
ipcMain.handle("agregarWindow", () => agregarWindow());
ipcMain.handle("consultarWindow", () => consultarWindow());

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
