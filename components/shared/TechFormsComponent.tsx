"use client";

import React, { useState, useEffect } from 'react';
import SelectTech from '@/components/shared/forms/SelectTech';
import FindPrinter from "@/components/shared/forms/FindPrinter";
import SelectOption from './forms/SelectOptions';
import ChangedParts from './forms/ChangedParts';
import PagesNumber from './forms/PagesNumber';
import Tested from './forms/Tested';
import { updatePrinterWithCheck } from '@/lib/actions/printer.action';
import moment from 'moment-timezone';
import TextInput from './forms/TextInput';
import Parts from './forms/Parts';
import { useToast } from "@/components/ui/use-toast";
import { createParts } from '@/lib/actions/parts.action';
import { useTimer } from '../shared/hooks/useTimer';
import { getUsers } from '@/lib/actions/user.action';

interface Props {
  users: any;
}

interface User {
  id: string;
  name: string;
}

const TechFormsComponent = ({ users }: Props) => {
  const usersData = JSON.parse(users);
  const { toast } = useToast();

  // USER
  const [selectedUser, setSelectedUser] = useState<User>({ id: "", name: "Select Tech's name" });

  // PRINTER
  const [printerID, setPrinterID] = useState({
    _id: '',
    barcode: '',
    name: '',
    sn: '',
    productNumber: '',
    preview: '',
  });

  // PARTS ARRAY
  const [partsList, setPartsList] = useState<{ barcode: string; name: string; location: string; quantity: number }[]>([]);

  // PRINTER's CONDITION
  const [overallCondition, setOverallCondition] = useState<string | null>(null);
  const [cleanliness, setCleanliness] = useState<string | null>(null);
  const [workable, setWorkable] = useState<string | null>(null);

  const [pagesNumber, setPagesNumber] = useState<number | null>(null);
  const [tested, setTested] = useState<string[]>([]);
  const [changedParts, setChangedParts] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const [formReset, setFormReset] = useState(false);

  const [afterRefurbish, setAfterRefurbish] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('In progress');
  const [condition, setCondition] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timer hook
  const { timeElapsed, startTimer, stopTimer, resetTimer, togglePauseResume, timerActive } = useTimer();

  // Сброс formReset обратно в false
  const handleResetComplete = () => {
    setFormReset(false);
  };

  // Сброс сообщения об ошибке при изменении полей
  const clearError = () => {
    setErrorMessage(null);
  };

  // Condition change based on Overall Condition or Workable
  useEffect(() => {
    if (overallCondition === 'Bad (not fixable)' || workable === 'Not Repairable') {
      setCondition('Bad (not fixable)');
    } else {
      setCondition(''); // Устанавливаем только если оба поля не содержат нужных значений
    }
  }, [overallCondition, workable]);

  // Логика изменения состояния после обновления "After Refurbish"
  useEffect(() => {
    if (afterRefurbish === 'Refurbished (workable)') {
      setStatus('Refurbished');
    } else if (afterRefurbish === 'Disassembled') {
      setStatus('Disassembled');
    }
  }, [afterRefurbish]);

  useEffect(() => {
    if (printerID._id) {
      startTimer();
    }
  }, [printerID]);

  useEffect(() => {
    async function fetchUsers() {
      const fetchedUsers = await getUsers({});
    }
    fetchUsers();
  }, []);

  // Проверка валидации формы
  const validateForm = () => {
    if (!selectedUser || !selectedUser.id) {
      setErrorMessage('Please select a technician.');
      return false;
    }
    if (!printerID._id) {
      setErrorMessage('Please select a printer.');
      return false;
    }
    if (!overallCondition && !workable) {
      setErrorMessage('Please provide the overall condition or workable state.');
      return false;
    }
    if (condition !== 'Bad (not fixable)' && changedParts.length === 0) {
      setErrorMessage('Please specify the changed parts.');
      return false;
    }
    if (condition !== 'Bad (not fixable)' && tested.length === 0) {
      setErrorMessage('Please specify the tested parts.');
      return false;
    }
    if (condition !== 'Bad (not fixable)' && (!pagesNumber || pagesNumber === 0)) {
      setErrorMessage('Please specify the number of printed pages.');
      return false;
    }
    if (!afterRefurbish) {
      setErrorMessage("Please select 'After Refurbish' status.");
      return false;
    }
    return true;
  };

  // Обработка формы отправки
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const timeSpent = stopTimer();
    const createdOn = moment().tz('America/Chicago').toDate();
    const date = createdOn.setHours(createdOn.getHours());

    const data = {
      date,
      printerId: printerID._id,
      selectedUser,
      overallCondition,
      cleanliness,
      workable,
      changedParts,
      afterRefurbish,
      pagesNumber,
      tested,
      additionalInfo,
      timeSpent: timeElapsed,
      status,
      path: window.location.pathname,
    };

    try {
      const printerResponse = await updatePrinterWithCheck(data);
      if (printerResponse.success) {
        if (partsList.length > 0) {
          const partsResponse = await createParts(printerID._id, partsList);
          if (partsResponse.success) {
            toast({ title: partsResponse.message, variant: 'default' });
          } else {
            toast({ title: 'Error', description: partsResponse.message, variant: 'destructive' });
          }
        }
      } else {
        console.error(printerResponse.message);
      }
    } catch (error) {
      console.error('Error updating printer or adding parts:', error);
    }

    setFormReset(true);
    setCondition('');
    resetTimer();
  };

  return (
    <div className="bg-secondary-200 px-6 mb-1 py-6 w-1/2 rounded-xl border border-dark-350 shadow-lg">
      <div className="text-white font-bold px-1 mb-3 flex justify-between border-b-2 border-slate-400 pb-4">
        <div>{selectedUser.name ? selectedUser.name : 'User not selected!'}</div>

        {/* TIMER */}
        <div className="flex justify-center items-center align-middle">
          {timerActive ? (
            <div className="text-green-500 font-bold">
              {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </div>
          ) : (
            <div className="text-red-500 font-bold">
              {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </div>
          )}
          <button onClick={togglePauseResume} className="ml-3 bg-green-500 text-white px-4 py-2 rounded">
            {timerActive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      <SelectTech users={usersData} setSelectedUser={(user) => { clearError(); setSelectedUser(user); }} />
      <FindPrinter setPrinterID={(printer) => { clearError(); setPrinterID(printer); }} />

      <div className="border-b border-slate-400 pb-1">
        <SelectOption
          label="Overall Condition"
          options={['Good', 'Damaged', 'Bad (not fixable)']}
          onSelect={(value) => { clearError(); setOverallCondition(value); }}
          reset={formReset}
          onResetComplete={handleResetComplete}
        />
        <SelectOption
          label="Cleanliness"
          options={['Clean', 'Dirty', 'Very Dirty']}
          onSelect={(value) => { clearError(); setCleanliness(value); }}
          reset={formReset}
          onResetComplete={handleResetComplete}
        />
        <SelectOption
          label="Workable"
          options={['Workable', 'Not Repairable']}
          onSelect={(value) => { clearError(); setWorkable(value); }}
          reset={formReset}
          onResetComplete={handleResetComplete}
        />
      </div>

      {condition === 'Bad (not fixable)' ? (
        <div className="border-y border-slate-400 pb-1 mb-4">{/* Компонент для Parts здесь */}</div>
      ) : (
        <>
          <ChangedParts onSelect={(value) => { clearError(); setChangedParts(value); }} reset={formReset} onResetComplete={handleResetComplete} />
          <Tested onSelect={(value) => { clearError(); setTested(value); }} reset={formReset} onResetComplete={handleResetComplete} />
          <PagesNumber onInput={(value) => { clearError(); setPagesNumber(value); }} reset={formReset} onResetComplete={handleResetComplete} />
        </>
      )}

      <TextInput onInput={(value) => { clearError(); setAdditionalInfo(value); }} reset={formReset} onResetComplete={handleResetComplete} />

      <SelectOption
        label="After Refurbish"
        options={['Refurbished (workable)', 'Disassembled']}
        onSelect={(value) => { clearError(); setAfterRefurbish(value); }}
        reset={formReset}
        onResetComplete={handleResetComplete}
      />

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <button onClick={handleSubmit} className="w-full mt-4 bg-primary-500 text-white p-4 rounded font-bold">
        Submit
      </button>
    </div>
  );
};

export default TechFormsComponent;
