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


async function loguear(e) {
  e.preventDefault()
  const user = document.getElementById('userLog').value;
  console.log("🚀 ~ file: renderer.js:17 ~ loguear ~ user:", user)
  const pass = document.getElementById('passwordLog').value;
  console.log("🚀 ~ file: renderer.js:19 ~ loguear ~ pass:", pass)
  if (user == '' || pass == '') {
    const res = await alerta.alert('Error al iniciar sesion','Los datos ingresados no son validos')
    console.log("🚀 ~ file: renderer.js:21 ~ loguear ~ res:", res)
    return  
  }try {
    const res=await axios.post(urlsv+'/api/users/login',{user,pass})
    console.log("🚀 ~ file: renderer.js:26 ~ loguear ~ res:", res)
    console.log(document.cookie)
    login.getCookie('token')
  } catch (error) {
    console.log(error)
    if (error.response.data.mensaje) {
      
      const res = await alerta.alert('Error al iniciar sesion',error.response.data.mensaje)
      return res
    }else{
      return await alerta.error()
    }
  }
  
  
  document.getElementById("isLog").hidden = false;
  document.getElementById("login").hidden = true;

  

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
