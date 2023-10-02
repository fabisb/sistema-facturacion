import { pool } from "../database/db.js";

export const agregarController = async (req, res, next) => {
  console.log("AgregarController");
  const { nombre, tipo, cantidad } = req.body;

  if (nombre == "" || cantidad == "" || cantidad == 0 || tipo == "") {
    console.log("Error falta algun dato");
    return res.status(400).json({ mensaje: "Error falta algun dato" });
  } else if (isNaN(cantidad)) {
    console.log("Error tipo de dato");
    return res.status(400).json({ mensaje: "Error tipo de dato" });
  }
  const [existencia] = await pool.execute(
    "SELECT nombre, tipo FROM productos WHERE nombre = ? AND tipo = ?",
    [nombre, tipo]
  );
  console.log("🚀 ~ file: producto.controller.js:18 ~ agregarController ~ existencia:", existencia)
  if (existencia.length > 0) {
    return res
      .status(405)
      .json({ mensaje: "Error ya se encontro un producto de igual nombre y tipo" });
  } else {
    const [insertado] = await pool.execute("INSERT INTO productos (nombre, tipo) VALUES (?,?)", [
      nombre,
      tipo,
    ]);
    console.log("🚀 ~ file: producto.controller.js:28 ~ agregarController ~ insertado:", insertado.insertId)
    await pool.execute("INSERT INTO cantidad_producto (id_producto, cantidad, minimo) VALUES (?,?,?)", [
        insertado.insertId,
        cantidad,
      minimo
    ]);
    return res.status(200).json({ mensaje: "Insertado exitoso" });
  }
};
