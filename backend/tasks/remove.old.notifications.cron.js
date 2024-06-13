import cron from 'node-cron';
import Notification from '../models/notification.model.js';
import UserNotification from '../models/user.notification.model.js';

export const deleteOldNotificationsAndUserNotifications = async () => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Encontrar notificaciones antiguas (creadas hace una semana o más)
    const notificationsToDelete = await Notification.find({
      createdAt: { $lt: oneWeekAgo }
    });

    if (notificationsToDelete.length > 0) {
      const notificationIds = notificationsToDelete.map(notification => notification._id);

      // Eliminar notificaciones antiguas
      const notificationDeletionResult = await Notification.deleteMany({ _id: { $in: notificationIds } });

      // Eliminar entradas de user notifications asociadas
      const userNotificationDeletionResult = await UserNotification.deleteMany({ notification: { $in: notificationIds } });

      console.log(`Deleted ${notificationDeletionResult.deletedCount} old notifications and ${userNotificationDeletionResult.deletedCount} user notifications.`);
    } else {
      console.log('No old notifications to delete');
    }
  } catch (error) {
    console.error('Error deleting old notifications and associated user notifications:', error);
  }
};

// Tarea cron para ejecutar la eliminación de notificaciones antiguas una vez al día
cron.schedule('0 0 * * *', deleteOldNotificationsAndUserNotifications);

// Ejecutar el cron job inmediatamente para probar
//deleteOldNotificationsAndUserNotifications().then(() => {
  //console.log('Cron job executed manually for testing.');
//}).catch(error => {
  //console.error('Error executing cron job manually:', error);
//});
