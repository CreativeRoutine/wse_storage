// "use client";

// import React, { useState, useEffect } from "react";

// interface Props {
//   onInput: (value: string) => void; // Callback для передачи данных в родительский компонент
//   reset: boolean; // Указывает, нужно ли сбросить поле
//   onResetComplete: () => void; // Callback, сообщающий об окончании сброса
//   label?: string; // Позволяет указать кастомную метку для поля
//   placeholder?: string; // Placeholder для поля ввода
// }

// const TextInput: React.FC<Props> = ({
//   onInput,
//   reset,
//   onResetComplete,
//   label = "Additional Information",
//   placeholder = "Enter additional information",
// }) => {
//   const [inputValue, setInputValue] = useState<string>("");
//   const [isChanged, setIsChanged] = useState<boolean>(false); // Для отслеживания изменений

//   useEffect(() => {
//     if (reset) {
//       setInputValue(""); // Сбрасываем значение поля
//       setIsChanged(false); // Сбрасываем состояние изменения
//       onInput(""); // Сообщаем родителю о сбросе
//       onResetComplete(); // Сообщаем родителю, что сброс завершен
//     }
//   }, [reset, onInput, onResetComplete]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setInputValue(value);
//     setIsChanged(value.trim() !== ""); // Устанавливаем состояние изменения, если что-то введено
//     onInput(value); // Передаем введенное значение в родительский компонент
//   };

//   return (
//     <div className="my-4">
//       <div className="flex flex-row items-center space-y-0">
//         {label && (
//           <label
//             className={`w-2/3 text-base font-semibold ${
//               isChanged ? "text-green-500" : "text-slate-300"
//             }`}
//           >
//             {label}
//           </label>
//         )}
//         <input
//           type="text"
//           value={inputValue}
//           className="w-full bg-dark-600 text-white rounded p-2 pr-6 flex flex-wrap justify-end gap-2 text-left border-0 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0"
//           onChange={handleChange}
//           placeholder={placeholder}
//         />
//       </div>
//     </div>
//   );
// };

// export default TextInput;

"use client";

import React, { useState, useEffect } from "react";

interface Props {
  onInput: (value: string) => void; // Callback для передачи данных в родительский компонент
  reset: boolean; // Указывает, нужно ли сбросить поле
  onResetComplete?: () => void; // Callback, сообщающий об окончании сброса (необязательный)
  label?: string; // Позволяет указать кастомную метку для поля
  placeholder?: string; // Placeholder для поля ввода
}

const TextInput: React.FC<Props> = ({
  onInput,
  reset,
  onResetComplete,
  label = "Additional Information",
  placeholder = "Enter additional information",
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isChanged, setIsChanged] = useState<boolean>(false); // Для отслеживания изменений

  // Обрабатываем сброс формы
  useEffect(() => {
    if (reset) {
      setInputValue(""); // Сбрасываем значение поля
      setIsChanged(false); // Сбрасываем состояние изменения
      onInput(""); // Сообщаем родителю о сбросе
      if (onResetComplete) {
        onResetComplete(); // Сообщаем родителю, что сброс завершен
      }
    }
  }, [reset, onInput, onResetComplete]);

  // Обрабатываем изменения в поле ввода
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsChanged(value.trim() !== ""); // Устанавливаем состояние изменения, если что-то введено
    onInput(value); // Передаем введенное значение в родительский компонент
  };

  return (
    <div className="my-4">
      <div className="flex flex-row items-center space-y-0">
        {label && (
          <label
            className={`w-2/3 text-base font-semibold ${
              isChanged ? "text-green-500" : "text-slate-300"
            }`}
          >
            {label}
          </label>
        )}
        <input
          type="text"
          value={inputValue}
          className="w-full bg-dark-600 text-white rounded p-2 pr-6 text-left border-0 focus:outline-none focus:ring-0 focus:shadow-none"
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextInput;