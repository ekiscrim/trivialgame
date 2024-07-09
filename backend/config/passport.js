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

const generateUniqueUsername = async (displayName) => {
  const baseUsername = cleanUsername(displayName);
  let username = baseUsername;
  let suffix = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${suffix}`;
    suffix++;
  }

  return username;
};


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://vioquiz.me/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await User.findOne({ googleId: profile.id });
    }

    if (!user) {
      // Generar un nombre de usuario único basado en el nombre limpio
      const uniqueUsername = await generateUniqueUsername(profile.displayName);

      // Generar una contraseña aleatoria
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        googleId: profile.id,
        username: uniqueUsername,
        email: profile.emails[0].value,
        profileImg: profile.photos[0].value,
        googleUser: true,
        emailConfirmed: true,
        password: hashedPassword
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
