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
    }
  } catch (error) {
    console.error(error);
  }
};

const agregarProducto = async () => {
  console.log("agregarProducto");
  const productoAgregar = document.getElementById("busquedaProducto").value;
  console.log("🚀 ~ file: facturar.js:27 ~ agregarProducto ~ productoAgregar:", productoAgregar);
};
