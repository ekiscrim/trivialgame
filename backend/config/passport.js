import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";

dotenv.config();

// Función para limpiar el nombre de usuario
const cleanUsername = (displayName) => {
  // Remover caracteres especiales y espacios, y convertir todo a minúsculas
  return displayName.replace(/[^\w]/g, '').toLowerCase();
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await User.findOne({ googleId: profile.id });
    }

    if (!user) {
      // Limpiar el nombre de usuario
      const cleanedUsername = cleanUsername(profile.displayName);

      // Generar una contraseña aleatoria
      const randomPassword = Math.random().toString(36).slice(-8); // Genera una cadena aleatoria de 8 caracteres
      const hashedPassword = await bcrypt.hash(randomPassword, 10); // Hash de la contraseña

      user = new User({
        googleId: profile.id,
        username: cleanedUsername,
        email: profile.emails[0].value,
        profileImg: profile.photos[0].value,
        googleUser: true,
        emailConfirmed: true,  // Asumimos que los correos de Google están verificados
        password: hashedPassword  // Asignamos la contraseña generada
      });

      await user.save();
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
