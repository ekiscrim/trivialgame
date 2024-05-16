import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, required: true},
        password: { type: String, required: true, minLength: 6},
    }, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;