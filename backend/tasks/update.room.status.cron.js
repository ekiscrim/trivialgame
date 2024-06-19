import cron from 'node-cron';
import Room from '../models/room.model.js';
import sendRoomResultsNotifications from '../lib/utils/sendResultsNotifications.js';

// Tarea que se ejecuta cada minuto para actualizar el estado de las salas
cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const roomsToUpdate = await Room.find({
        status: { $ne: 'finished' },
        $expr: {
          $lte: [{ $add: ['$startTime', '$duration'] }, now]
        }
      });
  
      if (roomsToUpdate.length > 0) {
        await Room.updateMany(
          { _id: { $in: roomsToUpdate.map(room => room._id) } },
          { $set: { status: 'finished' } }
        );
        for (const room of roomsToUpdate) {
          await sendRoomResultsNotifications(room);
        }
        console.log(`Updated ${roomsToUpdate.length} rooms to 'finished' status and sent notifications`);
      } else {
        //console.log('No rooms to update');
      }
    } catch (error) {
      console.error('Error updating room statuses:', error);
    }
  });