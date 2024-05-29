import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';

export const getUserProfile = async (req, res) => {
  
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select("-password");

        if (!user) return res.status(404).json({error: "Usuario no encontrado"});

        res.status(200).json(user);
    
  } catch (error) {
        console.log("Error en getUserProfile ",error.message);
        res.status(500).json({error: error.message});
  }
};

export const getUserNameById = async (req, res) => {
    console.log("PARAMETROS ", req.params);
    const { id } = req.params;

    try {
        const user = await User.findOne({"_id": id}).select("-password");

        if (!user) return res.status(404).json({error: "Usuario no encontrado"});

        res.status(200).json(user);
    
  } catch (error) {
        console.log("Error en getUserNameById ",error.message);
        res.status(500).json({error: error.message});
  }
};

export const updateUser = async (req, res) => {
	const { username, currentPassword, newPassword } = req.body;
	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User no encontrado" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Por favor facilita ambas contraseñas la antigua y la nueva" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "La contraseña no es correcta" });
			if (newPassword.length < 6) return res.status(400).json({ error: "La contraseña debe tener 6 caracteres como mínimo" });

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (req.file) {
			if (user.profileImg) {
				await cloudinary.uploader.destroy(`profileImg/${user.profileImg.split("/").pop().split(".")[0]}`);
			}

			const stream = streamifier.createReadStream(req.file.buffer);
			const uploadedResponse = await new Promise((resolve, reject) => {
				const streamLoad = cloudinary.uploader.upload_stream({ folder: "profileImg" }, (error, result) => {
					if (result) {
						resolve(result);
					} else {
						reject(error);
					}
				});
				stream.pipe(streamLoad);
			});

			user.profileImg = uploadedResponse.secure_url;
		}

		user.username = username || user.username;
		user = await user.save();
		user.password = null; // No mostrar la contraseña en la respuesta

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error en updateUser: ", error.message);
		return res.status(500).json({ error: error.message });
	}
};