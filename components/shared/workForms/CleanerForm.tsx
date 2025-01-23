"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import StuffForm from "@/components/shared/forms/StuffForm";
import Timer from "@/components/shared/workForms/Timer";
import FindPrinterCleaner from "@/components/shared/workForms/FindPrinter";
import OptionSelector from "@/components/shared/workForms/OptionSelect";
import TestedFunctions from "@/components/shared/forms/TestedFunctions";
import TextInputComponent from "@/components/shared/forms/TextInputComponent";
import PagesNumberComponent from "@/components/shared/forms/PagesNumberComponent";
import ChangedPartsComponent from "@/components/shared/forms/ChangedPartsComponent";
import AddPartFromPrinter from "@/components/shared/parts/AddPartFromPrinter";
import { useToast } from "@/components/ui/use-toast";
import { createParts } from '@/lib/actions/parts.action';

import { useTimer } from "@/components/shared/hooks/useTimer";
import moment from 'moment-timezone';
import { updatePrinterWithCheckCleaner } from "@/lib/actions/printer.action";
import SelectUser from "./SelectUser";
import PartsChanged from "./PartsChanged";
import PartsTested from "./PartsTested";
import TotalPageCount from "./TotalPageCount";
import AdditionalInfoText from "./AdditionalInfoText";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import InvoiceNumber from "./InvoiceNumber";

interface Props {
  users: any;
  
}
interface printerData {
  _id?: string;
  barcode: string;
  name: string;
  sn: string;
  productNumber: string;
  preview: string;
  tasksPerformed: string[]; // Массив строк
  comment: string;
}

const CleanerForm = ({ users}: Props) => {
  const { toast } = useToast();
  const [switchState, setSwitchState] = useState(false);

  // MY NEW STATES -- START

  // console.log("USERS", users,  "PARTS LIST", partsList);
  const [user, setUser] = useState({ id: "", name: "Not selected!" });
  const [printerData, setPrinterData] = useState<printerData | null>(null);
  const [overallCondition, setOverallCondition] = useState<string | null>(null);
  const [cleanliness, setCleanliness] = useState<string | null>(null);
  const [workable, setWorkable] = useState<string | null>(null);

  const [afterRefurbish, setAfterRefurbish] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [testedAfterCleaning, setTestedAfterCleaning] = useState<string | null>(null);
  const [savedTime, setSavedTime] = useState<number | null>(null);
  // RESET
  const [resetForms, setResetForms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // MY NEW STATES -- END
  const resetAllStates = () => {
    setPrinterData(null)
    setOverallCondition(null);
    setCleanliness(null);
    setWorkable(null);
    // setChangedParts([])
    // setTestedFunctions([])
    setAfterRefurbish(null)
    setAdditionalInfo(null)
    setPrinterFound(false); // Останавливаем таймер
  }

  const { timeElapsed, startTimer, stopTimer, resetTimer } = useTimer(); 
  const [printerFound, setPrinterFound] = useState(false);
  const [resetFormTimer, setResetFormTimer] = useState(false); 


  const handleFormSubmit = async () => {
    setErrorMessage(null); // Очищаем ошибки перед началом проверки
  
    // Проверка обязательных полей
    const requiredFields = [overallCondition, cleanliness, afterRefurbish];
    if (requiredFields.some((field) => !field)) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (!user.id) {
      setErrorMessage("Please select a user.");
      return;
    }
    if (!printerData) {
      setErrorMessage("Please search and select a printer.");
      return;
    }
    const createFormData = () => {
      const createdOn = moment().tz("America/Chicago").toDate();
      createdOn.setHours(createdOn.getHours());
    
      return {
        date: createdOn,
        printerId: printerData?._id,
        selectedUser: user,
        overallCondition,
        cleanliness,
        afterRefurbish,
        additionalInfo,
        timeSpent: savedTime,
        status: afterRefurbish,
        tested: testedAfterCleaning,
        invoiceNumber: invoiceNumber,
        path: window.location.pathname,
      };
    };
    const data = createFormData(); // Создаем данные формы
  
    try {
      const printerResponse = await updatePrinterWithCheckCleaner(data);
      if (!printerResponse.success) {
        toast({ title: "Error", description: printerResponse.message, variant: "custom" });
        return;
      }
  
      toast({ title: "Form submitted successfully!", variant: "default" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: "An error occurred while submitting the form.",
        variant: "destructive",
      });
    }
    setResetForms(true);
    resetAllStates();
  };
  
  useEffect(() => {
    if (resetForms) {
      const timer = setTimeout(() => setResetForms(false), 500); // Сбрасываем обратно
      return () => clearTimeout(timer); // Очищаем таймер
    }
  }, [resetForms]);

  useEffect(() => {
      if (printerData) {
        setPrinterFound(true); // Таймер должен запуститься при новом найденном принтере
      } else {
        setPrinterFound(false); // Остановить таймер, если принтер сброшен
      }
    }, [printerData]); // Вызывается при изменении resetForms // Вызывается при изменении resetForms
  
  return (
    <div className="bg-secondary-200 px-6 mb-1 py-6 w-full rounded-xl border border-dark-350 shadow-lg flex flex-col items-end">
      {/* ================ USER INFO & TIMER ================ */}
      <div className="text-white font-bold px-1 mb-3 flex flex-col justify-between pb-4 w-full">
        {/* USER INFO */}
        <div className="flex flex-col  items-start w-full">
            <div className="flex flex-row justify-between items-center w-full">
              {user && user.name != "User not selected!" ? (
                <div>
                  <div className="text-slate-400 text-sm font-normal">{switchState ? "Клинер:" : "Cleaner: " }<span className="text-green-500 text-lg font-bold  ml-2">{user.name}</span></div>
                </div>
                ) : "Select name"}
              
              <Timer start={printerFound} reset={resetForms} onTimeUpdate={setSavedTime} />
            </div>

            <div className="flex flex-row items-start justify-start">
              <div className="w-auto flex flex-row gap-2 items-center justify-start">
                <Label htmlFor="part-switch" className="text-white text-md">{switchState ? "Англ." : "ENG." }</Label>
                <Switch 
                  checked={switchState}
                  className="bg-gray-500"
                  onCheckedChange={(checked) => setSwitchState(checked)}
                />
                
                <Label htmlFor="part-switch" className="text-white text-md">{switchState ? "Рус." : "RU" }</Label>

              </div>
          </div>
        </div>
        {/* PRINTER INFO */}
          {printerData && (
            <div className="bg-dark-100 rounded-xl p-2 px-4 my-2">
              <div className="my-4">
                <div className="font-bold text-normal text-white mb-2 flex flex-col justify-between">
                  <ul className="space-y-2 text-slate-400 font-normal text-sm">
                    <li>{switchState ? "Модель:" : "Make:" }<span className="text-white ml-2">{printerData.name}</span></li>
                    <li>{switchState ? "Баркод:" : "Barcode:" }<span className="text-white ml-2">{printerData.barcode}</span></li>
                    <li>{switchState ? "С/Н:" : "Serial number:"}<span className="text-white ml-2">{printerData.sn}</span></li>
                  </ul>
                </div>
                <div className="flex flex-row gap-2 justify-between items-center">
                  <Image src={printerData.preview} width={80} height={80} className="object-contain max-w-[100px]" alt="Printer" />
                  {printerData.tasksPerformed?.length > 0 && (
                      <ul className="space-y-2 text-slate-400 font-normal text-sm">
                        {/* Получаем последний элемент */}
                        {(() => {
                          const lastTask:any = printerData.tasksPerformed.at(-1);
                          return (
                            <>
                              <li>{switchState ? "Дата:" : "Date:"} <span className="text-white ml-2">{new Date(lastTask.date).toLocaleString()}</span></li>
                              <li>{switchState ? "Общее состояние:" : "Overall Condition:"} <span className="text-white ml-2">{lastTask.overallCondition}</span></li>
                              <li>{switchState ? "Чтепень чистоты:" : "Cleanliness:"} <span className="text-white ml-2">{lastTask.cleanliness}</span></li>
                              {/* <li>Workable: <span className="text-white ml-2">{lastTask.workable ? "Yes" : "No"}</span></li> */}
                              <li>{switchState ? "Имя тека" : "Performed By:"} <span className="text-white font-bold ml-2">{lastTask.user?.name || "Unknown"}</span></li>
                            </>
                          );
                        })()}
                      </ul>
                    )}
                </div>


              </div>
          </div>
          )}
      </div>

      {/* ================ SELECT USER ================ */}
      {/* <StuffForm users={normalizedUsers} setUser={setUser} /> */}
      {/* <StuffForm users={users} setUser={setUser} />
      <br/> */}
      <SelectUser users={users} setUser={setUser} />

      {/* ================ FIND PRINTER ================ */}
      <div className="py-2 mb-2 w-full">
        <FindPrinterCleaner label={switchState ? "Найти принтер по barcode:" : "Search for a printer by barcode:" } printer={setPrinterData} reset={resetForms} />
      </div>
      
      {/* ================ CONDITIONS ================ */}
      <div className="w-full border-b border-t border-slate-400 py-2">
        <OptionSelector
          label={switchState ? "Общее состояние:" : "Overall Condition" }
          options={["Good", "Damaged", "Dirty"]}
          onSelect={setOverallCondition}
          reset={resetForms}
          // onResetComplete={resetAllStates}
        />

        <OptionSelector
          label={switchState ? "Степень чистоты:" : "Grade" }
          options={["Clean", "Dirty", "Toner inside"]}
          onSelect={setCleanliness}
          reset={resetForms}
          // onResetComplete={resetAllStates}
        />

      </div>


      {/* ================ PAGES PRINTED & ADDITIONAL INFO ================ */}
      <div className="border-b border-slate-400 py-2 my-4 w-full">

        <OptionSelector
          label={switchState ? "После чистки:" : "After cleaning" }
          options={["Cleaned", "Broken"]}
          onSelect={setAfterRefurbish}
          reset={resetForms}
          // onResetComplete={resetAllStates}
        />

        <AdditionalInfoText
          label={switchState ? "Доп. информация:" : "Additional Information" }
          onInput={setAdditionalInfo}
          reset={resetForms}
          // onResetComplete={resetAllStates}
        />
      </div>
        
      <OptionSelector
          label={switchState ? "Тестировался после?" : "Tested after cleaning" }
          options={["Yes", "No"]}
          onSelect={setTestedAfterCleaning}
          reset={resetForms}
          // onResetComplete={resetAllStates}
        />

        <InvoiceNumber
          label={switchState ? "Номер ордера:" : "Invoice number" }
          onInput={setInvoiceNumber}
          reset={resetForms}
          // onResetComplete={resetAllStates}
        />
      

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}




      {/* ================ SUBMIT BUTTON ================ */}
      <button onClick={handleFormSubmit} className="mt-4 bg-primary-500 text-white px-4 py-2 rounded ml-0">
      {switchState ? "Чистка окончена" : "Submit Form!" }
      </button>
    </div>
  );
};

export default CleanerForm;