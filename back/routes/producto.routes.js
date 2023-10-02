import express from "express";
import { verifyToken } from "../controllers/login.controller.js";
import { agregarController } from "../controllers/producto.controller.js";
var router = express.Router();

/* POST users listing. */
router.post("/agregar",verifyToken,agregarController );

export default router;
