import Room from "../models/room.model.js";
import User from "../models/user.model.js";


export const listRooms = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Obtener el número de página desde la consulta o establecerlo en 1 por defecto
    const pageSize = parseInt(req.query.pageSize) || 10; // Obtener el tamaño de página desde la consulta o establecerlo en 10 por defecto

    try {
        const totalCount = await Room.countDocuments({ status: 'waiting' }); // Obtener el número total de salas
        const totalPages = Math.ceil(totalCount / pageSize); // Calcular el número total de páginas
        const skip = (page - 1) * pageSize; // Calcular el índice de inicio para la consulta
        
        const rooms = await Room.find({ status: 'waiting' })
            .sort([["createdAt", -1]])
            .skip(skip) // Saltar las salas anteriores en la página actual
            .limit(pageSize); // Limitar el número de salas por página

        if (!rooms || rooms.length === 0) return res.status(404).json({ error: "No hay Salas que listar" });
        const hasMore = page < totalPages;
        
        //console.log("Datos enviados:", { rooms, totalPages, currentPage: page, pageSize, totalCount, hasMore }); // Agregar el log aquí


        res.status(200).json({
            rooms: rooms,
            totalPages,
            currentPage: page,
            pageSize,
            totalCount,
            hasMore
        });

        
    } catch (error) {
        console.log("Error en listRooms ", error.message);
        res.status(500).json({ error: error.message });
    }
};


export const createRoom = async (req, res) => {
    try {
            const { roomName, questionCount, maxUsers, categories, creatorId } = req.body;
            
            const newRoom = new Room({ roomName, questionCount, maxUsers, categories, users: [creatorId] });
            

            if (newRoom) {
                await newRoom.save();
                res.status(201).json({
                    _id: newRoom.id,
                    roomName: newRoom.roomName,
                    questionCount: newRoom.questionCount,
                    maxUsers: newRoom.maxUsers,
                    categories: newRoom.categories,
                    users: newRoom.users

                });
            } else {
                res.status(400).json({error: 'Datos de sala no válidos'});
            }
    } catch (error) {
        console.log("Error en createRoom ",error.message);
        res.status(500).json({error: error.message});
    }
};

export const seeRoom = async (req, res) => {
    const roomId = req.params.id;

    try {
        const room = await Room.findById({_id: roomId});
        if (!room) {
            return res.status(404).json({error: "Sala no encontrada"});
        }
        const users = await User.find({ _id: { $in: room.users } });
        res.status(200).json({ room, users });
    } catch (error) {
        console.log("Error en seeRoom ",error.message);
        res.status(500).json({error: error.message});
    }
};


export const joinRoom = async (req, res) => {
    const idRoom  = req.params.roomId;
    const { userId } = req.body || req.userId; // Suponiendo que tienes el ID del usuario en el cuerpo de la solicitud

    try {
        const room = await Room.findOne({_id: idRoom});
        if (!room) return res.status(404).json({error: "Sala no encontrada"});

        // TODO Aquí podrías agregar lógica adicional para verificar si el usuario está autorizado
        // para unirse a la sala, por ejemplo, comprobando si el usuario está en la lista de usuarios permitidos.

        if (!room.users.includes(userId)) {
            // Si el usuario no está en la lista, añádelo
            room.users.push(userId);
            await room.save();
        }

        res.status(200).json(room);
    
  } catch (error) {
        console.log("Error en joinRoom ",error.message);
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