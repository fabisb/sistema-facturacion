const agregarProductoForm = async () => {
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
  console.log("🚀 ~ file: agregar.js:6 ~ agregarProductoForm ~ token:", token);
  const data = await axios.post(
    urlsv + "/api/productos/agregar",
    {
      nombre,
      cantidad,
      tipo,
    },
    { headers: { token: token.token } }
  );
  console.log("🚀 ~ file: agregar.js:30 ~ agregarProductoForm ~ data:", data);
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
