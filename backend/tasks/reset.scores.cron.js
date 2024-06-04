import cron from 'node-cron';
import UserStatistics from '../models/user.statistic.model.js';

const resetWeeklyScores = async () => {
  await UserStatistics.updateMany({}, { weeklyScore: 0 });
  console.log('Weekly scores reset');
};

const resetMonthlyScores = async () => {
  await UserStatistics.updateMany({}, { monthlyScore: 0 });
  console.log('Monthly scores reset');
};

// Reset weekly scores every Monday at midnight
cron.schedule('0 0 * * 1', resetWeeklyScores);

// Reset monthly scores on the first day of each month at midnight
cron.schedule('0 0 1 * *', resetMonthlyScores);