const listRenderer = async () => {
  try {
    console.log("listRenderer");
    const token = await login.getToken();

    const { data: productos } = await axios.get(urlsv + "/api/factura/productos", {
      headers: { token: token.token },
    });
    console.log("🚀 ~ file: facturar.js:3 ~ render ~ productos:", productos);
    if (productos) {
      const selectsTipo = productos
        .map(
          (tipo) =>
            `<option  onselect="agregarProducto()" productoId='${tipo.id}' value='${tipo.nombre}'>${tipo.cantidad} UND</option>`
        )
        .join("");
      document.getElementById("productoOption").innerHTML = selectsTipo;
      await ticket.storeExistencia(productos);
    } //agregar else para validar que no llegaron productos
  } catch (error) {
    console.error(error);
  }
};

const agregarProducto = async () => {
  console.log("agregarProducto");
  const productoAgregar = document.getElementById("busquedaProducto").value;
  const cantidadAgregar = parseFloat(document.getElementById("cantidadProducto").value);
  if (isNaN(cantidadAgregar) || !cantidadAgregar || !productoAgregar) {
    return alerta.alert("ERROR", "Error al ingresar producto o cantidad");
  }
  console.log("🚀 ~ file: facturar.js:27 ~ agregarProducto ~ productoAgregar:", productoAgregar);
  const existencias = await ticket.getExistencia();
  if (existencias) {
    const producoExistente = existencias.find((el, i) => el.nombre == productoAgregar);

    if (!producoExistente) {
      const errorAlert = document.getElementById("errorAlert");

      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(errorAlert);
      toastBootstrap.show();
      return;
    }
    producoExistente.lleva = parseFloat(cantidadAgregar).toFixed(2);

    await ticket.store(producoExistente);
    const ticketActual = await ticket.getStore();
    console.log("🚀 ~ file: facturar.js:45 ~ agregarProducto ~ ticketActual:", ticketActual);
  }
};
