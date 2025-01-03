import React, { useEffect, useState, useRef } from "react";

interface TimerProps {
  start: boolean; // Управляет запуском/остановкой таймера
  reset?: boolean; // Указывает, нужно ли сбросить таймер
  onTimeUpdate?: (elapsedTime: number) => void; // Callback для обновления времени
}

const Timer: React.FC<TimerProps> = ({ start, reset, onTimeUpdate }) => {
  const [timeElapsed, setTimeElapsed] = useState(0); // Прошедшее время в секундах
  const timerStartRef = useRef<number | null>(null); // Метка времени старта таймера
  const [isRunning, setIsRunning] = useState(false); // Флаг состояния таймера

  // Функция запуска таймера
  const startTimer = () => {
    if (!isRunning) {
      timerStartRef.current = Date.now() - timeElapsed * 1000; // Учитываем уже прошедшее время
      setIsRunning(true);
    }
  };

  // Функция остановки таймера
  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  // Сброс таймера
  const resetTimer = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    timerStartRef.current = null;
  };

  // Подсчет прошедшего времени
  useEffect(() => {
    if (isRunning) {
      const interval = window.setInterval(() => {
        if (timerStartRef.current) {
          const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000); // Рассчитываем прошедшее время
          setTimeElapsed(elapsed);
          if (onTimeUpdate) {
            onTimeUpdate(elapsed); // Передаем время в родительский компонент
          }
        }
      }, 1000);
  
      return () => clearInterval(interval); // Чистим интервал при размонтировании
    }
  }, [isRunning, onTimeUpdate]);

  // Обработка пропов `start` и `reset`
  useEffect(() => {
    if (start) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [start]);

  useEffect(() => {
    if (reset) {
      resetTimer();
    }
  }, [reset]);

  return (
    <div className="text-lg font-bold flex justify-center items-center">
      <div className="text-white mr-2">
        <span className="text-slate-400 font-normal text-sm">Time:</span>{" "}
        {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
      </div>
      <button
        onClick={() => (isRunning ? stopTimer() : startTimer())}
        className={`px-4 py-2 rounded ${isRunning ? "bg-red-500" : "bg-slate-500"} text-white`}
      >
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
  );
};

export default Timer;