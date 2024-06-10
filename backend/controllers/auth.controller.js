import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        let {username, password, role, email} = req.body;

        username = username.toLowerCase();

        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        if (existingEmail) {
            return res.status(400).json({ error: "El email ya existe" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener una longitud mímina de 6 caracteres" })
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generar token de confirmación
        const confirmationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Configurar el transporte
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASSWORD, // Aquí debes usar tu contraseña de aplicación generada
            },
        });

        // Definir el contenido del correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: 'Confirmación de correo electrónico',
            html: `<p>Hola ${username},</p><p>Por favor haz clic en el siguiente enlace para confirmar tu correo electrónico:</p><p><a href="${process.env.EMAIL_URL_APP}/api/verify/confirm/${confirmationToken}">Confirmar correo electrónico</a></p>`,
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);

        // Crear un nuevo usuario
        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            email,
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        res.status(201).json({
            _id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        });

        /*if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser.id,
                username: newUser.username
            });
        } else {
            res.status(400).json({error: 'Datos de usuario no válidos'});
        }*/

    } catch (error) {
        res.status(500).json({error: 'Error interno'});
    }
};

export const login = async (req, res) => {
    try {

        let {username, password} = req.body;
        username = username.toLowerCase();
        const user = await User.findOne({ username });

        // Verificar si el usuario existe y no está marcado como eliminado
        if (!user || user.deleted) {
            return res.status(400).json({ error: "Nombre de usuario o contraseña incorrecta" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Nombre de usuario o contraseña incorrecta" });
        }

        if (!user.emailConfirmed) {
            return res.status(400).json({ error: "La cuenta de usuario no está verificada, revisa tu email de registro" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};


export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "Has salido de la cuenta correctamente"})
    } catch (error) {
        res.status(500).json({error: 'Error interno'});
    }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({error: 'Error interno'});
  }
}

export const verifyUser = async (req, res) => {
    try {
        const token = req.params.token;
        
        // Verificar el token de confirmación
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const email = decodedToken.email;

        // Marcar la cuenta como confirmada en la base de datos
        await User.updateOne({ email }, { emailConfirmed: true });
        // Redirigir a la página de éxito después de un pequeño retraso
        res.redirect('/login?verified=true');
        
    } catch (error) {
        res.status(400).send('Error en la confirmación de correo electrónico');
    }

};