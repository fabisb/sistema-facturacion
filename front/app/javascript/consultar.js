async function consultarTicket() {
  const idTicket = document.getElementById("idTicketForm").value;
  if (!idTicket || isNaN(idTicket)) {
    return await alerta.alert("ERROR", "Ingrese un id antes de continuar");
  }
  try {
    const token = await login.getToken();

    const { data } = await axios.get(urlsv + "/api/factura/consultar/", {
      headers: { token: token.token },

      params: { id: idTicket },
    });
    console.log("🚀 ~ file: consultar.js:13 ~ consultarTicket ~ data:", data);
    const container = data.detalle.map((det) => {
      return `
      <div class="card-header">
            ${det.producto.nombre}
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Tipo: ${det.producto.tipo}</li>
            <li class="list-group-item">Lleva: ${det.cantidad} ${det.metrica}</li>
            <li class="list-group-item">Precio: ${det.precio} ${det.producto.moneda}</li>
            <li class="list-group-item">Total: ${det.total} Bs</li>
          </ul>
      `;
    });
    document.getElementById("detalleContainer").innerHTML = container.join("");
    document.getElementById("modalTitle").innerText = "Ticket #" + data.ticket[0].id;
    document.getElementById("clienteModal").innerText = "Cliente: V-" + data.ticket[0].cliente;
    document.getElementById("totalModal").innerText =
      "Total: " + data.ticket[0].monto + " " + data.ticket[0].moneda;
  } catch (error) {
    console.log(error);
    return error.response.data.mensaje
      ? await alerta.alert("ERROR", error.response.data.mensaje)
      : await alerta.alert("ERROR", "Error con el servidor");
  }
}
