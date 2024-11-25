// "use client";

// import React, { useState, useEffect } from "react";

// interface Props {
//   onInput: (value: number) => void; // Callback для передачи числа в родительский компонент
//   reset: boolean; // Указывает, нужно ли сбросить поле
//   onResetComplete: () => void; // Callback для уведомления о завершении сброса
//   label?: string; // Позволяет указать кастомную метку для поля
//   placeholder?: string; // Placeholder для ввода
// }

// const PagesNumberComponent: React.FC<Props> = ({
//   onInput,
//   reset,
//   onResetComplete,
//   label = "Pages printed",
//   placeholder = "0",
// }) => {
//   const [inputValue, setInputValue] = useState<number | string>("");

//   // Флаг для динамической окраски лейбла
//   const isValid = inputValue !== "" && Number(inputValue) > 0;

//   useEffect(() => {
//     if (reset) {
//       setInputValue(""); // Сбрасываем поле
//       onInput(0); // Передаем значение 0 как сброшенное
//       onResetComplete(); // Уведомляем родительский компонент, что сброс завершен
//     }
//   }, [reset, onInput, onResetComplete]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value === "" ? "" : Number(e.target.value);
//     setInputValue(value);
//     if (value !== "") {
//       onInput(value); // Передаем только валидное число
//     }
//   };

//   return (
//     <div className="my-2">
//       <div className="flex flex-row items-center space-y-0">
//         {label && (
//           <label
//             className={`w-2/3 text-md font-semibold ${
//               isValid ? "text-green-500" : "text-slate-300"
//             }`}
//           >
//             {label}
//           </label>
//         )}
//         <input
//           type="number"
//           value={inputValue}
//           className="w-full bg-dark-600 text-white rounded p-2 pr-6 flex flex-wrap justify-end gap-2 text-right border-0 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0"
//           onChange={handleChange}
//           placeholder={placeholder}
//           min="0" // Ограничение только на положительные числа
//         />
//       </div>
//     </div>
//   );
// };

// export default PagesNumberComponent;

"use client";

import React, { useState, useEffect } from "react";

interface Props {
  onInput: (value: number) => void; // Callback для передачи числа в родительский компонент
  reset: boolean; // Указывает, нужно ли сбросить поле
  onResetComplete?: () => void; // Callback для уведомления о завершении сброса
  label?: string; // Позволяет указать кастомную метку для поля
  placeholder?: string; // Placeholder для ввода
}

const PagesNumberComponent: React.FC<Props> = ({
  onInput,
  reset,
  onResetComplete,
  label = "Pages printed",
  placeholder = "0",
}) => {
  const [inputValue, setInputValue] = useState<number | string>("");

  // Флаг для динамической окраски лейбла
  const isValid = inputValue !== "" && Number(inputValue) > 0;

  // Обработка сброса формы
  useEffect(() => {
    if (reset) {
      console.log("Reset triggered in PagesNumberComponent"); // Для отладки
      setInputValue(""); // Сбрасываем поле
      onInput(0); // Передаем значение 0 как сброшенное
      if (onResetComplete) {
        onResetComplete(); // Уведомляем родительский компонент, что сброс завершен
      }
    }
  }, [reset, onInput, onResetComplete]);

  // Обработка изменений в поле ввода
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : Math.max(0, Number(e.target.value)); // Ограничиваем ввод на отрицательные числа
    setInputValue(value);
    if (value !== "") {
      onInput(value); // Передаем только валидное число
    } else {
      onInput(0); // Если значение пустое, передаем 0
    }
  };

  return (
    <div className="my-2">
      <div className="flex flex-row items-center space-y-0">
        {label && (
          <label
            className={`w-2/3 text-md font-semibold ${
              isValid ? "text-green-500" : "text-slate-300"
            }`}
          >
            {label}
          </label>
        )}
        <input
          type="number"
          value={inputValue}
          className="w-full bg-dark-600 text-white rounded p-2 pr-6 text-right border-0 focus:outline-none focus:ring-0 focus:shadow-none"
          onChange={handleChange}
          placeholder={placeholder}
          min="0" // Ограничение только на положительные числа
        />
      </div>
    </div>
  );
};

export default PagesNumberComponent;