import { useState, useEffect } from 'react';

const Timer = ({ onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(10); // Cambié el tiempo inicial a 10 segundos para que coincida con el ejemplo de Tailwind

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const progressBarStyle = {
    width: `${(timeLeft / 10) * 100}%`, // Ajusté el valor base a 10 segundos
    height: '20px',
    backgroundColor: 'bg-primary',
  };

  return (
    <div>
      <p className="text-center">
        <span>{timeLeft}</span>
      </p>
      <div className="bg-gray-200 h-5 mt-2 rounded-md">
        <div className="h-full bg-blue-500" style={progressBarStyle}></div>
      </div>
    </div>
  );
};

export default Timer;
