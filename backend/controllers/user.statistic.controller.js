import UserStatistics from "../models/user.statistic.model.js";
import User from "../models/user.model.js";

export const updateUserStatistics = async (req, res) => {
    const { userId, category, isCorrect } = req.body;
  
    try {
      let userStats = await UserStatistics.findOne({ userId });
  
      if (!userStats) {
        userStats = new UserStatistics({ userId, categories: [] });
      }
  
      let categoryStats = userStats.categories.find((cat) => cat.category === category);
  
      if (!categoryStats) {
        categoryStats = { category, answered: 0, correct: 0 };

        categoryStats.answered += 1;
        if (isCorrect) {
          categoryStats.correct += 1;
        }
        userStats.categories.push(categoryStats);
      }
  
      categoryStats.answered += 1;
      if (isCorrect) {
        categoryStats.correct += 1;
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

      res.status(200).json({ statsByCategory });
    } catch (error) {
      console.error('Error fetching user stats by category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
