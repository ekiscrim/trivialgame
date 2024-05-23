import Score from "../models/score.model.js"


export const getResults = async (req, res) => {
    try {
        const scores = await Score.find({ roomId: req.params.roomId }).populate('user', 'username').sort({ score: -1 });
        res.status(200).json(scores);
      } catch (error) {
        console.log(error)
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
      console.log("PRESAVE: ",newScore)
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
    res.status(200).json({ hasScore: true });
  } catch (error) {
    res.status(500).json({ error: 'Error checking user score', });
  }
};