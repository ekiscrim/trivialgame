import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import UserNotification from '../models/user.notification.model.js';

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private
export const createNotification = async (req, res) => {
    const { title, message, recipient } = req.body;

    const notification = await Notification.create({ title, message });

    let users;
    if (recipient === 'all') {
        // Si el destinatario es 'all', busca todos los usuarios no eliminados
        users = await User.find({ deleted: { $ne: true } });
    } else if (recipient) {
        // Si se proporciona un userId específico, busca solo ese usuario
        const user = await User.findById(recipient);
        users = user ? [user] : []; // Convertir a un array si el usuario existe, de lo contrario, un array vacío
    } else {
        // Si no se proporciona recipient, establece users como un array vacío
        users = [];
    }

    // Crear entradas UserNotification solo para los usuarios especificados o para todos los usuarios
    await Promise.all(
        users.map(async (user) => {
            await UserNotification.create({ user: user._id, notification: notification._id });
        })
    );

    res.status(201).json({ success: true, data: notification });
};

// @desc    Get all notifications for the current user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    const user = req.user; // Assuming req.user contains the current user object
  
    // Find all notifications for the user and populate the notification details
    let userNotifications = await UserNotification.find({ user: user._id }).populate('notification');
  
    // Sort notifications by createdAt field in descending order (most recent first)
    userNotifications = userNotifications.sort((a, b) => b.notification.createdAt - a.notification.createdAt);
  
    // Calculate the unread count by filtering notifications where read is false
    const unreadNotifications = userNotifications.filter(notification => !notification.read);
    const unreadCount = unreadNotifications.length;
  
    res.json({ success: true, data: userNotifications, unreadCount });
  };
// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req, res) => {
    const { userId, notificationId } = req.params;

    try {
        const userNotification = await UserNotification.findOne({ user: userId, _id: notificationId });

        if (!userNotification) {
            res.status(404).json({ success: false, error: 'UserNotification not found' });
            return;
        }

        userNotification.read = true;
        await userNotification.save();

        res.json({ success: true, data: userNotification });
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

// @desc    Delete Notification
// @route   DELETE /api/notifications/:userId/:notificationId
// @access  Private
export const deleteNotification = async (req, res) => {
    const { userId, notificationId } = req.params;

    try {
        // Buscar la notificación del usuario por ID
        const userNotification = await UserNotification.findOne({ user: userId, _id: notificationId });

        // Si no se encuentra la notificación, devolver un error 404
        if (!userNotification) {
            return res.status(404).json({ success: false, error: 'UserNotification not found' });
        }

        // Eliminar la notificación
        const deletedNotification = await UserNotification.findByIdAndDelete(notificationId);

        // Devolver una respuesta exitosa
        res.json({ success: true, data: deletedNotification });
    } catch (error) {
        // Manejar errores
        console.error('Error deleting notification:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};