"use client"

import React, {useState, useEffect, useRef} from 'react';
import AddColumnForm from '@/components/shared/AddColumnForm';
import { findPrinter } from '@/lib/actions/printer.action';
import PrinterSearch from '@/components/shared/search/PrinterSearch';
import TechFormUsers from '@/components/shared/forms/TechFormUsers';
import { getUsers } from '@/lib/actions/user.action';
import SelectTech from '@/components/shared/forms/SelectTech';
import FindPrinter from "@/components/shared/forms/FindPrinter";
import SelectOption from './forms/SelectOptions';
import ChangedParts from './forms/ChangedParts';
import PagesNumber from './forms/PagesNumber';
import Tested from './forms/Tested';
import {updatePrinterWithCheck} from '@/lib/actions/printer.action';

interface Props {
  users: any;
}

interface User {
  id: string;
  name: string;
}

const TechFormsComponent = ({users}: Props) => {
  const usersData = JSON.parse(users);

  // USER
  const [selectedUser, setSelectedUser] = useState<User>({ id: "", name: "Select Tech's name" });

  // PRINTER
  const [printerID, setPrinterID] = useState({_id: '', barcode: '', name:'', sn: '', productNumber:'', preview: ''}); 
  
  // TIMER
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
  // PRINTER's CONDITION
  const [overallCondition, setOverallCondition] = useState<string | null>(null);
  const [cleanliness, setCleanliness] = useState<string | null>(null);
  const [workable, setWorkable] = useState<string | null>(null);
  const [pagesNumber, setPagesNumber] = useState<number | null>(null);
  const [tested, setTested] = useState<string[]>([]);
  const [afterRefurbish, setAfterRefurbish] = useState<string | null>(null);
  const [changedParts, setChangedParts] = useState<string[]>([]);

  const [formReset, setFormReset] = useState(false);

  // Функция, которая будет сбрасывать formReset обратно в false
  const handleResetComplete = () => {
    setFormReset(false);
  };
  

  // Запуск таймера
  const startTimer = () => {
    setTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prevTime => prevTime + 1);
    }, 1000);
  };

  // Остановка таймера
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimerActive(false);
      return timeElapsed / 60; // Return time in minutes
    }
  };

  // Сброс таймера
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
    setTimeElapsed(0);
  };


  useEffect(() => {
    // Если принтер найден, запускать таймер
    if (printerID._id) {
      startTimer();
    }
  }, [printerID]);

  useEffect(() => {
    // Fetch users from the database
    async function fetchUsers() {
      const usersData = await getUsers({});
      // const usersList = JSON.parse(JSON.stringify(usersData));
      // setUsers(usersList);
    }
    fetchUsers();
  }, []);

  const handleUserChange = () => {
    console.log("SOMETHING")
  //   setSelectedUser(e.target.value);
  };

  const handleSubmit = async () => {
    const timeSpent = stopTimer(); // Stop timer and get the time spent in minutes
    console.log(`Time spent: ${timeElapsed} minutes`);

    const data = {
        printerId: printerID._id,
        selectedUser,
        overallCondition,
        cleanliness,
        workable,
        changedParts,
        afterRefurbish,
        pagesNumber,
        tested,
        timeSpent: timeElapsed,
        path: window.location.pathname, // или другой путь, который нужно обновить
    };

    try {
        const response = await updatePrinterWithCheck(data);
        if (response.success) {
            console.log(response.message);
        } else {
            console.error(response.message);
        }
    } catch (error) {
        console.error("Error updating printer:", error);
    }

    setFormReset(true);
    resetTimer(); // Сброс таймера после отправки формы
};


  return (
    <div className="bg-secondary-200 px-6 mb-1 py-6 w-1/2 rounded-xl border border-dark-350 shadow-lg">
      <div className="text-white font-bold px-1 mb-3 flex justify-between border-b-2 border-slate-400 pb-4">
        <div>{selectedUser.name ? (selectedUser.name) : ("User not selected!")}</div>
        <div>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</div> {/* Отображение времени в формате MM:SS */}
      </div>

      <div className=''>
        <SelectTech users={usersData} setSelectedUser={setSelectedUser} />
      </div>

      <div className=''>
        <FindPrinter setPrinterID={setPrinterID}/>
      </div>

      <SelectOption label="Overall Condition" options={["Good", "Bad", "Broken"]} onSelect={setOverallCondition} reset={formReset} onResetComplete={handleResetComplete} />
      <SelectOption label="Cleanliness" options={["Clean", "Dirty", "Very Dirty"]} onSelect={setCleanliness} reset={formReset} onResetComplete={handleResetComplete} />
      <SelectOption label="Workable" options={["Workable", "Need Repair", "Not Repairable"]} onSelect={setWorkable} reset={formReset} onResetComplete={handleResetComplete} />
      <ChangedParts 
        onSelect={setChangedParts} 
        reset={formReset} 
        onResetComplete={handleResetComplete} 
      />
      <PagesNumber 
        onInput={setPagesNumber} 
        reset={formReset} 
        onResetComplete={handleResetComplete} 
      />
      <Tested 
        onSelect={setTested} 
        reset={formReset} 
        onResetComplete={handleResetComplete} 
      />
      <SelectOption label="After Refurbish" options={["Workable", "Refurbished", "Broken on process"]} onSelect={setAfterRefurbish} reset={formReset} onResetComplete={handleResetComplete} />


      <button onClick={handleSubmit} className="w-1/2  bg-primary-500 text-white p-4 rounded font-bold">
        Submit
      </button>
    </div>
  )
}

export default TechFormsComponent;
