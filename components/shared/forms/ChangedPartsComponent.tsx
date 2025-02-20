// "use client";
// import React, { useState, useEffect } from "react";

// interface Props {
//   label: string;
//   availableParts?: string[];
//   onSelect: (selectedParts: string[]) => void;
//   reset: boolean;
//   onResetComplete: () => void;
// }

// export default function ChangedPartsComponent({
//   label,
//   availableParts = [
//     "Laser guard",
//     "Front",
//     "Fan",
//     "Fuser",
//     "Fuser sleeve",
//     "Scanner",
//     "Screen",
//     "Rolls",
//     "Tray rolls",
//     "Tray's front",
//     "Top",
//     "Left side",
//     "Right side",
//     "Tray",
//     "Rear Doors",
//     "Formator's door",
//     "Formator",
//     "Pressure roll",
//     "Solenoid #1",
//     "Solenoid #2",
//   ],
//   onSelect,
//   reset,
//   onResetComplete,
// }: Props) {
//   const [selectedParts, setSelectedParts] = useState<string[]>([]);

//   const handlePartSelect = (part: string) => {
//     const updatedParts = selectedParts.includes(part)
//       ? selectedParts.filter((p) => p !== part) // Убираем, если уже есть
//       : [...selectedParts, part]; // Добавляем новую часть

//     setSelectedParts(updatedParts);
//     onSelect(updatedParts); // Передаем наверх
//   };

//   useEffect(() => {
//     if (reset) {
//       setSelectedParts([]); // Сбрасываем выбор
//       onSelect([]); // Сообщаем родительскому компоненту
//       onResetComplete(); // Завершаем сброс
//     }
//   }, [reset, onSelect, onResetComplete]);


//   return (
//     <div className="my-4">
//       <label
//         className={`text-sm font-semibold mb-2 ${
//           selectedParts.length > 0 ? "text-green-500" : "text-slate-300"
//         }`}
//       >
//         {label}
//       </label>
//       <div className="flex flex-wrap gap-2">
//         {availableParts.map((part) => (
//           <button
//             key={part}
//             onClick={() => handlePartSelect(part)}
//             className={`py-2 px-4 rounded-lg ${
//               selectedParts.includes(part)
//                 ? "bg-primary-500 text-white"
//                 : "bg-dark-600 text-white hover:bg-dark-400"
//             }`}
//           >
//             {part}
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
  availableParts?: string[];
  onSelect: (selectedParts: string[]) => void;
  reset: boolean;
  onResetComplete?: () => void;
}

export default function ChangedPartsComponent({
  label,
  availableParts = [
    "Laser guard",
    "Front",
    "Fan",
    "Fuser",
    "Fuser sleeve",
    "Scanner",
    "Screen",
    "Rolls",
    "Tray rolls",
    "Tray's front",
    "Top",
    "Left side",
    "Right side",
    "Tray",
    "Rear Doors",
    "Formator's door",
    "Formator",
    "Pressure roll",
    "Solenoid #1",
    "Solenoid #2",
  ],
  onSelect,
  reset,
  onResetComplete,
}: Props) {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const handlePartSelect = (part: string) => {
    const updatedParts = selectedParts.includes(part)
      ? selectedParts.filter((p) => p !== part) // Убираем, если уже есть
      : [...selectedParts, part]; // Добавляем новую часть

    setSelectedParts(updatedParts);
    onSelect(updatedParts); // Передаем наверх
  };

  // Обрабатываем сброс формы
  useEffect(() => {
    if (reset) {
      console.log("Reset triggered in ChangedPartsComponent"); // Для отладки
      setSelectedParts([]); // Сбрасываем выбор
      onSelect([]); // Сообщаем родительскому компоненту
      
      // Вызываем `onResetComplete`, если он передан
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [reset, onSelect, onResetComplete]);

  return (
    <div className="my-4">
      <label
        className={`text-sm font-semibold ${
          selectedParts.length > 0 ? "text-green-500" : "text-slate-300"
        }`}
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mt-4">
        {availableParts.map((part) => (
          <button
            key={part}
            onClick={() => handlePartSelect(part)}
            className={`py-2 px-4 rounded-lg ${
              selectedParts.includes(part)
                ? "bg-primary-500 text-white"
                : "bg-dark-600 text-white hover:bg-dark-400"
            }`}
          >
            {part}
          </button>
        ))}
      </div>
    </div>
  );
}