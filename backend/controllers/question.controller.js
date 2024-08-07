import Question from '../models/question.model.js';
import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';
import Participant from '../models/participant.model.js';
import Room from '../models/room.model.js';
import Category from '../models/category.model.js';

// Obtener preguntas de trivial por categoría
export const getQuestionsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  
  try {
    const questions = await Question.find({ 'category': categoryId });

    if (!questions || questions.length === 0) {
      return res.status(200).json({ error: 'No questions found for this category' });
    }
    
    res.status(200).json(questions);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, category } = req.body;
    const file = req.file;

    let imageUrl = null;

    if (file) {
      const stream = streamifier.createReadStream(file.buffer);
      
      const cloudinaryStream = cloudinary.uploader.upload_stream({ folder: 'questionImages' }, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Error uploading image to Cloudinary' });
          return;
        }
        
        imageUrl = result.secure_url;
        
        // Create a new question
        const newQuestion = new Question({
          question,
          options,
          correctAnswer,
          category,
          image: imageUrl, // Store the Cloudinary image URL
        });

        // Save the question in the database
        newQuestion.save()
          .then(() => {
            res.status(201).json(newQuestion);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error saving question to database' });
          });
      });

      stream.pipe(cloudinaryStream);
    } else {
      // Create a new question without an image
      const newQuestion = new Question({
        question,
        options,
        correctAnswer,
        category,
      });

      // Save the question in the database
      newQuestion.save()
        .then(() => {
          res.status(201).json(newQuestion);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Error saving question to database' });
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const editQuestion = async (req, res) => {
  try {
    const { _id, question, options, correctAnswer, category } = req.body;
    const file = req.file;

    let imageUrl = null;

    if (file) {
      const stream = streamifier.createReadStream(file.buffer);

      const cloudinaryStream = cloudinary.uploader.upload_stream({ folder: 'questionImages' }, async (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Error uploading image to Cloudinary' });
          return;
        }

        imageUrl = result.secure_url;

        const updateData = {
          question,
          options,
          correctAnswer,
          category,
          image: imageUrl, // Update with the new image URL
        };

        const updatedQuestion = await Question.findByIdAndUpdate(_id, updateData, { new: true });
        res.status(201).json('Question edited successfully');
      });

      stream.pipe(cloudinaryStream);
    } else {
      const updateData = {
        question,
        options,
        correctAnswer,
        category,
      };

      const updatedQuestion = await Question.findByIdAndUpdate(_id, updateData, { new: true });
      res.status(201).json('Question edited successfully');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
      const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
      res.send({ message: 'Question deleted successfully' });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
};


// Validar la respuesta del usuario
export const validateAnswer = async (req, res) => {
  const { userId, roomId, questionId, selectedOption, timeLeft, currentQuestionIndex } = req.body;
  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const currentTime = Date.now();

    if (currentTime - new Date(room.startTime).getTime() >= room.duration) {
      room.status = 'finished';
      await room.save();
      //redirect
      //return res.status(400).json({ error: 'The game is finished' });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    
    const isCorrect = question.correctAnswer === selectedOption;
    let basePoints = 10;
    if (room.roomType === 'super') {
      basePoints = 20; // Puntos base aumentados para salas "super"
    }

    let updatedScore = 0;
    if (isCorrect) {
      updatedScore = basePoints + timeLeft;
    }

    // Actualizar el índice de la última pregunta respondida y el score del participante
    const participant = await Participant.findOneAndUpdate(
      { userId, roomId },
      { $inc: { lastQuestionIndex: 1, score: updatedScore } },
      { new: true, upsert: true } // Create a new document if not exists
    );

    // Guardar la respuesta del participante
    const participantAnswer = new Participant({
      userId,
      roomId,
      questionId,
      selectedOption,
      isCorrect,
      lastQuestionIndex: participant.lastQuestionIndex, // Use the updated lastQuestionIndex
      score: updatedScore // Use the updated score
    });
    await participantAnswer.save();

    // Verificar si el participante ha respondido todas las preguntas
    const totalQuestions = room.questions.length;
    const hasCompleted = participant.lastQuestionIndex === totalQuestions;

    res.json({ isCorrect, participant, hasCompleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getParticipantProgress = async (req, res) => {
  const { userId, roomId } = req.params;
  try {
    let participant = await Participant.findOne({ userId, roomId });

    // Si el participante no existe, crear una nueva entrada con valores predeterminados
    if (!participant) {
      participant = new Participant({
        userId,
        roomId,
        lastQuestionIndex: 0,
        score: 0
      });
      await participant.save();
    }

    // Devolver el progreso del participante
    res.json({ lastQuestionIndex: participant.lastQuestionIndex, score: participant.score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getParticipants = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId).populate({
      path: 'users',
      select: 'username profileImg'
    });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room.users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching participants" });
  }
};


export const getUsersWithSameOption = async (req, res) => {
  const { roomId, questionId, option } = req.params;

  try {
    const participants = await Participant.find({ roomId, questionId, selectedOption: option }).populate('userId', 'username profileImg');

    const users = participants.map(participant => participant.userId);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getParticipantProgressAll = async (req, res) => {
  const { roomId, userId } = req.params;
  try {
    const participants = await Participant.find({ roomId, userId  }).populate('questionId', 'question').sort("lastQuestionIndex");
    res.json(participants);
    if (!participants) return res.status(404).json({ error: 'Participants not found' });
  }catch (error) {
    res.status(500).json({ error: "Error fetching progress" });
  }
};

export const getCategoryFromQuestion = async (req, res) => {
  const { questionId } = req.params;
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    if (!question.category) {
      return res.status(404).json({ message: 'Category not found for this question' });
    }

    const category = await Category.findById(question.category);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ category: category.title });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listQuestions = async (req, res) => {
  const categoryId = req.query.category;
  try {
    let questions;
    if (categoryId) {
      questions = await Question.find({ category: categoryId });
    } else {
      questions = await Question.find();
    }

    if (!questions || questions.length === 0) return res.status(404).json({error: "No hay Preguntas que listar"});

    res.status(200).json(questions);
  
  } catch (error) {

        res.status(500).json({error: error.message});
  }
};