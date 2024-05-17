import Room from "../models/room.model.js";


export const listRooms = async (req, res) => {
  
    try {
        const rooms = await Room.find({ status: 'waiting' }).sort([["createdAt", -1]]);

        if (!rooms || rooms.length === 0) return res.status(404).json({error: "No hay Salas que listar"});

        res.status(200).json(rooms);
    
  } catch (error) {
        console.log("Error en listRooms ",error.message);
        res.status(500).json({error: error.message});
  }
};

export const createRoom = async (req, res) => {
    try {
            const { roomName, questionCount, maxUsers, categories } = req.body;
            const newRoom = new Room({ roomName, questionCount, maxUsers, categories });
            if (newRoom) {
                await newRoom.save();
                res.status(201).json({
                    _id: newRoom.id,
                    roomName: newRoom.roomName,
                    questionCount: newRoom.questionCount,
                    maxUsers: newRoom.maxUsers,
                    categories: newRoom.categories,
                });
            } else {
                res.status(400).json({error: 'Datos de sala no válidos'});
            }
    } catch (error) {
        console.log("Error en createRoom ",error.message);
        res.status(500).json({error: error.message});
    }
};

export const startRoom = async (req, res) => {
    try {
            const room = await Room.findById(req.params.id);
            if (room.users.length > 1) {
                room.status = 'in-progress';
                await room.save();
                // Lógica adicional para enviar preguntas a los usuarios
                res.status(200).json({
                    _id: room.id,
                    roomName: room.roomName,
                    status: room.questionCount,
                });
            } else {
                res.status(400).json({error: 'No hay suficientes jugadores'});
            }
    } catch (error) {
        console.log("Error en startRoom ",error.message);
        res.status(500).json({error: error.message});
    }
};