import UserNotification from '../../models/user.notification.model.js';
import Participant from '../../models/participant.model.js';
import Notification from '../../models/notification.model.js';
import Room from '../../models/room.model.js';

const BASE_URL = process.env.BASE_URL || 'https://vioquiz.me';

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

    // Obtener los participantes ordenados por puntuación y fecha de creación
    const participants = await Participant.find({ roomId })
      .sort({ score: -1, createdAt: 1 })
      .populate('userId');

    // Objeto para mantener registro de usuarios notificados
    const notifiedUsers = {};

    // Variables para manejar los empates
    let lastScore = null;
    let lastPosition = 0;
    let sameScoreCount = 0;

    // Construir la tabla de participantes usando Tailwind CSS para hacerla responsive
    let participantsTable = `
      <div class="overflow-x-auto">
        <p>Estos son los resultados de la sala</p>
         </br>
        <table class="min-w-full bg-white border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="py-3 px-4 text-left w-16">Rank</th>
              <th class="py-3 px-4 text-left">Usuario</th>
              <th class="py-3 px-4 text-center">Puntuación</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
    `;

    // Recorrer participantes y enviar notificación una vez por usuario
    for (let index = 0; index < participants.length; index++) {
      const participant = participants[index];
      const user = participant.userId;
      const points = participant.score;

      // Verificar si ya se envió una notificación a este usuario
      if (!notifiedUsers[user._id]) {
        // Manejo de posiciones en caso de empate
        if (points !== lastScore) {
          lastPosition += sameScoreCount + 1;
          sameScoreCount = 0;
          lastScore = points;
        } else {
          sameScoreCount++;
        }

        // Determinar el contenido de posición y color
        let rankContent, rankColorClass;
        if (lastPosition === 1) {
          rankContent = `<span class="text-yellow-500">🥇</span>`;
          rankColorClass = 'text-yellow-500';
        } else if (lastPosition === 2) {
          rankContent = `<span class="text-gray-400">🥈</span>`;
          rankColorClass = 'text-gray-400';
        } else if (lastPosition === 3) {
          rankContent = `<span class="text-orange-500">🥉</span>`;
          rankColorClass = 'text-orange-500';
        } else {
          rankContent = `<span class="text-black">${lastPosition}.</span>`;
          rankColorClass = 'text-black';
        }

        // Añadir fila de participante a la tabla
        participantsTable += `
          <tr class="${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}">
            <td class="py-3 px-4 text-left whitespace-nowrap">${rankContent}</td>
            <td class="py-3 px-4 text-left">
              <div class="flex items-center">
                <img src="${user.profileImg || '/avatar-placeholder.png'}" alt="Profile" class="w-8 h-8 rounded-full mr-2">
                <span class="font-bold">${user.username}</span>
              </div>
            </td>
            <td class="py-3 px-4 text-center">${points}</td>
          </tr>
        `;

        // Marcar al usuario como notificado
        notifiedUsers[user._id] = true;
      }
    }

    // Cerrar la tabla de participantes
    participantsTable += `
          </tbody>
        </table>
      </div>
    `;

    // Construir el mensaje de notificación con enlace HTML
    const message = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        ${participantsTable}
        <p class="mt-4">Visita la sala <a href="${roomUrl}" class="text-purple-500 hover:underline">aquí</a>.</p>
      </div>
    `;

    // Crear la notificación
    const notification = new Notification({
      title: `Resultados de la sala ${room.roomName}`,
      message: message,
      htmlMessage: true, // Indica que el mensaje contiene HTML
    });

    // Guardar la notificación
    await notification.save();

    // Obtener todos los usuarios involucrados
    const users = participants.map(participant => participant.userId);

    // Filtrar usuarios únicos y crear relaciones UserNotification
    const uniqueUsers = [...new Set(users.map(user => user._id))];
    const userNotifications = uniqueUsers.map(userId => ({
      user: userId,
      notification: notification._id,
    }));

    // Guardar las relaciones UserNotification
    await UserNotification.insertMany(userNotifications);

    console.log(`Notificación enviada para la sala ${room.roomName}`);

  } catch (error) {
    console.error(`Error al enviar notificación para la sala ${roomId}:`, error);
  }
}

export default sendRoomResultsNotifications;
