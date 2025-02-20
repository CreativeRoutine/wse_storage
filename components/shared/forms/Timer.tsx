// import React, { useEffect, useState, useRef } from "react";

// interface TimerProps {
//   start: boolean; // Управляет запуском/остановкой таймера
//   reset?: boolean; // Указывает, нужно ли сбросить таймер
// }

// const Timer: React.FC<TimerProps> = ({ start, reset }) => {
//   const [timeElapsed, setTimeElapsed] = useState(0); // Прошедшее время в секундах
//   const timerStartRef = useRef<number | null>(null); // Время старта таймера
//   const intervalRef = useRef<number | null>(null); // Идентификатор интервала
//   const [isRunning, setIsRunning] = useState(false); // Флаг состояния таймера

//   // Объединенная кнопка "Старт/Пауза"
//   const toggleTimer = () => {
//     if (isRunning) {
//       stopTimer(); // Если таймер запущен, останавливаем
//     } else {
//       startTimer(); // Если таймер остановлен, запускаем
//     }
//   };

//   // Запуск таймера
//   const startTimer = () => {
//     if (!isRunning) {
//       timerStartRef.current = Date.now() - timeElapsed * 1000;
//       intervalRef.current = window.setInterval(() => {
//         if (timerStartRef.current) {
//           setTimeElapsed(Math.floor((Date.now() - timerStartRef.current) / 1000)); // Обновляем прошедшее время
//         }
//       }, 1000);
//       setIsRunning(true);
//     }
//   };

//   // Остановка таймера
//   const stopTimer = () => {
//     if (isRunning && intervalRef.current !== null) {
//       clearInterval(intervalRef.current); // Останавливаем интервал
//       intervalRef.current = null; // Сбрасываем идентификатор интервала
//       setIsRunning(false);
//     }
//   };

//   // Сброс таймера
//   const resetTimer = () => {
//     stopTimer();
//     setTimeElapsed(0);
//     timerStartRef.current = null;
//   };

//   // Управление запуском таймера через проп `start`
//   useEffect(() => {
//     if (start && !isRunning) {
//       startTimer();
//     } else if (!start) {
//       stopTimer();
//     }


//   // Сбрасываем таймер при изменении пропа `reset`
//   useEffect(() => {
//     if (reset) {
//       resetTimer();
//     }
//   }, [reset]);

//   return (
//     <div className="text-lg font-bold flex justify-center items-center">
//       <div className=" text-white mr-2">
//         <span className="text-slate-400 font-normal text-sm">Time Elapsed:</span> {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
//       </div>
//       <button
//         onClick={toggleTimer}
//         className={`px-4 py-2 rounded ${isRunning ? "bg-red-500" : "bg-green-500"} text-white`}
//       >
//         {isRunning ? "Pause" : "Start"}
//       </button>
//     </div>
//   );
// };

// export default Timer;


import React, { useEffect, useState, useRef } from "react";

interface TimerProps {
  start: boolean; // Управляет запуском/остановкой таймера
  reset?: boolean; // Указывает, нужно ли сбросить таймер
}

const Timer: React.FC<TimerProps> = ({ start, reset }) => {
  const [timeElapsed, setTimeElapsed] = useState(0); // Прошедшее время в секундах
  const intervalRef = useRef<number | null>(null); // Идентификатор интервала
  const [isRunning, setIsRunning] = useState(false); // Флаг состояния таймера

  // Запуск таймера
  const startTimer = () => {
    if (!isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeElapsed((prev) => prev + 1); // Увеличиваем прошедшее время каждую секунду
      }, 1000);
      setIsRunning(true);
    }
  };

  // Остановка таймера
  const stopTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current); // Очищаем интервал
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  // Сброс таймера
  const resetTimer = () => {
    stopTimer();
    setTimeElapsed(0); // Обнуляем время
  };

  // Управление запуском/остановкой таймера через проп `start`
  useEffect(() => {
    if (start) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer(); // Чистим интервал при размонтировании
  }, [start]);

  // Управление сбросом через проп `reset`
  useEffect(() => {
    if (reset) {
      resetTimer();
    }
  }, [reset]);

  return (
    <div className="text-lg font-bold flex justify-center items-center">
      <div className="text-white mr-2">
        <span className="text-slate-400 font-normal text-sm">Time Elapsed:</span>{" "}
        {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
      </div>
      <button
        onClick={() => (isRunning ? stopTimer() : startTimer())}
        className={`px-4 py-2 rounded ${isRunning ? "bg-red-500" : "bg-green-500"} text-white`}
      >
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
  );
};

export default Timer;