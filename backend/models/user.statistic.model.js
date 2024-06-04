import mongoose from "mongoose";

const userStatisticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categories: [
    {
      category: { type: String,  required: true },
      answered: { type: Number, default: 0 },
      correct: { type: Number, default: 0 },
    },
  ],
  totalScore: { type: Number, default: 0 },
  monthlyScore: { type: Number, default: 0 },
  weeklyScore: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const UserStatistics = mongoose.model("UserStatistics", userStatisticsSchema);

export default UserStatistics;