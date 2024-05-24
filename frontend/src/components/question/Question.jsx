import { useEffect, useState } from "react";
import Timer from './Timer';
import LoadingSpinner from '../common/LoadingSpinner';

const Question = ({ roomId, userId }) => {

  const TIME_FOR_QUESTION = 15;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_FOR_QUESTION);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingQuestion(true);
        const res = await fetch(`/api/rooms/${roomId}/questions`);
        if (!res.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await res.json();
        setQuestions(data.questions);
        setIsLoadingQuestion(false);
      } catch (error) {
        console.error(error);
        setIsLoadingQuestion(false);
      }
    };

    fetchData();
  }, [roomId]);

  useEffect(() => {
    // Ensure currentQuestionIndex is within bounds
    if (currentQuestionIndex >= questions.length) {
      return;
    }

    // Check if the current question is valid
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && Array.isArray(currentQuestion.options)) {
      const shuffled = [...currentQuestion.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    } else {
      // Skip invalid questions and move to the next valid one without causing a re-render loop
      setCurrentQuestionIndex((prevIndex) => {
        if (prevIndex + 1 >= questions.length) {
          return prevIndex; // Stay at the last valid index if out of bounds
        }
        return prevIndex + 1;
      });
    }
  }, [questions, currentQuestionIndex]);

  const handleAnswer = async (questionId, option) => {
    if (selectedOption || isTimeUp) return; // Prevent multiple answers or answering after time is up

    const res = await fetch('/api/validate/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionId, selectedOption: option }),
    });

    if (!res.ok) {
      throw new Error('Failed to validate answer');
    }

    const data = await res.json();
    setSelectedOption(option);
    setAnswerStatus(data.isCorrect ? 'correct' : 'incorrect');

    if (data.isCorrect) {
      const basePoints = 10;
      const timeBonus = Math.max(0, timeLeft); // Time bonus based on remaining time
      setScore(score + basePoints + timeBonus);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setAnswerStatus(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Always increment currentQuestionIndex
      setIsTimeUp(false); // Reset time up state
    }, 1000); // Wait 1 second before showing the next question

   
    if (!isTimeUp) {
      setTimeLeft(TIME_FOR_QUESTION);
    }
  };

  const handleTimeUp = () => {
    if (selectedOption) return; // Prevent marking as incorrect if already answered

    setAnswerStatus('incorrect');
    setIsTimeUp(true);
    setTimeout(() => {
      setSelectedOption(null);
      setAnswerStatus(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Always increment currentQuestionIndex
      setIsTimeUp(false);
      setTimeLeft(TIME_FOR_QUESTION); // Reset time up state
    }, 1000); // Wait 1 second before showing the next question
  };

  useEffect(() => {
    if (currentQuestionIndex >= questions.length && questions.length > 0) {
      submitScore();
    }
  }, [currentQuestionIndex, questions.length]);

  const submitScore = async () => {
    try {
      await fetch(`/api/room/${roomId}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, score, roomId }),
      });

      // Redirect to results page
      window.location.href = `/room/${roomId}/results`;
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  if (isLoadingQuestion) return <LoadingSpinner />; // Mostrar el spinner de carga mientras se cargan las preguntas

  if (currentQuestionIndex >= questions.length && questions.length > 0) {
    return null; // No renderizar nada si se han respondido todas las preguntas
  }

  if (!questions || questions.length === 0) return <p>No questions available</p>;

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return <p>No question data available</p>;

  return (
    <div className="flex justify-center items-start bg-gray-100 sm:min-w-full sm:min-h-full lg:min-h-min">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-extrabold lg:font-semibold mb-4 text-center">{currentQuestion.question}</h2>
        <div className="grid xl:grid-cols-2 sm:grid-cols-1 gap-4">
          {shuffledOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(currentQuestion._id, option)}
              className={`p-4 text-xl font-semibold rounded-md transition-colors ${
                selectedOption === option
                  ? answerStatus === 'correct'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                  : isTimeUp
                    ? 'bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              disabled={!!selectedOption || isTimeUp} // Disable button if answered or time is up
            >
              {option}
            </button>
          ))}
        </div>
        {!selectedOption && !isTimeUp && <Timer time_for_answer={TIME_FOR_QUESTION} initialTime={timeLeft} onTimeUp={handleTimeUp} setTimeLeft={setTimeLeft} />}
        {selectedOption && answerStatus !== null && (
          <p className="mt-4">{answerStatus === 'correct' ? "¡Correcto!" : "Incorrecto"}</p>
        )}
      </div>
    </div>
  );
};

export default Question;
