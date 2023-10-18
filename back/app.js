import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import productosRouter from "./routes/producto.routes.js";
import facturaRouter from "./routes/factura.routes.js";

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/productos", productosRouter);
app.use("/api/factura", facturaRouter);

export default app;