const listRenderer = async () => {
  try {
    console.log("listRenderer");
    const token = await login.getToken();

    const { data: productos } = await axios.get(urlsv + "/api/factura/productos", {
      headers: { token: token.token },
    });
    console.log("🚀 ~ file: facturar.js:9 ~ render ~ productos:", productos);
    if (productos) {
      const selectsTipo = productos
        .map(
          (tipo) =>
            `<option  onselect="agregarProducto()" productoId='${tipo.id}' value='${tipo.nombre}'>${tipo.cantidad} UND || ${tipo.precio} ${tipo.moneda}</option>`
        )
        .join("");
      document.getElementById("productoOption").innerHTML = selectsTipo;
      await ticket.storeExistencia(productos);
    } //agregar else para validar que no llegaron productos
    const ticketActual = await ticket.getStore();
    console.log("🚀 ~ file: facturar.js:21 ~ listRenderer ~ ticketActual:", ticketActual);
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
    const preliminarDiv = document.getElementById("preliminarTicket");
    let sumaDetalles = 0;

    const ticketPre = ticketActual
      .map((p) => {
        sumaDetalles += (p.precio * p.lleva).toFixed(2);
        return `<div producto-id='${p.id}' class="card my-1">
    <div class="row g-0">
      <div class="col-md-4 text-center position-relative">
        <p class="position-absolute top-50 start-50 translate-middle fw-semibold">${p.lleva} ${p.metrica}</p>
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h6 class="card-title">${p.nombre}</h6>
          <p class="card-text">
            <small class="text-body-secondary">${p.precio} ${p.moneda}</small>
          </p>
        </div>
      </div>
    </div>
  </div>`;
      })
      .join("");
    preliminarDiv.innerHTML = ticketPre;
    console.log("🚀 ~ file: facturar.js:53 ~ agregarProducto ~ sumaDetalles:", sumaDetalles);

    document.getElementsByName("totalBruto")[0].innerText =
      "Total Bruto: " + parseFloat(sumaDetalles).toFixed(2) + " Bs";
    document.getElementsByName("totalIva")[0].innerText =
      "IVA (16%): " + (parseFloat(sumaDetalles) * 0.16).toFixed(2) + " Bs";
    document.getElementsByName("totalNeto")[0].innerText =
      "Total Neto: " +
      (parseFloat(sumaDetalles) + parseFloat(sumaDetalles) * 0.16).toFixed(2) +
      " Bs";
  }
};

const imprimirFactura = async () => {
  console.log("imprimirFactura");

  const cedula = document.getElementsByName("cedulaForm")[0].value;
  const nombre = document.getElementsByName("nombreForm")[0].value;
  const direccion = document.getElementsByName("direccionForm")[0].value;
  const telefono = document.getElementsByName("telefonoForm")[0].value;

  if (!cedula || !nombre || !direccion || !telefono) {
    return alerta.alert("ERROR", "Error al ingresar datos");
  }
  try {
    const ticketActual = await ticket.getStore();
    const token = await login.getToken();

    if (ticketActual.length == 0) {
      return alerta.alert("ERROR", "No hay productos agregados");
    }
    const validacionLleva = ticketActual.find((tk) => tk.lleva > tk.cantidad);
    if (validacionLleva) {
      return alerta.alert("ERROR", "Esta llevando mas de lo aceptado en un producto");
    }
    let total = 0;
    ticketActual.forEach((tk) => {
      total += parseFloat(tk.lleva).toFixed(0) * parseFloat(tk.precio).toFixed(2);
    });
    const factura = {
      detalle: ticketActual,
      cliente: { cedula, nombre, direccion, telefono },
      monto: total,
      moneda: "Bs",
    };

    const { data } = await axios.post(
      urlsv + "/api/factura/crear",
      {
        ticket: factura,
      },
      {
        headers: { token: token.token },
      }
    );
    var datos = [
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: `///   user   ///`,
        style: {
          fontWeight: "800",
          textAlign: "center",
          fontSize: "10px",
          fontFamily: "Arial",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `---Id: ${data.id}`,
        style: { fontSize: "10px", fontFamily: "Arial", fontWeight: "800" },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `---Cedula: ${data.cliente.cedula}`,
        style: { fontSize: "10px", fontFamily: "Arial", fontWeight: "800" },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `---fecha: ${data.fecha}`,
        style: { fontSize: "10px", fontFamily: "Arial", fontWeight: "800" },
      },
    ];
    data.ticket.detalle.map((tk) => {
      datos.push({
        type: "table",
        // style the table
        style: { border: "1px solid #ddd" },
        // list of the columns to be rendered in the table header
        tableHeader: [tk.nombre],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [`${tk.lleva} || ${tk.precio} ${tk.metrica}`],
        // list of columns to be rendered in the table footer
        tableFooter: [],
        // custom style for the table header
        tableHeaderStyle: { fontFamily: "Arial", border: "1.5px solid black" },
        // custom style for the table body
        tableBodyStyle: { border: "0.5px solid #ddd", fontWeight: "700" },
        // custom style for the table footer
        tableFooterStyle: {},
      });
    });

    datos.push(
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: `Total: ${total} Bs`,
        style: {
          fontSize: "10px",
          textAlign: "right",
          fontWeight: "800",
          fontFamily: "Arial",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: "Gracias por su compra!",
        style: {
          fontSize: "12px",
          textAlign: "center",
          fontWeight: "700",
          fontFamily: "Arial",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: "/",
        style: {
          fontSize: "12px",
          textAlign: "center",
          fontWeight: "700",
          fontFamily: "Arial",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: "/",
        style: {
          fontSize: "12px",
          textAlign: "center",
          fontWeight: "700",
          fontFamily: "Arial",
        },
      }
    );
    console.log("🚀 ~ file: facturar.js:122 ~ imprimirFactura ~ data:", datos);
    await imprimir(datos);
  } catch (error) {
    console.log(error);
  }
};
