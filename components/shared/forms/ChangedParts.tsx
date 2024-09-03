"use client";
import React, { useState, useEffect } from 'react';

interface Props {
  onSelect: (updatedParts: string[]) => void;
  reset: boolean;
  onResetComplete: () => void;
}

export default function ChangedParts({ onSelect, reset, onResetComplete }: Props) {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const handleSelect = (part: string) => {
    const updatedParts = selectedParts.includes(part)
      ? selectedParts.filter(p => p !== part)
      : [...selectedParts, part];

    setSelectedParts(updatedParts);
    onSelect(updatedParts);
  };

  useEffect(() => {
    if (reset) {
      setSelectedParts([]); // Сбрасываем выбор
      onSelect([]); // Передаем пустой массив в родительский компонент
      onResetComplete(); // Сообщаем родителю, что сброс завершен
    }
  }, [reset, onSelect, onResetComplete]);

  return (
    <div className="my-2">
      <div className="w-full flex flex-row items-start space-y-0">
        <label className="text-base text-slate-300 font-semibold w-2/3">Parts changed</label>
        <div className="flex flex-wrap justify-end gap-2">
          {["Laser guard", "Front", "Scanner", "Screen", "Rolls", "Top", "Left side", "Right side", "Tray", "Rear Doors", "Solenoid #1", "Solenoid #2"].map(part => (
            <button
              key={part}
              onClick={() => handleSelect(part)}
              className={`py-2 px-4 rounded ${selectedParts.includes(part) ? 'bg-primary-500 text-white' : 'bg-dark-600 text-slate-400'}`}
            >
              {part}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
