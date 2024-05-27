import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomName: { type: String, required: true },
    questionCount: { type: Number, required: true },
    maxUsers: { type: Number, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    questions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
    status: { type: String, enum: ['waiting', 'in-progress', 'finished'], default: 'waiting' },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    startTime: { type: Date, default: Date.now },
    duration: { type: Number, default: 86400000 } // 24 horas en milisegundos
}, {timestamps: true});

const Room = mongoose.model('Room', RoomSchema);

export default Room