import Room from "../models/room.model.js";
import Score from "../models/score.model.js"


export const getResults = async (req, res) => {
    try {
        const scores = await Score.find({ roomId: req.params.roomId }).populate('user', 'username profileImg').sort({ score: -1 });
        res.status(200).json(scores);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching results', });
      }
}  

export const sendResults = async (req, res) => {

    
    const { userId, score, roomId } = req.body;
    try {
      const newScore = new Score({
        user: userId,
        roomId: roomId,
        score,
      });
      await newScore.save();

      res.status(201).json(newScore);
    } catch (error) {
      res.status(500).json({ error: 'Error submitting score' });
    }
}

export const getUserScoreInRoom = async (req, res) => {
  const { roomId, userId } = req.params;

  try {
    const score = await Score.findOne({ roomId, user: userId });
    if (!score) {
      return res.status(200).json({ hasScore: false });
    }
    res.status(200).json({ hasScore: true, score });
  } catch (error) {
    res.status(500).json({ error: 'Error checking user score', });
  }
};

export const getUserLastScores = async (req, res) => {
  try {
    const { userId } = req.params;

    const scores = await Score.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('roomId');

    const scoresWithPositions = await Promise.all(scores.map(async (score) => {
      // Obtener la sala asociada al puntaje
      const room = await Room.findById(score.roomId);
      if (!room) {
        throw new Error(`Room with ID ${score.roomId} not found.`);
      }

      // Obtener todos los puntajes para esta sala ordenados por score descendentemente
      const allScoresForRoom = await Score.find({ roomId: score.roomId })
        .sort({ score: -1 });

      // Encontrar la posición del usuario dentro de los puntajes ordenados
      const userScoreIndex = allScoresForRoom.findIndex(s => s.user.toString() === userId);
      const userPosition = userScoreIndex + 1; // Sumar 1 porque los índices comienzan en 0

      return {
        score,
        room,
        userPosition
      };
    }));

    res.json(scoresWithPositions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



export const finalScoreAlreadyExists = async (userId, roomId) => {
  try {
    // Busca un registro de puntuación final para el usuario y la sala específicos
    const existingScore = await ScoreModel.findOne({ user: userId, room: roomId });

    // Si se encuentra un registro y tiene un puntaje asignado, devuelve true
    return existingScore && existingScore.score !== null;
  } catch (error) {
    console.error('Error checking final score existence:', error);
    return false; // Devuelve false en caso de error
  }
};
