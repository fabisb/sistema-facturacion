// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const Store = require("electron-store");
const path = require("path");

const electronReload = require("electron-reload");
const env = process.env.NODE_ENV || "development";
if (env === "development") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
    hardResetMethod: "exit",
    ignored: /main\.js/,
  });
}
const store = new Store();
const productos = new Store();
//productos.set("productos", []);
const existenciaStore = new Store();
store.clear();
productos.clear();
existenciaStore.clear();

ipcMain.on("setTicketProducto", async (event, producto) => {
  const productoStorage = productos.get("productos");
  console.log("🚀 ~ file: main.js:22 ~ ipcMain.on ~ productoStorage:", productoStorage);
  if (!productoStorage) {
    await store.set("productos", [producto]);
  } else {
    const productosExistenteStorage = await store.get("productos", productos);
    console.log(
      "🚀 ~ file: main.js:27 ~ ipcMain.on ~ productosExistenteStorage:",
      productosExistenteStorage
    );
    productosExistenteStorage.push(producto);
    await store.set("productos", productosExistenteStorage);
  }
});
ipcMain.handle("getTicketProducto", async (event, producto) => {
  const productoStorage = productos.get("productos");
  console.log("🚀 ~ file: main.js:37 ~ ipcMain.on ~ productoStorage:", productoStorage);
  return productoStorage;
});
ipcMain.on("setExistencia", async (event, existencia) => {
  console.log("🚀 ~ file: main.js:41 ~ ipcMain.on ~ existencia:", existencia);
  await existenciaStore.set("existencia", existencia);
});
ipcMain.handle("getExistencia", async (event, producto) => {
  const existenciaStorage = existenciaStore.get("existencia");
  console.log("🚀 ~ file: main.js:42 ~ ipcMain.on ~ existenciaStorage:", existenciaStorage);
  return existenciaStorage;
});
ipcMain.on("token", async (event, token) => {
  store.clear();
  await store.set("token", token);
});
ipcMain.handle("getToken", (event, arg) => {
  const token = store.get("token");
  return token;
});
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
      preload: path.join(__dirname, "app/preloads/preload.js"),
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
      preload: path.join(__dirname, "app/preloads/preload.js"),
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
      preload: path.join(__dirname, "app/preloads/preload.js"),
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
      preload: path.join(__dirname, "app/preloads/preload.js"),
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
ipcMain.handle("createWindow", () => createWindow());

ipcMain.handle("alertWindow", async (event, { titulo, body }) => {
  const currentWindow = event.sender.getOwnerBrowserWindow();
  const result = await dialog.showMessageBox(currentWindow, {
    type: "info",
    message: titulo,
    detail: body,
    buttons: ["OK", "Cancel"],
    defaultId: 0,
    title: "Alerta",
    cancelId: 1,
  });
  console.log("🚀 ~ file: main.js:102 ~ ipcMain.handle ~ result:", result);
  return result;
});
ipcMain.handle("errorWindow", async (event, arg) => {
  const currentWindow = event.sender.getOwnerBrowserWindow();
  const result = await dialog.showErrorBox("ERROR", "Ha ocurrido un error en el servidor");
  console.log("🚀 ~ file: main.js:102 ~ ipcMain.handle ~ result:", result);
  return result;
});
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
