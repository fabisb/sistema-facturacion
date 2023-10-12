import { pool } from "../database/db.js";

export const agregarController = async (req, res) => {
  console.log("AgregarController");
  const { nombre, tipo, cantidad } = req.body;

  if (nombre == "" || cantidad == "" || cantidad == 0 || tipo == "") {
    console.log("Error falta algun dato");
    return await res.status(400).json({ mensaje: "Error falta algun dato" });
  } else if (isNaN(cantidad)) {
    console.log("Error tipo de dato");
    return await res.status(400).json({ mensaje: "Error tipo de dato" });
  }
  const [existencia] = await pool.execute(
    "SELECT nombre, tipo FROM productos WHERE nombre = ? AND tipo = ?",
    [nombre, tipo]
  );
  console.log("🚀 ~ file: producto.controller.js:18 ~ agregarController ~ existencia:", existencia);
  if (existencia.length > 0) {
    return await res
      .status(405)
      .json({ mensaje: "Error ya se encontro un producto de igual nombre y tipo" });
  } else {
    const [insertado] = await pool.execute("INSERT INTO productos (nombre, tipo) VALUES (?,?)", [
      nombre,
      tipo,
    ]);
    console.log(
      "🚀 ~ file: producto.controller.js:28 ~ agregarController ~ insertado:",
      insertado.insertId
    );
    await pool.execute("INSERT INTO cantidad_producto (id_producto, cantidad) VALUES (?,?)", [
      insertado.insertId,
      cantidad,
    ]);
    return await res.status(200).json({ mensaje: "Insertado exitoso" });
  }
};

export const editarController = async (req, res) => {
  console.log("editarController");
  const { nombre, tipo, cantidad } = req.body;
  console.log("🚀 ~ file: producto.controller.js:43 ~ editarController ~ req.body:", req.body)

  if (nombre == "" || cantidad == "" || cantidad == 0 || tipo == "") {
    console.log("Error falta algun dato");
    return await res.status(400).json({ mensaje: "Error falta algun dato" });
  } else if (isNaN(cantidad)) {
    console.log("Error tipo de dato");
    return await res.status(400).json({ mensaje: "Error tipo de dato" });
  }
  const [existencia] = await pool.execute(
    "SELECT nombre, tipo FROM productos WHERE nombre = ? AND tipo = ?",
    [nombre, tipo]
  );
  console.log("🚀 ~ file: producto.controller.js:18 ~ agregarController ~ existencia:", existencia);
  if (existencia.length > 0) {
    return await res
      .status(405)
      .json({ mensaje: "Error ya se encontro un producto de igual nombre y tipo" });
  } else {
    const [actualizado] = await pool.execute("UPDATE FROM productos SET nombre = ? tipo = ? WHERE id = ?", [
      nombre,
      tipo,
      idExistente
    ]);
    console.log(
      "🚀 ~ file: producto.controller.js:28 ~ agregarController ~ insertado:",
      actualizado.insertId
    );
    await pool.execute("INSERT INTO cantidad_producto (id_producto, cantidad) VALUES (?,?)", [
      actualizado.insertId,
      cantidad,
    ]);
    return await res.status(200).json({ mensaje: "Actualizado exitoso" });
  }
};

export const idProductoController = async (req,res)=>{
  console.log('idProductoController')
  const {id} = req.query;
  const [idProducto] = await pool.execute('SELECT * FROM productos WHERE id = ?',[id]);
  const [CantidadProducto] = await pool.execute('SELECT * FROM productos WHERE id = ?',[id]);
  console.log("🚀 ~ file: producto.controller.js:83 ~ idProductoController ~ idProducto:", idProducto)
  return await res.status(200).json(idProducto[0]); 
} 

export const idTipoProductoController = async (req,res)=>{
  console.log('idProductoController')
  const {tipo }= req.query;
  console.log("🚀 ~ file: producto.controller.js:90 ~ idTipoProductoController ~ req.query:", req.query)
  const [productos] = await pool.execute('SELECT * FROM productos WHERE tipo = ?',[tipo])
  console.log("🚀 ~ file: producto.controller.js:92 ~ idTipoProductoController ~ productos:", productos)
  return await res.status(200).json(productos); 
} 