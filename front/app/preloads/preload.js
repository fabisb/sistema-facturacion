const { contextBridge, ipcRenderer } = require("electron");

/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

contextBridge.exposeInMainWorld("ventanas", {
  facturarWindow: async () => await ipcRenderer.invoke("facturarWindow"),
  agregarWindow: async () => await ipcRenderer.invoke("agregarWindow"),
  consultarWindow: async () => await ipcRenderer.invoke("consultarWindow"),
  editarWindow: async () => await ipcRenderer.invoke("editarWindow"),
});

contextBridge.exposeInMainWorld("login", {
  login: async (user, pass) => {
    const result = ipcRenderer.sendSync("login", { user, pass });
    console.log(result);
    return result;
  },
});
