import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';


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

export const updateUser = async (req, res) => {
  
    const {username, currentPassword, newPassword} = req.body;

    const userId = req.user._id;

    try {
        
        let user = await User.findById(userId);

        if (!user) return res.status(404).json({error: "User no encontrado"});

        if ((!newPassword && currentPassword) ||(!currentPassword && newPassword)) {
            return res.status(400).json({error: "Por favor facilita ambas contraseñas la antigua y la nueva"});
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({error: "La contraseña no es correcta"});
            if (newPassword.length < 6) return res.status(400).json({error: "La contraseña debe tener 6 caracteres como minimo"});
        
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        
        user.username = username || user.username;
        // TODO aqui irian el resto de campos, que aún hay que pensar

        user = await user.save();

        user.password = null; //for not show the password in the response
        return res.status(200).json(user);

    } catch (error) {
        console.log("Error en updateUser: ", error.message);
        res.status(500).json({error: error.message});
    }

};