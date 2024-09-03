"use client";
import React, { useState, useEffect } from 'react';

interface Props {
  onInput: (value: number) => void;
  reset: boolean;
  onResetComplete: () => void;
}

export default function PagesNumber({ onInput, reset, onResetComplete }: Props) {
  const [inputValue, setInputValue] = useState<number | string>("");

  useEffect(() => {
    if (reset) {
      setInputValue(""); // Сброс значения ввода
      onInput(0); // Передаем 0 как значение по умолчанию
      onResetComplete(); // Сообщаем родителю, что сброс завершен
    }
  }, [reset, onInput, onResetComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setInputValue(value);
    if (value !== "") {
      onInput(value); // Передаем в onInput только числовое значение
    }
  };

  return (
    <div className="my-2">
      <div className="flex flex-row items-start space-y-0">
        <label className="w-2/3 text-base text-slate-300 font-semibold">Pages printed</label>
        <input
          type="number"
          value={inputValue}
          className="w-full bg-dark-600 text-white rounded p-2 pr-6 flex flex-wrap justify-end gap-2 text-right border-0 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0"
          onChange={handleChange}
          placeholder="0"
        />
      </div>
    </div>
  );
}
