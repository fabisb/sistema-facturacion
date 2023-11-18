async function consultarTicket() {
    const idTicket = document.getElementById('idTicketForm').value;
    if (!idTicket || isNaN(idTicket)) {
      return alerta.alert("ERROR", "Ingrese un id antes de continuar");
    }
    const token = await login.getToken();

    await axios.get(urlsv +'/factura/',{
        headers: { token: token.token },

        params: {id:idTicket}
    })
}