import UserNotification from '../../models/user.notification.model.js';
import Participant from '../../models/participant.model.js';
import Notification from '../../models/notification.model.js';
import Room from '../../models/room.model.js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; // Ejemplo de URL base

async function sendRoomResultsNotifications(roomId) {
  try {
    // Encontrar la sala para obtener su nombre
    const room = await Room.findById(roomId);
    if (!room) {
      console.error(`Room with ID ${roomId} not found.`);
      return;
    }

    // Construir la URL completa para la sala
    const roomUrl = `${BASE_URL}/rooms/${room._id}`;

    // Obtener los participantes ordenados por puntuación
    const participants = await Participant.find({ roomId })
      .sort('-score')
      .populate('userId');

    // Objeto para mantener registro de usuarios notificados
    const notifiedUsers = {};

    // Recorrer participantes y enviar notificación una vez por usuario
    for (let index = 0; index < participants.length; index++) {
      const participant = participants[index];
      const user = participant.userId;
      const points = participant.score;

      // Verificar si ya se envió una notificación a este usuario
      if (!notifiedUsers[user._id]) {
        const position = index + 1;

        // Determinar el contenido de posición y color
        let positionContent, positionColorClass;
        if (position === 1) {
          positionContent = `<span class="text-yellow-500">🥇</span>`;
          positionColorClass = 'text-yellow-500';
        } else if (position === 2) {
          positionContent = `<span class="text-gray-400">🥈</span>`;
          positionColorClass = 'text-gray-400';
        } else if (position === 3) {
          positionContent = `<span class="text-yellow-700">🥉</span>`;
          positionColorClass = 'text-yellow-700';
        } else {
          positionContent = `<span>${position}.</span>`;
          positionColorClass = 'text-white';
        }

        // Construir el mensaje de notificación con enlace HTML
        const message = `Has quedado en la posición ${positionContent} con ${points} puntos. Visita la sala <a href="${roomUrl}" class="text-purple-500 hover:underline">aquí</a>.`;

        // Crear la notificación
        const notification = new Notification({
          title: `Resultados de la sala ${room.roomName}`,
          message: message,
          htmlMessage: true, // Indica que el mensaje contiene HTML
        });

        // Guardar la notificación
        await notification.save();

        // Crear la relación UserNotification
        const userNotification = new UserNotification({
          user: user._id,
          notification: notification._id,
        });

        // Guardar la relación UserNotification
        await userNotification.save();

        // Marcar al usuario como notificado
        notifiedUsers[user._id] = true;
      }
    }

    console.log(`Notificaciones enviadas para la sala ${roomId}`);

  } catch (error) {
    console.error(`Error al enviar notificaciones para la sala ${roomId}:`, error);
  }
}

export default sendRoomResultsNotifications;
