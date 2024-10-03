/* eslint-disable consistent-return */
import { useState, useEffect } from 'react';

export default function useTimer(stop, callback, duration = 15) {
  const [timeLeft, setTimeLeft] = useState(duration);
  useEffect(() => {
    if (!timeLeft || stop) {
      callback();
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, stop]);

  return timeLeft;
}
