import { useState, useEffect } from 'react';

const useCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(endTime - Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  return timeLeft;
};

export default useCountdown;