const { contextBridge, ipcRenderer, dialog } = require("electron");

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
contextBridge.exposeInMainWorld("urlsv",'http://localhost:3000');
contextBridge.exposeInMainWorld("login", {
  login: async (user, pass) => {
    const result = ipcRenderer.sendSync("login", { user, pass });
    console.log(result);
    return result;
  },
  getCookie: (name) => {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  },
});

contextBridge.exposeInMainWorld("alerta", {
  alert: async (titulo, body) => {
    const result = await ipcRenderer.invoke("alertWindow", { titulo, body });
    console.log("🚀 ~ file: preload.js:29 ~ alert: ~ result:", result);
    return result;
  },
  error:async () => {
    const result = await ipcRenderer.invoke("errorWindow");
    console.log("🚀 ~ file: preload.js:44 ~ error: ~ result:", result)
    return result;
  },
});
