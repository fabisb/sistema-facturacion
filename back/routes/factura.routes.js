import express from "express";
import { verifyToken } from "../controllers/login.controller.js";
import {
  agregarClienteController,
  consultarTicketController,
  facturarController,
  productosController,
} from "../controllers/factura.controller.js";
var router = express.Router();

/* POST users listing. */
router.post("/crear", verifyToken, agregarClienteController, facturarController);

/* GET users listing. */
router.get("/productos", verifyToken, productosController);
router.get("/consultar/", verifyToken, consultarTicketController);

export default router;
