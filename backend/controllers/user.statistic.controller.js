import UserStatistics from "../models/user.statistic.model.js";
import mongoose from "mongoose";

export const updateUserStatistics = async (req, res) => {
  const { userId, category, isCorrect, score } = req.body;

  try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ error: 'Invalid user ID' });
      }

      const objectId = mongoose.Types.ObjectId.createFromHexString(userId);
      if (!objectId) {
          return res.status(400).json({ error: 'User ID is required' });
      }

      let userStats = await UserStatistics.findOne({ userId: objectId });
      if (!userStats) {
          userStats = new UserStatistics({ userId: objectId, categories: [] });
      }

      let categoryStats = userStats.categories.find((cat) => cat.category === category);
      if (!categoryStats) {
          categoryStats = { category, answered: 0, correct: 0, lastUpdated: new Date() };
          userStats.categories.push(categoryStats);
      }

      categoryStats.answered += 1;
      if (isCorrect) {
          categoryStats.correct += 1;
          userStats.totalScore += score;

          const now = new Date();
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          // Actualización del puntaje semanal y mensual
          if (categoryStats.lastUpdated < startOfWeek) {
              userStats.weeklyScore = score;
          } else {
              userStats.weeklyScore += score;
          }

          if (categoryStats.lastUpdated < startOfMonth) {
              userStats.monthlyScore = score;
          } else {
              userStats.monthlyScore += score;
          }

          categoryStats.lastUpdated = now;
      }

      await userStats.save();

      console.log("UPDATE USER STATISTICS ", userStats);
      res.json(userStats);
  } catch (error) {
      res.status(500).json({ error: 'Failed to update user statistics' });
  }
};

export const getUserStats = async (req, res) => {
    const userId = req.params.userId;

    try {
      const user = await UserStatistics.findOne({userId: userId});
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Obtener las estadísticas por categoría
      const statsByCategory = {};
      user.categories.forEach((category) => {
        const categoryName = category.category;
        statsByCategory[categoryName] = {
          answered: category.answered,
          correct: category.correct,
          total: category.answered
        };

      });

      res.status(200).json({ user, statsByCategory });
    } catch (error) {
      console.error('Error fetching user stats by category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRankingStats = async (req, res) => {
  const { filter } = req.query;

  let sortField;
  switch (filter) {
    case 'monthly':
      sortField = 'monthlyScore';
      break;
    case 'weekly':
      sortField = 'weeklyScore';
      break;
    default:
      sortField = 'totalScore';
  }
  const rankings = await UserStatistics.find().sort({ [sortField]: -1 }).populate('userId').limit(100);
  res.json(rankings);
};
