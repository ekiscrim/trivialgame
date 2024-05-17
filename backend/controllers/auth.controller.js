import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const register = async (req, res) => {
    try {
        const {username, password, role} = req.body;

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
            password: hashedPassword,
            role
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser.id,
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
    try {

        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
        
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Username o password Incorrectas"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username
        })
        
    } catch (error) {
        console.log("Error en el controlador de login ", error.message);
        res.status(500).json({error: 'Error interno desde el controller'});
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "Has salido de la cuenta correctamente"})
    } catch (error) {
        console.log("Error en el controlador de logout ", error.message);
        res.status(500).json({error: 'Error interno desde el controller'});
    }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user)
  } catch (error) {
    console.log("Error en el controlador de getMe ", error.message);
    res.status(500).json({error: 'Error interno desde el controller'});
  }
}