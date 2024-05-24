import { useEffect } from 'react';

const Timer = ({ time_for_answer, initialTime, onTimeUp, setTimeLeft }) => {
  //const [timeLeft, setTimeLeft] = useState(initialTime); // Cambié el tiempo inicial a 10 segundos para que coincida con el ejemplo de Tailwind

  useEffect(() => {
    if (initialTime <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === 0) {
          clearInterval(timerId);
          onTimeUp();
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [initialTime, onTimeUp, setTimeLeft]);
  
  const progressBarStyle = {
    width: `${(initialTime / time_for_answer) * 100}%`, // Ajusté el valor base a 10 segundos
    height: '20px',
    backgroundColor: 'bg-primary',
  };

  return (
    <div>
      <p className="text-center mt-3">
        <span>{initialTime}</span>
      </p>
      <div className="bg-gray-200 h-5 mt-2 rounded-md">
        <div className="h-full bg-blue-500" style={progressBarStyle}></div>
      </div>
    </div>
  );
};

export default Timer;
