import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Score = mongoose.model('Score', scoreSchema);

export default Score;