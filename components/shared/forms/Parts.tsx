import React, { useState, useEffect } from 'react';

interface PartsProps {
  barcode: string;
  name: string;
  location: string;
  onChange: (updatedPart: { barcode: string; name: string; location: string }) => void;
  reset: boolean;
  onResetComplete: () => void;
}

const Parts: React.FC<PartsProps> = ({ barcode, name, location, onChange, reset, onResetComplete }) => {
  const [partBarcode, setPartBarcode] = useState<string>(barcode);
  const [partName, setPartName] = useState<string>(name);
  const [partLocation, setPartLocation] = useState<string>(location);

  // Handle reset when `reset` is triggered
  useEffect(() => {
    if (reset) {
      setPartBarcode('');
      setPartName('');
      setPartLocation('');
      onResetComplete(); // Notify parent that reset is done
    }
  }, [reset, onResetComplete]);

  // Update parent component when any field changes
  useEffect(() => {
    onChange({ barcode: partBarcode, name: partName, location: partLocation });
  }, [partBarcode, partName, partLocation, onChange]);

  return (
    <div className="parts-component">
        <div className='w-full flex flex-row items-start space-y-0 mb-3'>
          <label className="mb-3 text-base text-slate-300 font-semibold w-2/3">
              Barcode:
          </label>
          <input
              type="text"
              value={partBarcode}
              onChange={(e) => setPartBarcode(e.target.value)}
              className="w-full outline-none bg-dark-600 text-slate-400 border-0 rounded-lg no-focus py-2 px-3"
          />
        </div>

        <div className='w-full flex flex-row items-start space-y-0 mb-3'>
          <label className="mb-3 text-base text-slate-300 font-semibold w-2/3">
            Name:
          </label>
          <input
            type="text"
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
            className="w-full outline-none bg-dark-600 text-slate-400 border-0 rounded-lg no-focus  py-2 px-3"
          />
        </div>
        <div className='w-full flex flex-row items-start space-y-0 mb-3'>
          <label className="mb-3 text-base text-slate-300 font-semibold w-2/3">
            Location:
          </label>
          <input
            type="text"
            value={partLocation}
            onChange={(e) => setPartLocation(e.target.value)}
            className="w-full outline-none bg-dark-600 text-slate-400 border-0 rounded-lg no-focus  py-2 px-3"
          />
        </div>

    </div>
  );
};

export default Parts;