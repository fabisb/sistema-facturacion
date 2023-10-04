const editarProductoForm = async () => {
  const nombre = document.getElementById("nombreForm").value;
  const cantidad = document.getElementById("cantidadForm").value;
  const tipo = document.getElementById("tipoProductoList").value;
  if (nombre == "" || cantidad == "" || cantidad == 0 || tipo == "") {
    console.log("Error falta algun dato");
    return alerta.alert(
      "Error al ingresar datos",
      "Verifique los datos ingresados e intente nuevamente"
    );
  } else if (isNaN(cantidad)) {
    console.log("Error tipo de dato");
    return alerta.alert(
      "Error al ingresar datos",
      "Verifique los tipos de datos ingresados e intente nuevamente"
    );
  }
  const token = await login.getToken();
  console.log("🚀 ~ file: editar.js:6 ~ editarProductoForm ~ token:", token);
  try {
    const data = await axios.post(
      urlsv + "/api/productos/editar",
      {
        nombre,
        cantidad,
        tipo,
      },
      { headers: { token: token.token } }
    );
    const toastLiveExample = document.getElementById("liveToast");

    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
  } catch (error) {
    console.log(error.response.data);
    if (error.response.data.mensaje) {
      console.log(error.response.data.mensaje);
      return alerta.alert("Error servidor", error.response.data.mensaje);
    }
  }
};
const tipoCantidad = () => {
  const cantidadTipo = document.getElementById("cantidadTipoBtn");
  const tipo = cantidadTipo.innerText;
  const cantidadValue = document.getElementById("cantidadForm");
  console.log(cantidadValue.step);
  if (tipo == "Unidad") {
    cantidadValue.value = 0;
    cantidadTipo.innerText = "Decimal";
    cantidadValue.step = 0.01;
  } else {
    cantidadValue.value = 0;
    cantidadTipo.innerText = "Unidad";
    cantidadValue.step = 1;
  }
};

const render = async () => {
  var myModal = document.getElementById("editarModal");
  var modal = new bootstrap.Modal(myModal);
  modal.show();
};

const buscarEditado = async () => {
  try {
    axios.get(urlsv + "/productos/idProducto", {
      params: {
        nombre: "valor de consulta",
        tipo: "valor de otro parámetro",
      },
    });
    var myModal = document.getElementById("editarModal");

    var modal = bootstrap.Modal.getInstance(myModal);
    // Ocultar el modal
    modal.hide();
  } catch (error) {
    console.log(error);
  }
};

const buscarPorTipo = async () => {
  const tipo = document.getElementById("tipoProductoOptions").value;
  console.log("🚀 ~ file: editar.js:85 ~ buscarPorTipo ~ tipo:", tipo);
  if (tipo == "") {
    console.log("Error falta algun dato");
    return alerta.alert(
      "Error al ingresar datos",
      "Verifique los datos ingresados e intente nuevamente"
    );
  }

  try {
    axios.get(urlsv + "/productos/idTipoProducto", {
      params: {
        tipo,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
