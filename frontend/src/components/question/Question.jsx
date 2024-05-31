import { useEffect, useState } from "react";
import Timer from './Timer';
import LoadingSpinner from '../common/LoadingSpinner';
import SkeletonCard from '../common/SkeletonCard';
import CountdownTimer from '../question/CountdownTimer';

const Question = ({ roomId, userId }) => {

  const TIME_FOR_QUESTION = 15;
  const TIME_FOR_SHOW_OPTIONS = 5;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [shuffleComplete, setShuffleComplete] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScoreExists, setFinalScoreExists] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIME_FOR_QUESTION);
  const [currentCategory, setCurrentCategory] = useState('');
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);


  const fetchCategoryName = async (questionId) => {
    try {
      console.log("Question ID:", questionId);
      const res = await fetch(`/api/question/${questionId}/getCategory`);
      if (!res.ok) {
        throw new Error('Failed to fetch category');
      }
      const data = await res.json();
      setCurrentCategory(data.category);
    } catch (error) {
      console.error(error);
    }
  };

  const submitScore = async (scoreParam) => {
    try {
      console.log("Score being submitted:", score); // Log para verificar el puntaje
      await fetch(`/api/room/${roomId}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, score: scoreParam, roomId }),
      });

      setFinalScoreExists(true);
      window.location.href = `/rooms/${roomId}/`;
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setIsCategoryLoading(true);      
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
      }finally {
        setIsCategoryLoading(false); // Establece isLoading a false después de la solicitud, independientemente del resultado
      }
    };

    fetchData();
  }, [roomId]);

  useEffect(() => {
    if (currentQuestionIndex >= questions.length || !questions[currentQuestionIndex]) {
      return;
    }

    fetchCategoryName(questions[currentQuestionIndex]._id);
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && Array.isArray(currentQuestion.options)) {
      const shuffled = [...currentQuestion.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
      if (currentQuestionIndex === 0) {
        setShuffleComplete(true);
      }
    } else {
      setCurrentQuestionIndex((prevIndex) => {
        if (prevIndex + 1 >= questions.length) {
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }
  }, [questions, currentQuestionIndex]);

  const handleTimeUp = async () => {
    if (selectedOption) return; // Prevent marking as incorrect if already answered
    setIsTimeUp(true);
    setAnswerStatus('incorrect');
    await handleAnswer(currentQuestion._id, 'no-time');

    setTimeout(() => {
      setSelectedOption(null);
      setAnswerStatus(null);
      //setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Always increment currentQuestionIndex
      setIsTimeUp(false);
    }, 1000); // Wait 1 second before showing the next question
  };

  const handleAnswer = async (questionId, option) => {

    //if (selectedOption || isTimeUp) setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    if (selectedOption || isTimeUp) return;
    const res = await fetch('/api/validate/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, roomId, questionId, selectedOption: option, timeLeft, currentQuestionIndex }),
    });

    if (!res.ok) {
      throw new Error('Failed to validate answer');
    }

    const data = await res.json();
    setSelectedOption(option);
    setAnswerStatus(data.isCorrect ? 'correct' : 'incorrect');
    
    setShowCountdown(true); // Reset the countdown for the next question

    if (data.isCorrect) {
      const basePoints = 10;
      const timeBonus = Math.max(0, timeLeft);
      setScore((prevScore) => prevScore + basePoints + timeBonus);
    }

    await updateStatistics(userId, currentCategory, data.isCorrect);

    if (data.hasCompleted) {
      setTimeout(() => {
         setScore(data.participant.score);
         submitScore(data.participant.score); // Llama a submitScore() después de mostrar la respuesta de la última pregunta
      }, 1000); // Espera 1 segundo antes de llamar a submitScore()
    } else {
      setTimeout(() => {
        setSelectedOption(null);
        setAnswerStatus(null);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setIsTimeUp(false);
        setShowOptions(false);
        setTimeLeft(TIME_FOR_QUESTION);
      }, 1000);
    }

    if (!isTimeUp) {
      setTimeLeft(TIME_FOR_QUESTION);
    }
  };

  const updateStatistics = async (userId, category, isCorrect) => {
    try {
      await fetch('/api/statistic/updateStatistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, category, isCorrect }),
      });
    } catch (error) {
      console.error('Failed to update user statistics', error);
    }
  };


  useEffect(() => {
    const fetchParticipantProgress = async () => {
      try {
        const res = await fetch(`/api/participant/${userId}/${roomId}/progress`);
        if (!res.ok) {
          throw new Error('Failed to fetch participant progress');
        }
        const data = await res.json();
        setCurrentQuestionIndex(data.lastQuestionIndex);
        setScore(data.score);

        const finalScoreAlreadyExists = await fetch(`/api/scores/${userId}/${roomId}`);

        if (finalScoreAlreadyExists) {
          setFinalScoreExists(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchParticipantProgress();
  }, [userId, roomId]);


  if (isLoadingQuestion) return <SkeletonCard />;
  if (!shuffleComplete && currentQuestionIndex === 0) return <LoadingSpinner />;
  if (currentQuestionIndex >= questions.length && questions.length > 0) {
    window.location.href = `/rooms/${roomId}`;
  }

  if (!questions || questions.length === 0) return <p>No questions available</p>;

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return <p>No question data available</p>;

  if(isCategoryLoading) return <LoadingSpinner />;
  
  return (
    <div>
<div className="flex justify-center bg-purple-700 text-cyan-300 text-4xl font-extrabold p-2 w-full relative"> 
  <div className="flex-grow flex justify-center">{currentQuestionIndex}/{questions.length}</div>
  <h2 className="top-0 right-0 mt-2 mr-2 text-sm font-light overflow-hidden max-w-[200px]">
    <span className="block overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[250px]">{currentCategory}</span>
  </h2>
</div>

      <div className="flex justify-center items-start bg-gray-100 sm:min-w-full sm:min-h-full lg:min-h-min">
        <div className="max-w-4xl w-full shadow-md p-8">
          <div className="w-56 flex justify-between ml-9">
            {currentQuestion.image && (
              <figure><img className="mask mask-squircle" src={currentQuestion.image} alt="" /></figure>
            )}
          </div>
          <h2 className="text-2xl font-extrabold lg:font-semibold mb-4 text-center">{currentQuestion.question}</h2>        
          {showCountdown && !showOptions && (
            <CountdownTimer time={TIME_FOR_SHOW_OPTIONS} onCountdownFinish={() => setShowOptions(true)} />
          )}
          {showOptions && (
            <div className="grid xl:grid-cols-2 sm:grid-cols-1 gap-4 animate-scale-in">
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
          )}
          {!selectedOption && !isTimeUp && showOptions && <Timer time_for_answer={TIME_FOR_QUESTION} initialTime={TIME_FOR_QUESTION} onTimeUp={handleTimeUp} setTimeLeft={setTimeLeft} />}
          {selectedOption && answerStatus !== null && (
            <p className="mt-4">{answerStatus === 'correct' ? "¡Correcto!" : "Incorrecto"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
