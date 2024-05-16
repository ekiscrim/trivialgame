import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const register = async (req, res) => {
    try {
        const {username, password} = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener una longitud mímina de 6 caracteres" })
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //new user with the data with pass hashed
        const newUser = new User({
            username: username,
            password: hashedPassword
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser.__id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser.__id,
                username: newUser.username
            });
        } else {
            res.status(400).json({error: 'Datos de usuario no válidos'});
        }

    } catch (error) {
        console.log("Error en el controlador de registro ", error.message);
        res.status(500).json({error: 'Error interno desde el controller'});
    }
};

export const login = async (req, res) => {
    res.json({
        data: "You hit the login endpoint"
      });
};

export const logout = async (req, res) => {
    res.json({
        data: "You hit the logout endpoint"
      });
};