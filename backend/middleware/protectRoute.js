import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({error: "Sin autorización: No has facilitado el token"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decoded) {
            return res.status(401).json({error: "Token no válido"})
        }

        const user = await User.findById(decoded.userId).select("-password"); //así lo devuelve sin la contraseña

        if(!user) {
            return res.status(404).json({error: "User no encontrado"})
        }

        req.user = user;
        next(); //execute getMe after the request from auth.routes.js

    } catch (error) {
        console.log("Error en protectRoute middleware ",error.message);
        return res.status(500).json({error: "Internal server error"});
    }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({error: 'Acceso denegado: Requiere ser administrador'});
  }
};