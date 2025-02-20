import { useEffect, useRef, useState } from "react";

export function usePersistentTimer() {
  const [timeElapsed, setTimeElapsed] = useState(0); // Прошедшее время в секундах
  const timerStartRef = useRef<number | null>(null); // Время старта таймера
  const intervalRef = useRef<number | null>(null); // Ссылка на идентификатор интервала
  const [isRunning, setIsRunning] = useState(false);

  // Запуск таймера
  const startTimer = () => {
    if (!isRunning) {
      timerStartRef.current = Date.now() - timeElapsed * 1000; // Вычисляем корректное время старта
      intervalRef.current = window.setInterval(() => {
        if (timerStartRef.current) {
          setTimeElapsed(Math.floor((Date.now() - timerStartRef.current) / 1000)); // Обновляем прошедшее время
        }
      }, 1000);
      setIsRunning(true);
    }
  };

  // Остановка таймера
  const stopTimer = () => {
    if (isRunning && intervalRef.current !== null) {
      clearInterval(intervalRef.current); // Останавливаем интервал
      intervalRef.current = null; // Сбрасываем ссылку на интервал
      setIsRunning(false);
    }
  };

  // Сброс таймера
  const resetTimer = () => {
    stopTimer(); // Останавливаем таймер
    setTimeElapsed(0); // Сбрасываем прошедшее время
    timerStartRef.current = null; // Сбрасываем начальную точку времени
  };

  useEffect(() => {
    return () => {
      // Очищаем интервал при размонтировании компонента
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeElapsed,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
}