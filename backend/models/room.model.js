import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomName: { type: String, required: true },
    questionCount: { type: Number, required: true },
    maxUsers: { type: Number, required: true },
    categories: { type: [String], required: true },
    status: { type: String, enum: ['waiting', 'in-progress', 'finished'], default: 'waiting' },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {timestamps: true});

const Room = mongoose.model('Room', RoomSchema);

export default Room