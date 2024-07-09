import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import { getRandomAvatar } from "../lib/utils/generateAvatar.js";
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const reservedUsernames = ['admin', 'root', 'all', 'system', 'Unknown'];

export const register = async (req, res) => {
    try {
        let {username, password, role, email} = req.body;
        username = username.toLowerCase();

        if (reservedUsernames.includes(username)) {
          return res.status(400).json({ error: "Nombre de usuario no permitido" });
        }

        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        if (existingEmail) {
            return res.status(400).json({ error: "El email ya existe" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener una longitud mímina de 6 caracteres" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const confirmationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: 'no-reply@vioquiz.me',
            to: email,
            subject: 'Confirmación de correo electrónico',
            html:  `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Confirmación de cuenta</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f7f7f7;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  border-radius: 8px;
                }
                .header {
                  text-align: center;
                  padding: 20px;
                }
                .header img {
                  max-width: 150px;
                }
                .content {
                  text-align: center;
                  color: #333333;
                }
                .content p {
                  font-size: 16px;
                  line-height: 1.5;
                }
                .content a {
                  display: inline-block;
                  margin: 20px 0;
                  padding: 10px 20px;
                  background-color: #6a1b9a;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                }
                .footer {
                  text-align: center;
                  padding: 10px;
                  color: #777777;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <img src="https://vioquiz.me/logoquiz.png" alt="VioQUIZ Logo">
                </div>
                <div class="content">
                  <p>Hola, ${username}</p>
                  <p>Por favor haz clic en el siguiente enlace para confirmar tu correo electrónico:</p>
                  <p><a href="${process.env.EMAIL_URL_APP}/api/verify/confirm/${confirmationToken}">Confirmar correo electrónico</a></p>
                </div>
                <div class="footer">
                  <p>Si no solicitaste esta acción, puedes ignorar este correo electrónico.</p>
                  <p>&copy; 2024 VioQUIZ. Todos los derechos reservados.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        };

        await transporter.sendMail(mailOptions);

        const profileImg = getRandomAvatar();

        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            email,
            profileImg
        });

        await newUser.save();

        res.status(201).json({
            _id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        });

    } catch (error) {
        res.status(500).json({error: 'Error interno'});
    }
};

export const login = async (req, res) => {
    try {
        let {username, password} = req.body;
        username = username.toLowerCase();
        const user = await User.findOne({ username });

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
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Has salido de la cuenta correctamente"});
    } catch (error) {
        res.status(500).json({error: 'Error interno'});
    }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({error: 'Error interno'});
  }
}

export const verifyUser = async (req, res) => {
    try {
        const token = req.params.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const email = decodedToken.email;
        await User.updateOne({ email }, { emailConfirmed: true });
        res.redirect('/login?verified=true');
    } catch (error) {
        res.status(400).send('Error en la confirmación de correo electrónico');
    }
};

export const resendVerificationEmail = async (req, res) => {
    try {
      const { email } = req.body;
      const existingUser = await User.findOne({ email });

      if (!existingUser || existingUser.emailConfirmed) {
        return res.status(400).json({ error: "No se puede reenviar la verificación. Verifique el correo electrónico proporcionado." });
      }

      const confirmationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_SENDER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: 'no-reply@vioquiz.me',
        to: email,
        subject: 'Reenvío de confirmación de correo electrónico',
        html:  `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de cuenta</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
            }
            .header {
              text-align: center;
              padding: 20px;
            }
            .header img {
              max-width: 150px;
            }
            .content {
              text-align: center;
              color: #333333;
            }
            .content p {
              font-size: 16px;
              line-height: 1.5;
            }
            .content a {
              display: inline-block;
              margin: 20px 0;
              padding: 10px 20px;
              background-color: #6a1b9a;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              padding: 10px;
              color: #777777;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://vioquiz.me/logoquiz.png" alt="VioQUIZ Logo">
            </div>
            <div class="content">
              <p>Hola, ${username}</p>
              <p>Por favor haz clic en el siguiente enlace para confirmar tu correo electrónico:</p>
              <p><a href="${process.env.EMAIL_URL_APP}/api/verify/confirm/${confirmationToken}">Confirmar correo electrónico</a></p>
            </div>
            <div class="footer">
              <p>Si no solicitaste esta acción, puedes ignorar este correo electrónico.</p>
              <p>&copy; 2024 VioQUIZ. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Se ha enviado un nuevo correo electrónico de verificación. Por favor, revise su bandeja de entrada." });
    } catch (error) {
      console.error('Error al reenviar el correo electrónico de verificación:', error);
      res.status(500).json({ error: 'Error interno' });
    }
};

export const deactivate = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findByIdAndUpdate(id, { deleted: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Función para iniciar sesión con Google
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Función de callback de Google
export const googleAuthCallback = [
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
      generateTokenAndSetCookie(req.user._id, res);
      res.redirect('/');  // Redirige a la página principal
  }
];

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.email });
    if (!user) return res.status(404).json({ error: 'No user found with this email' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const url = `${process.env.BASE_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: email.email,
      subject: 'Reestablecer Contraseña',
      html: `Haz click <a href="${url}">aquí</a> para crear tu nueva contraseña`,
    });

    res.json({ message: 'Email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const verifyToken = (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
};