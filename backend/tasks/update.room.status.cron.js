import cron from 'node-cron';
import Room from '../models/room.model.js';

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
        console.log(`Updated ${roomsToUpdate.length} rooms to 'finished' status`);
      } else {
        //console.log('No rooms to update');
      }
    } catch (error) {
      console.error('Error updating room statuses:', error);
    }
  });