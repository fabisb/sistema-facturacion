import { pool } from "../database/db.js";

export const productosController = async (req, res) => {
  const [productos] = await pool.execute("SELECT * FROM productos");

  if (productos.length > 0) {
    const [cantidadProductos] = await pool.execute("SELECT * FROM cantidad_producto");
    if (!(cantidadProductos.length > 0)) {
      return await res
        .status(400)
        .json({ mensaje: "No se han encontrado cantidades de productos" });
    } else {
      const productosUnidos = [];

      // Recorremos el primer arreglo con un bucle for-of
      for (let producto of productos) {
        // Buscamos si hay algún objeto en el segundo arreglo que tenga el mismo id
        let productosCantidad = cantidadProductos.find(
          (product) => product.id_producto === producto.id
        );
        // Si lo encontramos, creamos un nuevo objeto que combine las propiedades de ambos objetos
        if (productosCantidad) {
          let productoUnido = { ...producto, ...productosCantidad };
          // Agregamos el nuevo objeto al arreglo vacío
          productosUnidos.push(productoUnido);
        }
      }
      // Mostramos el resultado por consola
      console.log(
        "🚀 ~ file: factura.controller.js:30 ~ productosController ~ productosUnidos:",
        productosUnidos
      );

      return await res.status(200).json(productosUnidos);
    }
  } else {
    return await res.stauts(402).json({ mensaje: "No se han encontrado productos" });
  }
};

export const facturarController = async (req, res) => {
  const { ticket } = req.body;
  const { cliente } = ticket;
  const username = req.user;
  console.log("🚀 ~ file: factura.controller.js:41 ~ facturarController ~ username :", username);
  if (!ticket) {
    return await res.status(402).json({ mensaje: "No se ha encontrado ticket" });
  }
  const validacionDetalle = ticket.detalle.some((ele) => {
    if (ele.precio < 0 || !ele.precio) {
      console.log("Error en detalle precio");
      return;
    }
    if (ele.id_producto < 0 || !ele.id_producto) {
      console.log("Error en detalle id_producto");
      return;
    }
    if (ele.lleva < 0 || !ele.lleva) {
      console.log("Error en detalle cantidad");
      return;
    }
  });
  if (validacionDetalle) {
    return await res
      .status(402)
      .json({ mensaje: "Hay un error de dato en alguno de los detalles" });
  }
  try {
    const [factura] = await pool.execute(
      "INSERT INTO factura(monto, moneda, id_usuario, cliente) VALUES (?,?,?,?)",
      [ticket.monto, ticket.moneda, username.id, cliente.cedula]
    );
    if (!factura.insertId) {
      return await res.status(500).json({ mensaje: "Error al ingresar a la base de datos" });
    }

    const ticketDetalle = ticket.detalle.map((item) => {
      const total = parseFloat(item.lleva).toFixed(0) * parseFloat(item.precio).toFixed(2);
      console.log("🚀 ~ file: factura.controller.js:84 ~ ticketDetalle ~ total:", total);
      return [item.id_producto, item.lleva, factura.insertId, item.precio, total];
    });
    const [detalleFactura] = await pool.query(
      "INSERT INTO detalle_factura (id_producto, cantidad, id_factura, precio, total) VALUES ?",
      [ticketDetalle]
    );
    console.log(
      "🚀 ~ file: factura.controller.js:93 ~ facturarController ~ detalleFactura:",
      detalleFactura
    );
    const fecha = new Date();
    return await res.status(200).json({id:factura.insertId, ticket, detalleFactura, username,fecha, cliente });
  } catch (error) {
    console.error("🚀 ~ file: factura.controller.js:69 ~ facturarController ~ error:", error);
  }
};

export const agregarClienteController = async (req, res, next) => {
  const { ticket } = req.body;
  const { cliente } = ticket;
  console.log(
    "🚀 ~ file: factura.controller.js:101 ~ agregarClienteController ~ cliente:",
    cliente
  );
  if (
    !cliente.nombre ||
    !cliente.telefono ||
    !cliente.direccion ||
    isNaN(cliente.telefono) ||
    !cliente.cedula ||
    isNaN(cliente.cedula)
  ) {
    return await res.status(400).json({ mensaje: "Error en los datos del cliente" });
  }
  try {
    await pool.execute(
      "INSERT IGNORE INTO cliente(cedula, nombre, telefono, direccion) VALUES (?,?,?,?)",
      [cliente.cedula, cliente.nombre, cliente.telefono, cliente.direccion]
    );
    next();
  } catch (error) {
    console.log(error);
    console.log("🚀 ~ file: factura.controller.js:120 ~ agregarClienteController ~ error:", error);
  }
};
