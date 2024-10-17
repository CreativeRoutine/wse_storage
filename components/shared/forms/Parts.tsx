import React, { useState, useEffect } from 'react';

interface Part {
  barcode: string;
  name: string;
  location?: string;
  quantity: number;
}

interface PartsProps {
  reset: boolean;
  onResetComplete: () => void;
  onAddPart: (part: Part) => void; // Обработчик для добавления запчасти
  name: string; // Передаем имя принтера (make) из родительского компонента
}

const Parts: React.FC<PartsProps> = ({ reset, onResetComplete, onAddPart, name }) => {
  const [partBarcode, setPartBarcode] = useState<string>('');
  const [partName, setPartName] = useState<string>('');
  const [partLocation, setPartLocation] = useState<string>('');
  const [partQuantity, setPartQuantity] = useState<number>(1);

  // Сбрасываем поля при reset
  useEffect(() => {
    if (reset) {
      setPartBarcode('');
      setPartName('');
      setPartLocation('');
      setPartQuantity(1);
      onResetComplete(); // Уведомляем родительский компонент, что сброс завершен
    }
  }, [reset, onResetComplete]);

  // Добавление запчасти в массив и вызов родительской функции
  const addPart = () => {
    if (partBarcode && partName && partQuantity > 0) {
      const newPart: Part = { barcode: partBarcode, name: partName, location: partLocation, quantity: partQuantity };
      onAddPart(newPart); // Передаем новую запчасть родительскому компоненту
      // Очищаем форму после добавления
      setPartBarcode('');
      setPartName('');
      setPartLocation('');
      setPartQuantity(1);
    }
  };

  return (
    <div className="parts-component">
      <label className="block text-sm font-bold mb-2 text-white">
        Barcode:
      </label>
      <input
        type="text"
        value={partBarcode}
        onChange={(e) => setPartBarcode(e.target.value)}
        className="input-field"
        placeholder="Enter part barcode"
      />

      <label className="block text-sm font-bold mb-2 text-white">
        Name:
      </label>
      <input
        type="text"
        value={partName}
        onChange={(e) => setPartName(e.target.value)}
        className="input-field"
        placeholder="Enter part name"
      />

      <label className="block text-sm font-bold mb-2 text-white">
        Location:
      </label>
      <input
        type="text"
        value={partLocation}
        onChange={(e) => setPartLocation(e.target.value)}
        className="input-field"
        placeholder="Enter part location (optional)"
      />

      <label className="block text-sm font-bold mb-2 text-white">
        Quantity:
      </label>
      <input
        type="number"
        value={partQuantity}
        onChange={(e) => setPartQuantity(parseInt(e.target.value))}
        className="input-field"
        placeholder="Enter quantity"
        min="1"
      />

      <button onClick={addPart} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Add Part
      </button>
    </div>
  );
};

export default Parts;
