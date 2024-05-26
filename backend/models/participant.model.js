import mongoose from "mongoose";


//este modelo se encargará de almacenar el progreso y la puntuación del usuario en una sala especifica. Se borrará cuando la sala se cierre.
const participantSchema  = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    selectedOption: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    lastQuestionIndex: { type: Number, default: 0 },
    score: {type: Number,default: 0,},
});

const Participant = mongoose.model('Participant', participantSchema );

export default Participant;