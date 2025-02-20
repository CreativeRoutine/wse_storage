import { useState, useRef } from 'react';

export const useTimer = () => {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Запуск таймера
  const startTimer = () => {
    if (!timerActive) {
      setTimerActive(true);
      timerRef.current = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  // Остановка таймера
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimerActive(false);
      return timeElapsed / 60; // Возвращаем время в минутах
    }
  };

  // Сброс таймера
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
    setTimeElapsed(0);
  };

  // Пауза/Возобновление таймера
  const togglePauseResume = () => {
    if (timerActive) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  return {
    timeElapsed,
    startTimer,
    stopTimer,
    resetTimer,
    togglePauseResume,
    timerActive,
  };
};
