import jwt from "jsonwebtoken";
import { pool } from "../database/db";
export const loginController = async (req, res, next) => {
  console.log("loginController");
  const { user, pass } = req.body;
  if (user == "" || pass == "") {
    return res.status(422).json({ mensaje: "Error al iniciar sesion, valide los datos" });
  }
  const [id] = await pool.execute("SELECT id FROM users WHERE username = ? AND pass = ?", [
    user,
    pass,
  ]);
  if (id) {
    var token = await jwt.sign({ id, user }, "secret", { expiresIn: "1 days" });
    console.log("🚀 ~ file: login.controller.js:14 ~ loginController ~ id:", id);
    console.log("🚀 ~ file: login.controller.js:15 ~ loginController ~ token:", token);
    res.cookie("token", token, { httpOnly: true });
    res.cookie("username", user, { httpOnly: true });
    return res.status(200);
  } else {
    return res
      .status("404")
      .json({ mensaje: "No se han encontrado informacion con ese usuario o contraseña" });
  }
};

export const clearCookie = (req, res, next) => {
  res.clearCookie("token");
  res.clearCookie("username");
};

export const verifyToken = async (req, res, next) => {
  console.log("🚀 ~ file: login.controller.js:25 ~ verifyToken ~ req.cookies:", req.cookies);
  const { token } = req.cookies;
  try {
    var decoded = await jwt.verify(token, "secret");
    if (decoded) {
      next();
    }
  } catch (err) {
    // err
    console.log(err);
    return res.status(420).json({ mensaje: "Error de autentificacion, verificar token" });
  }
};
