import mongoose from "mongoose";
import UserNotification from "./user.notification.model.js";

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

notificationSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    // Eliminar todas las user notifications asociadas
    await UserNotification.deleteMany({ notification: doc._id });
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
