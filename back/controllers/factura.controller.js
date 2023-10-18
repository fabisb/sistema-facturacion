import { pool } from "../database/db.js";

export const productosController = async (req, res) => {
  const [productos] = pool.execute("SELECT * FROM productos");

  if (productos.length > 0) {
    const [cantidadProductos] = pool.execute("SELECT * FROM cantidad_producto");
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
      console.log("🚀 ~ file: factura.controller.js:30 ~ productosController ~ productosUnidos:", productosUnidos)

      return await res.status(200).json(productosUnidos);
    }
  } else {
    return await res.stauts(402).json({ mensaje: "No se han encontrado productos" });
  }
};
