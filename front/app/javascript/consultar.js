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
  } catch (error) {
    console.log(error);
    return error.response.data.mensaje
      ? await alerta.alert("ERROR", error.response.data.mensaje)
      : await alerta.alert("ERROR", "Error con el servidor");
  }
}
