"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import StuffForm from "@/components/shared/forms/StuffForm";
import Timer from "@/components/shared/workForms/Timer";
import FindPrinter from "@/components/shared/workForms/FindPrinter";
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
import { updatePrinterWithCheck } from "@/lib/actions/printer.action";
import SelectUser from "./SelectUser";
import PartsChanged from "./PartsChanged";
import PartsChangedNew from "./PartsChangedNew";
import PartsTested from "./PartsTested";
import TotalPageCount from "./TotalPageCount";
import AdditionalInfoText from "./AdditionalInfoText";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
  users: any;
  partsList: any;
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

const TechWorkForm = ({ users, partsList }: Props) => {
  const { toast } = useToast();
  const [switchState, setSwitchState] = useState(false);

  // MY NEW STATES -- START

  // console.log("USERS", users,  "PARTS LIST", partsList);
  const [user, setUser] = useState({ id: "", name: "User not selected! NEW" });
  const [printerData, setPrinterData] = useState<printerData | null>(null);
  const [overallCondition, setOverallCondition] = useState<string | null>(null);
  const [cleanliness, setCleanliness] = useState<string | null>(null);
  const [workable, setWorkable] = useState<string | null>(null);
  const [changedParts, setChangedParts] = useState<string[]>([]);
  const [testedFunctions, setTestedFunctions] = useState<string[]>([]);
  const [pagesNumber, setPagesNumber] = useState<number | null>(null);
  const [afterRefurbish, setAfterRefurbish] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
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
    setChangedParts([])
    setTestedFunctions([])
    setPagesNumber(null)
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
    const requiredFields = [overallCondition, cleanliness, workable, afterRefurbish];
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
      // const createdOn = moment().tz("America/Chicago").toDate();
      // createdOn.setHours(createdOn.getHours());

      const createdOn = new Date();
      
    
      return {
        date: createdOn,
        printerId: printerData?._id,
        selectedUser: user,
        overallCondition,
        cleanliness,
        workable,
        changedParts,
        afterRefurbish,
        pagesNumber,
        tested:testedFunctions,
        additionalInfo,
        timeSpent: savedTime,
        status: afterRefurbish === "Disassembled" ? "Disassembled" : "Refurbished",
        path: window.location.pathname,
      };
    };
    const data = createFormData(); // Создаем данные формы
  
    try {
      const printerResponse = await updatePrinterWithCheck(data);
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
  }, [printerData]); // Вызывается при изменении resetForms
  
  return (
    <div className="bg-secondary-200 px-6 mb-1 py-6 w-full rounded-xl border border-dark-350 shadow-lg">
      {/* ================ USER INFO & TIMER ================ */}
      <div className="text-white font-bold px-1 mb-3 flex flex-col justify-between border-b-2 border-slate-400 pb-4 w-full">
        {/* USER INFO */}
        <div className="flex flex-row justify-between items-center w-full">
          {user && user.name != "User not selected!" ? (
            <div>
              <div className="text-slate-400 text-base font-normal">Tech's name: <span className="text-white font-bold ml-1">{user.name}</span></div>
              {/* <div className="text-slate-400 text-base font-normal">Tech's ID: <span className="text-white font-bold ml-2">{user.id}</span></div> */}
            </div>
            ) : "Select User's name"}
          
          <div className="w-auto flex flex-row gap-2 items-center justify-start">
            <Label htmlFor="part-switch" className="text-white text-md">{switchState ? "Англ." : "ENG" }</Label>
            <Switch 
              checked={switchState}
              className="bg-gray-500"
              onCheckedChange={(checked) => setSwitchState(checked)}
            />
            <Label htmlFor="part-switch" className="text-white text-md">{switchState ? "Рус." : "RU" }</Label>
          </div>

          <Timer start={printerFound} reset={resetForms} onTimeUpdate={setSavedTime} />
        </div>
        {/* PRINTER INFO */}
          {printerData && (
            <div className="bg-dark-100 rounded-xl p-2 px-4 my-2">
              <div className="my-2 flex gap-4 flex-row justify-between">
                <div className="font-bold text-normal text-white mb-2 flex flex-col ">
                  {
                    printerData.preview ? (
                      <Image src={printerData.preview} width={100} height={100} className="object-contain max-w-[100px]" alt="Printer" />
                    ) : (<div className="mb-2">No image</div>)
                  }
                  <ul className="space-y-1 text-slate-400 font-normal text-sm">
                    <li>Make:<span className="text-white ml-2">{printerData.name}</span></li>
                    <li>Barcode:<span className="text-white ml-2">{printerData.barcode}</span></li>
                    <li>Prod. num.:<span className="text-white ml-2">{printerData.productNumber}</span></li>
                    {(() => {
                          const lastTask:any = printerData.tasksPerformed.at(-1);
                          return (
                            <>
                              {lastTask ? (
                                <>
                                  <li>{switchState ? "Дата:" : "Date:"} <span className="text-white ml-2">{new Date(lastTask.date).toLocaleString()}</span></li>
                                  <li>{switchState ? "Имя тека" : "Performed By:"} <span className="text-white font-bold ml-2">{lastTask.user?.name || "Unknown"}</span></li>
                                  <li>{switchState ? "Причина возврата" : "Returned because:"} <span className="text-white font-bold ml-2">{lastTask.comment ? lastTask.comment : "Unknown"}</span></li>
                                </>
                              ):(<li className="text-green-500 font-semibold">New printer</li> )}
                            </>
                          );
                        })()}
                    
                  </ul>
                </div>
                {/* Data from states */}
                <ul className="">
                  <li className="font-normal">Condition: <span className="text-green-500 font-md">{overallCondition}</span></li>
                  <li className="font-normal">Cleanliness: <span className="text-green-500 font-md">{cleanliness}</span></li>
                  <li className="font-normal">Workable: <span className="text-green-500 font-md">{workable}</span></li>
                  <li className="font-normal">Parts changed: <span className="text-green-500 font-md flex flex-wrap">{changedParts.map(part=>(`${part}, `))}</span></li>
                  <li className="font-normal">Tested: <span className="text-green-500 font-md">{testedFunctions.map(part=>(`${part}, `))}</span></li>
                  <li className="font-normal">Total page count: <span className="text-green-500 font-md">{pagesNumber}</span></li>
                  <li className="font-normal">After refarbish: <span className="text-green-500 font-md">{afterRefurbish}</span></li>
                  <li className="font-normal">Additional info: <span className="text-green-500 font-md">{additionalInfo}</span></li>
                </ul>
              </div>
          </div>
          )}
      </div>

      {/* ================ SELECT USER ================ */}
      <SelectUser users={users} setUser={setUser} />

      {/* ================ FIND PRINTER ================ */}
      <div className="py-2 mb-2">
        <FindPrinter label={switchState ? "Введите баркод принтера:" : "Search for a printer by barcode:" } printer={setPrinterData} reset={resetForms} />
      </div>
      
      {/* ================ CONDITIONS ================ */}
      <div className="border-b border-t border-slate-400 py-2">
        <OptionSelector
          label={switchState ? "Общее состояние:" : "Overall Condition" }
          options={["Good", "Damaged", "Bad (not fixable)"]}
          onSelect={setOverallCondition}
          reset={resetForms}
          // onResetComplete={resetAllStates}
        />

        <OptionSelector
          label={switchState ? "Состояние чистота:" : "Cleanliness" }
          options={["Clean", "Dirty", "Very Dirty"]}
          onSelect={setCleanliness}
          reset={resetForms}
          // onResetComplete={resetAllStates}
        />

        <OptionSelector
          label={switchState ? "Принтер включается?" : "Workable" }
          options={["Workable", "Not Repairable"]}
          onSelect={setWorkable}
          reset={resetForms}
          // onResetComplete={resetAllStates}
        />

      </div>

      {/* ================ PARTS AND TESTED FUNCTIONS ================ */}
      {
      workable === "Not Repairable" && printerData && printerData._id ? (
        <>
         {/* DISASSAMBLE PART */}
          <AddPartFromPrinter printerId={printerData._id} printerProductNumber={printerData.productNumber} />
         
          <div className="border-b border-slate-400 mb-2 py-2">
            <OptionSelector
                label={switchState ? "После ремонта:" : "After Refurbish"  }
                options={["Workable", "Disassembled"]}
                onSelect={setAfterRefurbish}
                reset={resetForms}
                // onResetComplete={resetAllStates}
              />

              <AdditionalInfoText
                label={switchState ? "Дополнительная информация:" : "Additional Information"  }
                onInput={setAdditionalInfo}
                reset={resetForms}
                // onResetComplete={resetAllStates}
              />

          </div>
        </>
      ) : (
        <>
          {/* ================ PARTS CHANGED ================ */}
          {
            printerData && printerData._id ? (
              <div className="border-b border-slate-400 py-2 mt-2">
                <PartsChangedNew
                  label={switchState ? "Замененные запчасти:" : "Parts changed:" }
                  onSelect={setChangedParts}
                  reset={resetForms}
                />
                {/* <PartsChanged 
                  printerId={printerData._id} 
                  printerProductNumber={printerData.productNumber}
                  label={switchState ? "Замененные запчасти:" : "Parts changed:" }
                  onSelect={setChangedParts}
                  reset={resetForms}
                  // onResetComplete={resetAllStates}
                /> */}

              </div>

            ) : null
          }
          {/* ================ TESTED ================ */}
          <div className="border-b border-slate-400 py-2 mt-2">
            <PartsTested
              label={switchState ? "Протестировано / заменено:" : "Tested / replaced:" }
              onSelect={setTestedFunctions}
              reset={resetForms}
              // onResetComplete={resetAllStates}
            />
          </div>

          {/* ================ PAGES PRINTED & ADDITIONAL INFO ================ */}
          <div className="border-b border-slate-400 py-2 my-4">
            <TotalPageCount
              label={switchState ? "Страниц напечатано:" : "Total page count:"  }
              pages={setPagesNumber}
              reset={resetForms}
              // onResetComplete={resetAllStates}
            />

            <OptionSelector
              label={switchState ? "После ремонта:" : "After Refurbish"  }
              options={["Workable", "Disassembled"]}
              onSelect={setAfterRefurbish}
              reset={resetForms}
              // onResetComplete={resetAllStates}
            />

            <AdditionalInfoText
              label={switchState ? "Дополнительная информация:" : "Additional Information"  }
              onInput={setAdditionalInfo}
              reset={resetForms}
              // onResetComplete={resetAllStates}
            />
          </div>
        </>
        )
      }
      

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}




      {/* ================ SUBMIT BUTTON ================ */}
      <button onClick={handleFormSubmit} className="mt-4 bg-primary-500 text-white px-4 py-2 rounded">
      {switchState ? "Отправить форму:" : "Submit Form!"  }
      </button>
    </div>
  );
};

export default TechWorkForm;