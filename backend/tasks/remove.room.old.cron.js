import cron from 'node-cron';
import Room from '../models/room.model.js';
import Participant from '../models/participant.model.js';

export const deleteOldRoomsAndParticipants = async () => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const roomsToDelete = await Room.find({
      status: 'finished',
      createdAt: { $lt: oneWeekAgo }
    });

    if (roomsToDelete.length > 0) {
      const roomIds = roomsToDelete.map(room => room._id);

      const roomDeletionResult = await Room.deleteMany({ _id: { $in: roomIds } });
      const participantDeletionResult = await Participant.deleteMany({ roomId: { $in: roomIds } });

      console.log(`Deleted ${roomDeletionResult.deletedCount} rooms and ${participantDeletionResult.deletedCount} participants associated with those rooms.`);
    } else {
      console.log('No rooms to delete');
    }
  } catch (error) {
    console.error('Error deleting old rooms and associated participants:', error);
  }
};

// Tarea que se ejecuta una vez al día para eliminar salas 'finished' que tengan más de una semana
cron.schedule('0 0 * * *', deleteOldRoomsAndParticipants);