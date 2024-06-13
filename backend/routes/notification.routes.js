import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createNotification, getNotifications, markNotificationAsRead, deleteNotification } from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/', protectRoute, createNotification);
router.get('/', protectRoute, getNotifications);
router.put('/:userId/:notificationId/read', protectRoute, markNotificationAsRead);
router.delete('/:userId/:notificationId', protectRoute, deleteNotification);

export default router;