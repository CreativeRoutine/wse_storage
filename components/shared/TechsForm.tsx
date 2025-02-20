// "use client";

// import React, { useState } from "react";
// import StuffForm from "./forms/StuffForm";
// import Timer from "./forms/Timer";
// import FindPrinterComponent from "./forms/FindPrinterComponent";
// import OptionSelector from "./forms/OptionSelect";
// import TestedFunctions from "./forms/TestedFunctions";
// import TextInputComponent from "./forms/TextInputComponent";
// import PagesNumberComponent from "./forms/PagesNumberComponent";
// import ChangedPartsComponent from "./forms/ChangedPartsComponent";
// import AddPartFromPrinter from "./parts/AddPartFromPrinter";
// import { useToast } from "@/components/ui/use-toast";
// import { createParts } from '@/lib/actions/parts.action';


// import { useTimer } from "@/components/shared/hooks/useTimer";
// import moment from 'moment-timezone';
// import { updatePrinterWithCheck } from "@/lib/actions/printer.action";

// interface Props {
//   users: any;
//   partsList: any;
// }

// const TechsForm = ({ users, partsList }: Props) => {
//   const { toast } = useToast();

//   const { timeElapsed, startTimer, stopTimer, resetTimer } = useTimer(); 
//   const [user, setUser] = useState({ id: "", name: "User not selected!" });
//   const [printerFound, setPrinterFound] = useState(false);
//   const [resetFormTimer, setResetFormTimer] = useState(false); 
//   const [printerDetails, setPrinterDetails] = useState<any | null>(null);
//   const [formReset, setFormReset] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [overallCondition, setOverallCondition] = useState<string | null>(null);
//   const [cleanliness, setCleanliness] = useState<string | null>(null);
//   const [workable, setWorkable] = useState<string | null>(null);
//   const [afterRefurbish, setAfterRefurbish] = useState<string | null>(null);
//   const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
//   const [pagesNumber, setPagesNumber] = useState<number | null>(null);
//   const [changedParts, setChangedParts] = useState<string[]>([]);
//   const [testedFunctions, setTestedFunctions] = useState<string[]>([]);


//   // Функция для сброса всех состояний
//   // const resetAllStates = () => {
//   //   setPrinterFound(false);
//   //   setResetFormTimer(false); // Сбросите только один раз
//   //   setFormReset(false);
//   //   setPrinterDetails(null);
//   //   setOverallCondition(null);
//   //   setCleanliness(null);
//   //   setWorkable(null);
//   //   setAfterRefurbish(null);
//   //   setAdditionalInfo(null);
//   //   setPagesNumber(null);
//   //   setErrorMessage(null);
//   //   setChangedParts([]);
//   //   setTestedFunctions([]);
//   // };
//   const resetAllStates = () => {
//     setFormReset(true); // Ставим в true для инициации сброса
//     setTimeout(() => {
//       setFormReset(false); // Через короткое время сбрасываем обратно
//     }, 50); // Задержка 50 мс
//     setPrinterFound(false);
//     setResetFormTimer(false);
//     setPrinterDetails(null);
//     setOverallCondition(null);
//     setCleanliness(null);
//     setWorkable(null);
//     setAfterRefurbish(null);
//     setAdditionalInfo(null);
//     setPagesNumber(null);
//     setErrorMessage(null);
//     setChangedParts([]);
//     setTestedFunctions([]);
//   };

//   const handlePrinterSearch = (printer: any) => {
//     if (printer) {
//       setPrinterFound(true); // Включаем таймер
//       setPrinterDetails(printer);
//       setResetFormTimer(false);
//       startTimer(); // Запускаем таймер
//     } else {
//       setPrinterFound(false);
//       setPrinterDetails(null);
//       resetTimer(); // Сбрасываем таймер
//     }
//   };

 

//   const handleFormSubmit = async () => {
//     setErrorMessage(null); // Очищаем ошибки перед началом проверки
  
//     // Проверка обязательных полей
//     const requiredFields = [overallCondition, cleanliness, workable, afterRefurbish];
//     if (requiredFields.some((field) => !field)) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }
//     if (!user.id) {
//       setErrorMessage("Please select a user.");
//       return;
//     }
//     if (!printerDetails) {
//       setErrorMessage("Please search and select a printer.");
//       return;
//     }
//     const createFormData = () => {
//       const createdOn = moment().tz("America/Chicago").toDate();
//       createdOn.setHours(createdOn.getHours());
    
//       return {
//         date: createdOn,
//         printerId: printerDetails?._id,
//         selectedUser: user,
//         overallCondition,
//         cleanliness,
//         workable,
//         changedParts,
//         afterRefurbish,
//         pagesNumber,
//         tested:testedFunctions,
//         additionalInfo,
//         timeSpent: timeElapsed,
//         status: "In progress",
//         path: window.location.pathname,
//       };
//     };
//     const data = createFormData(); // Создаем данные формы
  
//     try {
//       const printerResponse = await updatePrinterWithCheck(data);
//       if (!printerResponse.success) {
//         toast({ title: "Error", description: printerResponse.message, variant: "custom" });
//         return;
//       }
      
      
//       // Отправка частей, если они есть
//       if (partsList.length > 0) {
//         const partsResponse = await createParts(printerDetails._id, partsList);
//         if (!partsResponse.success) {
//           toast({ title: "Error", description: partsResponse.message, variant: "custom" });
//           return;
//         }
//       }
  
//       toast({ title: "Form submitted successfully!", variant: "default" });
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast({
//         title: "Submission failed",
//         description: "An error occurred while submitting the form.",
//         variant: "destructive",
//       });
//     }

//     resetAllStates();
//     console.log("Overall Condition:", overallCondition);
//     console.log("Cleanliness:", cleanliness);
//     console.log("Workable:", workable);
//     console.log("Changed Parts:", changedParts);
//     console.log("Tested Functions:", testedFunctions);
//      // Сбрасываем все состояния
//   };
  

//   return (
//     <div className="bg-secondary-200 px-6 mb-1 py-6 w-full rounded-xl border border-dark-350 shadow-lg">
//       {/* ================ USER INFO & TIMER ================ */}
//       <div className="text-white font-bold px-1 mb-3 flex flex-row justify-between border-b-2 border-slate-400 pb-4 w-full">
//         <div className="flex flex-row justify-between items-center w-full">
//           {user && user.name ? user.name : "Select User's name"}
//           <Timer start={printerFound} reset={resetFormTimer} />
//         </div>
//       </div>

//       {/* ================ SELECT USER ================ */}
//       {/* <StuffForm users={normalizedUsers} setUser={setUser} /> */}
//       <StuffForm users={users} setUser={setUser} />

//       {/* ================ FIND PRINTER ================ */}
//       <div className="mt-2">
//         <FindPrinterComponent label="Search for a printer by barcode:" setPrinterID={handlePrinterSearch} />
//       </div>

//       {printerDetails && (
//         <div className="my-4">
//           <div className="font-bold text-lg text-white mb-2">Printer Details:</div>
//           <ul className="space-y-4 text-slate-400">
//             <li>
//               Make:{" "}
//               <span className="text-white bg-gradient-to-r from-indigo-500 to-indigo-400 py-2 px-3 rounded-lg ml-2">
//                 {printerDetails.name}
//               </span>
//             </li>
//             <li>
//               Works performed before:{" "}
//               <span className="text-white bg-gradient-to-r from-indigo-500 to-indigo-400 py-2 px-3 rounded-lg ml-2">
//                 {printerDetails.tasksPerformed.length}
//               </span>
//             </li>
//             <li>
//               Product Number:{" "}
//               <span className="text-white bg-gradient-to-r from-indigo-500 to-indigo-400 py-2 px-3 rounded-lg ml-2">
//                 {printerDetails.productNumber}
//               </span>
//             </li>
//           </ul>
//         </div>
//       )}

//       {/* ================ FORM FIELDS ================ */}
//       <div className="border-b border-t border-slate-400 my-4">
//         <OptionSelector
//           label="Overall Condition"
//           options={["Good", "Damaged", "Bad (not fixable)"]}
//           onSelect={setOverallCondition}
//           reset={formReset}
//           onResetComplete={resetAllStates}
//         />
//         <OptionSelector
//           label="Cleanliness"
//           options={["Clean", "Dirty", "Very Dirty"]}
//           onSelect={setCleanliness}
//           reset={formReset}
//           onResetComplete={resetAllStates}
//         />
//         <OptionSelector
//           label="Workable"
//           options={["Workable", "Not Repairable"]}
//           onSelect={setWorkable}
//           reset={formReset}
//           onResetComplete={resetAllStates}
//         />
//       </div>

//       {/* ================ PARTS AND TESTED FUNCTIONS ================ */}
//       {workable === "Not Repairable" && printerDetails?.productNumber && (
//         <AddPartFromPrinter printerId={printerDetails._id} printerProductNumber={printerDetails.productNumber} />
//       )}

//       <div className="border-b border-slate-400 my-4">
//         <ChangedPartsComponent
//           label="Parts changed:"
//           onSelect={setChangedParts}
//           reset={formReset}
//           onResetComplete={resetAllStates}
//         />
//       </div>
//       <div className="border-b border-slate-400 my-4">
//         <TestedFunctions
//           label="Tested and performed:"
//           onSelect={setTestedFunctions}
//           reset={formReset}
//           onResetComplete={resetAllStates}
//         />
      
//       </div>  

//       {/* ================ PAGES PRINTED & ADDITIONAL INFO ================ */}
//       <PagesNumberComponent
//         onInput={setPagesNumber}
//         reset={formReset}
//         onResetComplete={resetAllStates}
//         label="Pages printed"
//         placeholder="0"
//       />
//       <OptionSelector
//         label="After Refurbish"
//         options={["Workable", "Disassembled"]}
//         onSelect={setAfterRefurbish}
//         reset={formReset}
//         onResetComplete={resetAllStates}
//       />
//       <TextInputComponent
//         onInput={setAdditionalInfo}
//         reset={formReset}
//         onResetComplete={resetAllStates}
//         label="Additional Information"
//         placeholder="Enter something here..."
//       />
      
//       {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

//       {/* ================ SUBMIT BUTTON ================ */}
//       <button onClick={handleFormSubmit} className="bg-primary-500 text-white px-4 py-2 rounded">
//         Submit Form
//       </button>
//     </div>
//   );
// };

// export default TechsForm;

"use client";

import React, { useState } from "react";
import StuffForm from "./forms/StuffForm";
import Timer from "./forms/Timer";
import FindPrinterComponent from "./forms/FindPrinterComponent";
import OptionSelector from "./forms/OptionSelect";
import TestedFunctions from "./forms/TestedFunctions";
import TextInputComponent from "./forms/TextInputComponent";
import PagesNumberComponent from "./forms/PagesNumberComponent";
import ChangedPartsComponent from "./forms/ChangedPartsComponent";
import AddPartFromPrinter from "./parts/AddPartFromPrinter";
import { useToast } from "@/components/ui/use-toast";
import { createParts } from "@/lib/actions/parts.action";
import { useTimer } from "@/components/shared/hooks/useTimer";
import moment from "moment-timezone";
import { updatePrinterWithCheck } from "@/lib/actions/printer.action";

interface Props {
  users: any;
  partsList: any;
}

const TechsForm = ({ users, partsList }: Props) => {
  const { toast } = useToast();
  const { timeElapsed, startTimer, stopTimer, resetTimer } = useTimer();

  const [user, setUser] = useState({ id: "", name: "User not selected!" });
  const [printerFound, setPrinterFound] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [printerDetails, setPrinterDetails] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [overallCondition, setOverallCondition] = useState<string | null>(null);
  const [cleanliness, setCleanliness] = useState<string | null>(null);
  const [workable, setWorkable] = useState<string | null>(null);
  const [afterRefurbish, setAfterRefurbish] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
  const [pagesNumber, setPagesNumber] = useState<number | null>(null);
  const [changedParts, setChangedParts] = useState<string[]>([]);
  const [testedFunctions, setTestedFunctions] = useState<string[]>([]);

  // Функция для сброса всех состояний формы
  const resetAllStates = () => {
    setResetForm(true); // Устанавливаем флаг сброса для дочерних компонентов
    setTimeout(() => setResetForm(false), 100); // Сбрасываем флаг через небольшую задержку

    setUser({ id: "", name: "User not selected!" });
    setPrinterFound(false);
    setPrinterDetails(null);
    setOverallCondition(null);
    setCleanliness(null);
    setWorkable(null);
    setAfterRefurbish(null);
    setAdditionalInfo(null);
    setPagesNumber(null);
    setErrorMessage(null);
    setChangedParts([]);
    setTestedFunctions([]);
    resetTimer(); // Сбрасываем таймер
  };

  const handlePrinterSearch = (printer: any) => {
    if (printer) {
      setPrinterFound(true);
      setPrinterDetails(printer);
      startTimer();
    } else {
      setPrinterFound(false);
      setPrinterDetails(null);
      resetTimer();
    }
  };

  const handleFormSubmit = async () => {
    setErrorMessage(null);

    const requiredFields = [overallCondition, cleanliness, workable, afterRefurbish];
    if (requiredFields.some((field) => !field)) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (!user.id) {
      setErrorMessage("Please select a user.");
      return;
    }
    if (!printerDetails) {
      setErrorMessage("Please search and select a printer.");
      return;
    }

    const data = {
      date: moment().tz("America/Chicago").toDate(),
      printerId: printerDetails?._id,
      selectedUser: user,
      overallCondition,
      cleanliness,
      workable,
      changedParts,
      afterRefurbish,
      pagesNumber,
      tested: testedFunctions,
      additionalInfo,
      timeSpent: timeElapsed,
      status: afterRefurbish === "Workable" ? "Refurbished" : "Disassembled",
      path: window.location.pathname,
    };

    try {
      const printerResponse = await updatePrinterWithCheck(data);
      if (!printerResponse.success) {
        toast({ title: "Error", description: printerResponse.message, variant: "custom" });
        return;
      }

      if (partsList.length > 0) {
        const partsResponse = await createParts(printerDetails._id, partsList);
        if (!partsResponse.success) {
          toast({ title: "Error", description: partsResponse.message, variant: "custom" });
          return;
        }
      }

      toast({ title: "Form submitted successfully!", variant: "default" });
      resetAllStates(); // Сбрасываем состояние после успешной отправки
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: "An error occurred while submitting the form.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-secondary-200 px-6 mb-1 py-6 w-full rounded-xl border border-dark-350 shadow-lg">
      {/* ================ USER INFO & TIMER ================ */}
      <div className="text-white font-bold px-1 mb-3 flex flex-row justify-between border-b-2 border-slate-400 pb-4 w-full">
        <div className="flex flex-row justify-between items-center w-full">
          {user?.name || "Select User's name"}
          <Timer start={printerFound} reset={resetForm} />
        </div>
      </div>

      {/* ================ SELECT USER ================ */}
      <StuffForm users={users} setUser={setUser} />

      {/* ================ FIND PRINTER ================ */}
      <div className="mt-2">
        <FindPrinterComponent label="Search for a printer by barcode:" setPrinterID={handlePrinterSearch} />
      </div>

      {printerDetails && (
        <div className="my-4">
          <div className="font-bold text-lg text-white mb-2">Printer Details:</div>
          <ul className="space-y-4 text-slate-400">
            <li>
              Make: <span className="text-white">{printerDetails.name}</span>
            </li>
            <li>
              Works performed before: <span className="text-white">{printerDetails.tasksPerformed.length}</span>
            </li>
            <li>
              Product Number: <span className="text-white">{printerDetails.productNumber}</span>
            </li>
          </ul>
        </div>
      )}

       {/* ================ FORM FIELDS ================ */}
      <div className="border-b border-t border-slate-400 my-4">
        <OptionSelector
          label="Overall Condition"
          options={["Good", "Damaged", "Bad"]}
          onSelect={setOverallCondition}
          reset={resetForm}
        />
        <OptionSelector
          label="Cleanliness"
          options={["Clean", "Dirty", "Very Dirty"]}
          onSelect={setCleanliness}
          reset={resetForm}
        />
        <OptionSelector
          label="Workable"
          options={["Workable", "Not Repairable"]}
          onSelect={setWorkable}
          reset={resetForm}
        />
      </div>

      {/* ================ PARTS AND TESTED FUNCTIONS ================ */}
       {workable === "Not Repairable" && printerDetails?.productNumber && (
        <AddPartFromPrinter printerId={printerDetails._id} printerProductNumber={printerDetails.productNumber} />
      )}

      <div className="border-b border-slate-400 my-4">
        <ChangedPartsComponent label="Changed Parts" onSelect={setChangedParts} reset={resetForm} />
      </div>

      <div className="border-b border-slate-400 my-4">
        <TestedFunctions label="Tested Functions" onSelect={setTestedFunctions} reset={resetForm} />
      </div>

      {/* ================ PAGES PRINTED & ADDITIONAL INFO ================ */}
      <PagesNumberComponent onInput={setPagesNumber} reset={resetForm} />

      <OptionSelector
        label="After Refurbish"
        options={["Workable", "Disassembled"]}
        onSelect={setAfterRefurbish}
        reset={resetForm}
        
      />
      <TextInputComponent onInput={setAdditionalInfo} reset={resetForm} />

      {/* ================ SUBMIT BUTTON ================ */}
      <button onClick={handleFormSubmit} className="bg-primary-500 text-white px-4 py-2 rounded">
        Submit Form
      </button>

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default TechsForm;