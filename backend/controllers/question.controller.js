import Question from '../models/question.model.js';

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
    console.log(req.body)
    // Crear una nueva pregunta
    const newQuestion = new Question({
      question,
      options,
      correctAnswer,
      category,
    });

    // Guardar la pregunta en la base de datos
    await newQuestion.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Validar la respuesta del usuario
export const validateAnswer = async (req, res) => {
  const { questionId, selectedOption } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    const isCorrect = question.correctAnswer === selectedOption;
    res.json({ isCorrect });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
