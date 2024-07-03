import Question from "../models/question.model.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import sendRoomResultsNotifications from "../lib/utils/sendResultsNotifications.js";

export const listRooms = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Obtener el número de página desde la consulta o establecerlo en 1 por defecto
    const pageSize = parseInt(req.query.pageSize) || 10; // Obtener el tamaño de página desde la consulta o establecerlo en 10 por defecto
    const status = req.query.status || 'waiting';
    try {
        const totalCount = await Room.countDocuments({ status }); // Obtener el número total de salas
        const totalPages = Math.ceil(totalCount / pageSize); // Calcular el número total de páginas
        const skip = (page - 1) * pageSize; // Calcular el índice de inicio para la consulta
        
        const rooms = await Room.find({ status })
            .sort([["createdAt", -1]])
            .skip(skip) // Saltar las salas anteriores en la página actual
            .limit(pageSize); // Limitar el número de salas por página

        if (!rooms || rooms.length === 0) return res.status(404).json({ error: "No hay Salas que listar. Crea una sala y diviértete" });
        const hasMore = page < totalPages;
        
        res.status(200).json({
            rooms: rooms,
            totalPages,
            currentPage: page,
            pageSize,
            totalCount,
            hasMore
        });

        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRoomsCountCreated = async (req, res) => {
    const { userId } = req.params;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        // Encontrar el primer usuario asociado a las salas creadas por el usuario
        const userRooms = await Room.find({
            'users.0': userId, // Asegurarse de que el primer usuario sea el creador
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        let normalRoomsCount = 0;
        let superRoomsCount = 0;

        // Contar solo las salas creadas por el primer usuario
        userRooms.forEach(room => {
            if (room.status !== 'finished') {
                if (room.roomType === 'normal') {
                    normalRoomsCount++;
                } else if (room.roomType === 'super') {
                    superRoomsCount++;
                }
            }
        });

        res.json({ normal: normalRoomsCount, super: superRoomsCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Función para mezclar aleatoriamente un array utilizando el algoritmo de mezcla de Fisher-Yates.
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

// Helper function to get the start of the day
const getStartOfDay = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
};

const createRoom = async (req, res, roomType) => {
    try {
        const { roomName, questionCount, categories, creatorId } = req.body;
        const startOfDay = getStartOfDay();
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);

        const user = await User.findById(creatorId);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        // Contar salas normales creadas por el usuario en el día actual
        const normalRoomsCount = await Room.countDocuments({
            'users.0': creatorId, // Asegurarse de que el primer usuario sea el creador
            roomType: 'normal',
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'finished' } // Excluir salas en estado 'finished'
        });

        // Contar súper salas creadas por el usuario en el día actual
        const superRoomsCount = await Room.countDocuments({
            'users.0': creatorId,
            roomType: 'super',
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'finished' }
        });
        if (roomType === 'normal' && normalRoomsCount >= 3) {
            return res.status(400).json({ error: "Límite diario de creación de salas normales alcanzado (3)." });
        }

        if (roomType === 'super' && superRoomsCount >= 1) {
            return res.status(400).json({ error: "Límite diario de creación de salas bomba alcanzado (1)." });
        }

        // Realizar consulta para obtener preguntas basadas en las categorías seleccionadas
        const questions = await Question.find({ category: { $in: categories } });
        // Seleccionar un número aleatorio de preguntas según questionCount
        const selectedQuestions = shuffleArray(questions).slice(0, questionCount);

        let duration = 86400000; // Valor predeterminado de duración (24 horas en milisegundos)
        if (roomType === 'super') {
            duration = 21600000; // Duración de 6 horas para salas super
        }

        // Crear la nueva sala con el creador como único usuario
        const newRoom = new Room({
            roomName,
            questionCount,
            categories,
            questions: selectedQuestions.map(question => question._id),
            users: [creatorId], // Agregar solo al creador como usuario inicial
            roomType,
            duration
        });

        await newRoom.save();
        res.status(201).json({
            _id: newRoom.id,
            roomName: newRoom.roomName,
            questionCount: newRoom.questionCount,
            categories: newRoom.categories,
            users: newRoom.users,
            roomType: newRoom.roomType,
            duration
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const createNormalRoom = async (req, res) => {
    await createRoom(req, res, 'normal');
};

export const createSuperRoom = async (req, res) => {
    await createRoom(req, res, 'super');
};

export const getRoomCreator = async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await Room.findById(roomId).populate('users', 'username profileImg');

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const creatorUsername = room.users.length > 0 ? room.users[0].username : 'Unknown';
        const profileImg = room.users.length > 0 ? room.users[0].profileImg : '/avatar-placeholder.png';

        res.status(200).json({ creatorUsername, profileImg });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRoomQuestions = async (req, res) => {
    try {
      const { roomId } = req.params;
  
      // Encontrar la sala por ID
      const room = await Room.findById(roomId).populate('questions');
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      res.status(200).json({ questions: room.questions });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};

export const getRoomCategories = async (req, res) => {
    try {
      const { roomId } = req.params;
  
      // Encontrar la sala por ID
      const room = await Room.findById(roomId).populate('categories', 'title');
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      // Extraer los nombres de las categorías
      const categoryNames = room.categories.map(category => category.title);

      res.status(200).json({ categories: categoryNames });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};


export const seeRoom = async (req, res) => {
    const roomId = req.params.id;

    try {
        const room = await Room.findById({_id: roomId});
        if (!room) {
            return res.status(404).json({error: "Sala no encontrada"});
        }
        const users = await User.find({ _id: { $in: room.users } }).select('-email -password -emailConfirmed -deleted -role');;
        res.status(200).json({ room, users });
    } catch (error) {
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
        res.status(500).json({error: error.message});
    }
};

export const updateRoomStatus = async (req, res) => {
    const { roomId } = req.params;
    const { status } = req.body;
  
    if (!['waiting', 'in-progress', 'finished'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
  
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Sala no encontrada' });
      }
  
      room.status = status;
      await room.save();

      res.status(200).json({ message: 'Estado de la sala actualizado', room });
    } catch (error) {
      res.status(500).json({ error: 'Error actualizando el estado de la sala' });
    }
  };


// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private/Admin
export const listRoomsAdmin = async (req, res) => {
    try {
      // Obtén la lista de salas y carga las preguntas asociadas
      const rooms = await Room.find({}).populate('questions').sort({ createdAt: -1 });
      
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

// @desc    Update room
// @route   PUT /api/rooms
// @access  Private/Admin
export const editRoom = async (req, res) => {
    const { roomId } = req.params;
    const { roomName, status } = req.body;
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Sala no encontrada' });
        }

        if (roomName) {
            room.roomName = roomName;
        }
        if (status) {
            room.status = status;
        }

        await room.save();

        if (room.status === 'finished') {
            await sendRoomResultsNotifications(room);
        }


        res.status(200).json({ message: 'Sala actualizada', room });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la sala' });
    }
};