// "use client";
// import React, { useState, useEffect } from "react";

// interface Props {
//   label: string;
//   availableTests?: string[];
//   onSelect: (selectedTests: string[]) => void;
//   reset: boolean;
//   onResetComplete: () => void;
// }

// export default function TestedFunctions({
//   label,
//   availableTests = [
//     "USB",
//     "Scanner",
//     "Network",
//     "Cold Reset",
//     "Cleaning page",
//     "NVRam reset",
//     "Maintenance Kit",
//   ],
//   onSelect,
//   reset,
//   onResetComplete,
// }: Props) {
//   const [selectedTests, setSelectedTests] = useState<string[]>([]);

//   const handleTestSelect = (test: string) => {
//     const updatedTests = selectedTests.includes(test)
//       ? selectedTests.filter((t) => t !== test) // Убираем, если уже есть
//       : [...selectedTests, test]; // Добавляем тест

//     setSelectedTests(updatedTests);
//     onSelect(updatedTests); // Передаем наверх
//   };

//   useEffect(() => {
//     if (reset) {
//       setSelectedTests([]); // Сбрасываем выбор
//       onSelect([]); // Сообщаем родительскому компоненту
//       onResetComplete(); // Завершаем сброс
//     }
//   }, [reset, onSelect, onResetComplete]);

//   return (
//     <div className="my-4">
//       <label
//         className={`text-sm font-semibold mb-2 ${
//           selectedTests.length > 0 ? "text-green-500" : "text-slate-300"
//         }`}
//       >
//         {label}
//       </label>
//       <div className="flex flex-wrap gap-2">
//         {availableTests.map((test) => (
//           <button
//             key={test}
//             onClick={() => handleTestSelect(test)}
//             className={`py-2 px-4 rounded-lg ${
//               selectedTests.includes(test)
//                 ? "bg-primary-500 text-white"
//                 : "bg-dark-600 text-white hover:bg-dark-400"
//             }`}
//           >
//             {test}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";

interface Props {
  label: string;
  availableTests?: string[];
  onSelect: (selectedTests: string[]) => void;
  reset: boolean;
  onResetComplete?: () => void; // Сделаем необязательным
}

export default function TestedFunctions({
  label,
  availableTests = [
    "USB",
    "Scanner",
    "Network",
    "Cold Reset",
    "Cleaning page",
    "NVRam reset",
    "Maintenance Kit",
  ],
  onSelect,
  reset,
  onResetComplete,
}: Props) {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const handleTestSelect = (test: string) => {
    const updatedTests = selectedTests.includes(test)
      ? selectedTests.filter((t) => t !== test) // Убираем, если уже есть
      : [...selectedTests, test]; // Добавляем тест

    setSelectedTests(updatedTests);
    onSelect(updatedTests); // Передаем выбранные тесты наверх
  };

  // Обрабатываем сброс формы
  useEffect(() => {
    if (reset) {
      console.log("Reset triggered in TestedFunctions"); // Для отладки
      setSelectedTests([]); // Сбрасываем выбор
      onSelect([]); // Сообщаем родительскому компоненту
      
      // Если `onResetComplete` передан, вызываем его
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [reset, onSelect, onResetComplete]);

  return (
    <div className="my-4">
      <label
        className={`text-md font-semibold ${
          selectedTests.length > 0 ? "text-green-500" : "text-slate-300"
        }`}
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mt-4">
        {availableTests.map((test) => (
          <button
            key={test}
            onClick={() => handleTestSelect(test)}
            className={`py-2 px-4 rounded-lg ${
              selectedTests.includes(test)
                ? "bg-primary-500 text-white"
                : "bg-dark-600 text-white hover:bg-dark-400"
            }`}
          >
            {test}
          </button>
        ))}
      </div>
    </div>
  );
}