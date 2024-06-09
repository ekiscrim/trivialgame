import { useEffect, useState } from 'react';

const Timer = ({ time_for_answer, initialTime, onTimeUp, setTimeLeft }) => {
  const [timeLeft, setTimeLeftInternal] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeftInternal((prevTimeLeft) => {
        if (prevTimeLeft <= 0) {
          clearInterval(timerId);
          onTimeUp();
          return 0;
        }
        const newTimeLeft = prevTimeLeft - 1;
        return newTimeLeft;
      });
    }, 1000); // Actualizamos cada segundo para trabajar con valores enteros

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    setTimeLeft(timeLeft);
  }, [timeLeft, setTimeLeft]);

  const progressBarStyle = {
    width: `${(timeLeft / time_for_answer) * 100}%`,
    height: '20px',
    backgroundColor: 'bg-primary',
    transition: 'width 1s linear', // Transición más suave cada segundo
  };

  return (
    <div>
      <p className="text-center mt-3">
        <span>{timeLeft}</span> {/* Mostramos el tiempo como entero */}
      </p>
      <div className="bg-gray-200 h-5 mt-2 rounded-md">
        <div className="h-full bg-blue-500" style={progressBarStyle}></div>
      </div>
    </div>
  );
};

export default Timer;
