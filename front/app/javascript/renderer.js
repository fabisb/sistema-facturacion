/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

function renderer() {
  document.getElementById("isLog").hidden = true;
}

function loguear(e) {
  e.preventDefault()
  const user = document.getElementById('userLog').value;
  console.log("🚀 ~ file: renderer.js:17 ~ loguear ~ user:", user)
  const pass = document.getElementById('passwordLog').value;
  console.log("🚀 ~ file: renderer.js:19 ~ loguear ~ pass:", pass)
  if (user == '' || pass == '') {
    return


  }
}

async function facturarWindow() {
  console.log("facturarWindow");
  await ventanas.facturarWindow();
}
async function consultarWindow() {
  console.log("consultarWindow");
  await ventanas.consultarWindow();
}
async function agregarWindow() {
  console.log("agregarWindow");
  await ventanas.agregarWindow();
}
async function editarWindow() {
  console.log("editarWindow");
  await ventanas.editarWindow();
}
