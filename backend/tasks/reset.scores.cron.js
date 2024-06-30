import cron from 'node-cron';
import UserStatistics from '../models/user.statistic.model.js';
import Notification from '../models/notification.model.js';
import UserNotification from '../models/user.notification.model.js';

// Función para enviar notificación a usuarios específicos
const sendNotificationToUsers = async (title, message, users) => {
  const notification = new Notification({ title, message });
  await notification.save();

  const userNotifications = users.map(user => ({
    user: user.userId,
    notification: notification._id,
  }));

  await UserNotification.insertMany(userNotifications);
  console.log('Notificaciones enviadas');
};

// Función para generar HTML del ranking
const generateRankingHTML = (usersStats, period) => {
  const title = period === 'weekly' ? 'Clasificación Semanal' : 'Clasificación Mensual';
  let html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #333; font-size: 24px; font-weight: bold;">${title}</h2>
      <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
  `;

  usersStats.slice(0, 3).forEach((stat, index) => {
    if (!stat.userId) return;
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    html += `
      <div style="background-color: #fff; color: #000; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <img src="${stat.userId.profileImg || '/avatar-placeholder.png'}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; margin: auto;">
        <h3 style="font-size: 18px; font-weight: bold; margin-top: 10px;">${stat.userId.username}</h3>
        <p style="font-size: 24px; font-weight: bold;">${period === 'weekly' ? stat.weeklyScore : stat.monthlyScore}</p>
        <p style="font-size: 24px; margin-top: 5px;">${medal}</p>
      </div>
    `;
  });

  html += '</div><table style="width: 100%; border-collapse: collapse; text-align: center;">';
  html += `
    <thead>
      <tr style="background-color: #f0f0f0;">
        <th style="padding: 10px;">Posición</th>
        <th style="padding: 10px;">Usuario</th>
        <th style="padding: 10px;">Puntuación</th>
      </tr>
    </thead>
    <tbody>
  `;

  usersStats.slice(3).forEach((stat, index) => {
    if (!stat.userId) return;
    html += `
      <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#fff'};">
        <td style="padding: 10px;">${index + 4}</td>
        <td style="padding: 10px;">
          <div style="display: flex; align-items: center; justify-content: start;">
            <img src="${stat.userId.profileImg || '/avatar-placeholder.png'}" alt="Profile" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
            <span style="font-size: 16px; font-weight: bold; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${stat.userId.username}</span>
          </div>
        </td>
        <td style="padding: 10px; font-size: 16px; font-weight: bold;">${period === 'weekly' ? stat.weeklyScore : stat.monthlyScore}</td>
      </tr>
    `;
  });

  html += `
    </tbody>
    </table>
    </div>
  `;

  return html;
};

// Función para obtener el ranking y notificar resultados
const notifyResults = async (period) => {
  let usersStats;

  if (period === 'weekly') {
    usersStats = await UserStatistics.find({ weeklyScore: { $gt: 0 } }, 'userId weeklyScore').populate('userId', 'username profileImg');
    usersStats.sort((a, b) => b.weeklyScore - a.weeklyScore);
  } else if (period === 'monthly') {
    usersStats = await UserStatistics.find({ monthlyScore: { $gt: 0 } }, 'userId monthlyScore').populate('userId', 'username profileImg');
    usersStats.sort((a, b) => b.monthlyScore - a.monthlyScore);
  }

  if (usersStats.length === 0) {
    console.log(`No hay usuarios con puntuaciones mayores de 0 para el periodo ${period}.`);
    return; // No enviar notificación si no hay usuarios con puntuación > 0
  }

  // Filtrar usuarios sin userId para evitar errores
  const validUsersStats = usersStats.filter(stat => stat.userId !== null);

  if (validUsersStats.length === 0) {
    console.log(`No hay usuarios válidos para el periodo ${period}.`);
    return; // No enviar notificación si no hay usuarios válidos
  }

  const message = generateRankingHTML(validUsersStats, period);
  const users = validUsersStats.map(stat => ({ userId: stat.userId._id }));

  console.log(`Enviando notificación de resultados ${period}`);
  await sendNotificationToUsers(period === 'weekly' ? 'Clasificación Semanal' : 'Clasificación Mensual', message, users);
};

const resetWeeklyScores = async () => {
  console.log('Iniciando reseteo de puntuaciones semanales');
  await notifyResults('weekly');
  await UserStatistics.updateMany({}, { weeklyScore: 0 });
  console.log('Puntuaciones semanales reseteadas');
};

const resetMonthlyScores = async () => {
  console.log('Iniciando reseteo de puntuaciones mensuales');
  await notifyResults('monthly');
  await UserStatistics.updateMany({}, { monthlyScore: 0 });
  console.log('Puntuaciones mensuales reseteadas');
};

// Reset weekly scores every Monday at midnight
cron.schedule('0 0 * * 1', resetWeeklyScores);

// Reset monthly scores on the first day of each month at midnight
cron.schedule('0 0 1 * *', resetMonthlyScores);
