import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, required: true},
        password: { type: String, required: true, minLength: 6},
        profileImg: {type: String},
        role: {type: String, enum: ['user', 'moderador', 'admin'], default: 'user'},
        email: {type: String, required: true, unique: true},
        emailConfirmed: {type: Boolean, default: false},
    }, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;