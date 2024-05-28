import { useEffect, useState } from 'react';

const CountdownTimer = ({ time, onCountdownFinish }) => {
  const [seconds, setSeconds] = useState(time);

  useEffect(() => {
    if (seconds === 0) {
      onCountdownFinish();
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds, onCountdownFinish]);

  return <span className="countdown font-mono text-6xl grid justify-center items-center">
    <span style={{"--value":seconds}}></span>
    </span>;
};

export default CountdownTimer;
