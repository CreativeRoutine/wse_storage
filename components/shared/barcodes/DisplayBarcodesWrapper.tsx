"use client"
import React, { useState } from "react";
import DisplayBarcodes from "@/components/shared/barcodes/DisplayBarcodes";
import CreateBarcodes from "@/components/shared/barcodes/CreateBarcodes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DisplayStorageBarcodes from "@/components/shared/barcodes/DisplayStorageBarcodes";
import CreateWarhouseBarcode from "./CreateWarhouseBarcode";

interface Props {
  barcodes: any;
}

const DisplayBarcodesWrapper = ({ barcodes }: Props) => {
  const [generalBarcodes, setGeneralBarcodes] = useState({
    type: "WSE-PP",
    start: "1",
    finish: "1",
  }); // Стейт для основной логики

  const [storageBarcodes, setStorageBarcodes] = useState({
    type: "WSE-W1",
    start: "A1",
    finish: "2",
  }); // Стейт для логики склада

  console.log("storageBarcodes FROM MAIN", storageBarcodes)

  const [switchState, setSwitchState] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {/* SWITCHER */}
        <div className="flex flex-row gap-4 w-full">
          <Label htmlFor="part-switch" className="text-white text-md">
            Printer and etc.
          </Label>
          <Switch
            checked={switchState}
            className="bg-gray-500"
            onCheckedChange={(checked) => setSwitchState(checked)}
          />
          <Label htmlFor="part-switch" className="text-white text-md">
            Storage
          </Label>
        </div>

        <div>
          {!switchState ? (
            <div className="flex flex-row gap-4 w-full">
              {/* Логика для Printer и других */}
              <div className="bg-secondary-200 px-6 mb-1 py-6 w-1/2 rounded-xl print:hidden">
                <CreateBarcodes barcodes={barcodes} setTempBarcodes={setGeneralBarcodes} />
              </div>
              <div className="bg-secondary-200 px-6 mb-1 py-6 w-1/2 rounded-xl print:block">
                <DisplayBarcodes
                  type={generalBarcodes.type}
                  start={generalBarcodes.start}
                  finish={generalBarcodes.finish}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-row gap-4 w-full">
              {/* Логика для Storage */}
              <div className="bg-secondary-200 px-6 mb-1 py-6 w-1/2 rounded-xl print:hidden">
                <CreateWarhouseBarcode setTempBarcodes={setStorageBarcodes} />
              </div>
              {/* <div className="bg-secondary-200 px-6 mb-1 py-6 w-1/2 rounded-xl print:block">
                <DisplayStorageBarcodes
                  type={storageBarcodes.type}
                  start={storageBarcodes.start}
                  finish={storageBarcodes.finish}
                />
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayBarcodesWrapper;