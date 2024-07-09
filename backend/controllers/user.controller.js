import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        // Buscar al usuario por su nombre de usuario
        const user = await User.findOne({ username }).select("-password -email -emailConfirmed -role -deleted");

        // Verificar si se encontró un usuario
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Verificar si el usuario tiene la propiedad 'deleted' y si está marcada como 'true'
        if (user.deleted === true) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Devolver el usuario si no está marcado como eliminado
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserNameById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({"_id": id}).select("-password -role email emailConfirmed deleted");

        if (!user) return res.status(404).json({error: "Usuario no encontrado"});

        res.status(200).json(user);
    
  } catch (error) {
        res.status(500).json({error: error.message});
  }
};

export const updateUser = async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    const userId = req.user._id;
  
    try {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      // Verificar si se proporcionó un nuevo nombre de usuario
      if (username && username !== user.username) {
        const usernameExist = await User.findOne({ username: username });
        if (usernameExist) {
          return res.status(409).json({ error: "El nombre de usuario ya existe" });
        }
        user.username = username;
      }
  
      // Verificar si el usuario fue registrado por Google
      if (!user.googleUser) {
        // Verificar si se proporcionó la contraseña actual y la nueva contraseña
        if (currentPassword && newPassword) {
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
            return res.status(400).json({ error: "La contraseña actual es incorrecta" });
          }
          if (newPassword.length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
          }
  
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(newPassword, salt);
        }
      }
  
      // Guardar los cambios en la base de datos
      user = await user.save();
      user.password = null; // No mostrar la contraseña en la respuesta
  
      return res.status(200).json(user); // Devolver el usuario actualizado
    } catch (error) {
      return res.status(500).json({ error: error.message }); // Manejar errores
    }
  };
  


export const listUsers = async (req, res) => {
	try {
	  // Solo buscar usuarios que no estén marcados como eliminados
	  const users = await User.find({ deleted: { $ne: true } });
	  res.json(users);
	} catch (error) {
	  res.status(500).json({ message: 'Error fetching users', error });
	}
  };
  

export const editUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { username, email, role } = req.body;
		const user = await User.findByIdAndUpdate(
		id,
		{ username, email, role },
		{ new: true }
		);
		if (!user) {
		return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: 'Error updating user', error });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		// Buscamos al usuario por su ID y actualizamos el campo `deleted` a `true`
		const user = await User.findByIdAndUpdate(id, { deleted: true });
		if (!user) {
		  return res.status(404).json({ message: 'User not found' });
		}
		res.json({ message: 'User deleted successfully' });
	  } catch (error) {
		res.status(500).json({ message: 'Error deleting user', error });
	  }
  };

export const impersonateUser = async (req, res) => {
	try {
		const { userId } = req.body;
		// Comprobar si el usuario tiene permiso para impersonar
		if (req.user.role !== 'admin') {
		return res.status(403).json({ message: 'No tienes permiso para impersonar usuarios' });
		}
		// Generar un nuevo token de acceso para el usuario seleccionado
		const token = generateTokenAndSetCookie(userId, res);
		
		res.status(200).json({ message: 'Usuario impersonado correctamente' });
	} catch (error) {
		console.error('Error al impersonar usuario:', error.message);
		res.status(500).json({ message: 'Error interno al impersonar usuario' });
	}
}; 