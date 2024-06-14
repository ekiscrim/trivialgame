import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import { getRandomAvatar } from "../lib/utils/generateAvatar.js";

const reservedUsernames = ['admin', 'root', 'all', 'system'];

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

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);

        // Genera un avatar aleatorio
        const profileImg = getRandomAvatar();

        // Crear un nuevo usuario
        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            email,
            profileImg
        });

        // Guardar el nuevo usuario en la base de datos
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


export const resendVerificationEmail = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Buscar al usuario por su correo electrónico en la base de datos
      const existingUser = await User.findOne({ email });
  
      // Verificar si existe un usuario con el correo electrónico proporcionado
      // y si la cuenta no está verificada
      if (!existingUser || existingUser.emailConfirmed) {
        return res.status(400).json({ error: "No se puede reenviar la verificación. Verifique el correo electrónico proporcionado." });
      }
  
      // Generar un nuevo token de verificación
      const confirmationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      // Configurar el transporte de correo electrónico
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_SENDER,
          pass: process.env.EMAIL_PASSWORD, // Aquí debes usar tu contraseña de aplicación generada
        },
      });
  
      // Definir el contenido del correo electrónico
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
  
      // Enviar el correo electrónico
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: "Se ha enviado un nuevo correo electrónico de verificación. Por favor, revise su bandeja de entrada." });
    } catch (error) {
      console.error('Error al reenviar el correo electrónico de verificación:', error);
      res.status(500).json({ error: 'Error interno' });
    }
  };