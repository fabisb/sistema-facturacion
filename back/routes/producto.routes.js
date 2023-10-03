import express from "express";
import { verifyToken } from "../controllers/login.controller.js";
import { agregarController, editarController, idProductoController } from "../controllers/producto.controller.js";
var router = express.Router();

/* POST users listing. */
router.post("/agregar",verifyToken,agregarController );
router.patch("/editar",verifyToken,editarController );

router.get('/idProducto',verifyToken,idProductoController)
export default router;
