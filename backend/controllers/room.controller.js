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


// Función para mezclar aleatoriamente un array utilizando el algoritmo de mezcla de Fisher-Yates.
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const createRoom = async (req, res, roomType) => {
    try {
        const { roomName, questionCount, categories, creatorId } = req.body;
        
        // Realizar consulta para obtener preguntas basadas en las categorías seleccionadas
        const questions = await Question.find({ category: { $in: categories } });
        // Seleccionar un número aleatorio de preguntas según questionCount
        const selectedQuestions = shuffleArray(questions).slice(0, questionCount);

        let duration = 86400000; // Valor predeterminado de duración (24 horas en milisegundos)
        if (roomType === 'super')  {
            duration = 21600000; // Duración de 6 horas para salas super
        }
        const newRoom = new Room({ 
            roomName, 
            questionCount,
            categories, 
            questions: selectedQuestions.map(question => question._id), // Asociar IDs de preguntas
            users: [creatorId], // Incluir al creador de la sala como usuario con puntaje inicial 0
            roomType: roomType, // Indicar el tipo de sala
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