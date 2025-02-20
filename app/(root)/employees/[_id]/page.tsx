import Title from '@/components/shared/Title'
import React from 'react'
import Link from 'next/link'
import {auth} from "@clerk/nextjs"
import { getEmployeesByDate, getEmployeesById, getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from '@/components/shared/VisitorNotification'
import { formatTime } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import ChangeUserName from '@/components/shared/user/ChangeUserName'
import { EmployeesFilters } from "@/components/printers/EmployeesFilter";
import { SearchParamsProps } from "@/types";

// const page = async ({ params, searchParams }: { params: { _id: string }; searchParams: SearchParamsProps }) => {
  const page = async ({ params, searchParams }: { params: { _id: string }; searchParams: { date?: string } }) => {
    const { userId } = auth();
    if (!userId) redirect('/sign-in');
  
    // Проверяем наличие даты или устанавливаем текущую дату
    const selectedDate = searchParams?.date
      ? new Date(searchParams.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
  
    const mongoUserData = await getUserById({ userId });
    const mongoUser = JSON.parse(JSON.stringify(mongoUserData));
  
    if (mongoUser.department === "visitor") {
      return <VisitorNotification />;
    }
  
    const { _id } = params;
  
    // Получаем данные сотрудников с фильтрацией по дате
    const user:any = await getEmployeesById({ _id, date: selectedDate });
    const users = JSON.parse(JSON.stringify(user));
  
    // Функция форматирования времени
    function formatTimeSpent(seconds: number): string {
      if (seconds >= 3600) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h. ${minutes}m.`;
      } else if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m. ${remainingSeconds}s.`;
      } else {
        return `${seconds} sec.`;
      }
    }

    // NEW LOGIC
    function filterPrintersByDate(printers: any[], selectedDate: string) {
      const formattedSelectedDate = new Date(selectedDate).toISOString().split("T")[0];
    
      return printers.filter((printer: any) => {
        const printerDate = new Date(printer.date).toISOString().split("T")[0];
        return printerDate === formattedSelectedDate;
      });
    }

    const filteredPrinters = filterPrintersByDate(users.printers, selectedDate);

    let ref = 0; 
    let dis = 0;

    filteredPrinters.map((printer:any) => {
      if(printer.printerId?.status.toString() === 'Refurbished') {
        ref++;
      } else {
        dis++;
      }
    })

    // END OF NEW LOGIC
  
    if (user) {
      return (
        <>
          <Title text={`User - ${users.name ? users.name : _id}`} />
  
          <div className="flex flex-col gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4 lg:flex-row">
            {/* // Tasks */}
            <div className="flex flex-col w-full lg:w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
  
              <div className="!text-white !text-xl font-semibold mb-2 pb-4 border-b border-slate-400">
                {users.name}
              </div>
              <div className="flex flex-row gap-4 w-full bg-dark-300 rounded-xl border border-dark-350 px-6 py-4 mt-6">
                <div className='flex w-1/2 flex-col'>
                  <div className="w-full text-white font-semibold text-lg mt-2">Printers of fall time</div>
                  <div className="text-4xl text-white font-semibold mt-8 mb-4 flex justify-between">
                    <div>
                      {users.printers.length} <span className="text-base font-normal">printers</span>
                    </div>
                    <div>
                    {filteredPrinters.length} <span className="text-base font-normal">today</span>
                    </div>
                  </div>

                </div>

                <div className='w-1/2 flex flex-col'>
                  <div className="w-full text-white font-semibold text-lg mt-2">Printers today ({filteredPrinters.length})</div>
                  <div className="text-4xl text-white font-semibold mt-8 mb-4 flex justify-between">
                    <div>
                    {ref} <span className='text-sm'>refurbished</span>
                    </div>
                    <div>
                    {dis} <span className="text-base font-normal">disassembled</span>
                    </div>
                  </div>

                </div>

              </div>

            {/* 
            * ================================
            * ================================
            */}
                <div className="mt-6">
                  <EmployeesFilters />
                </div>
                <ul className="mt-6 flex flex-row flex-shrink-0 flex-wrap gap-2">
                {filteredPrinters.map((printer: any) => (
                  <li key={printer._id} className="text-slate-300 bg-dark-600 even:transparent mb-2 p-4 rounded-lg max-w-1/2">
                    <Link href={`/printers/${printer.printerId._id}`}>
                    <div className="flex flex-row justify-between mb-2">
                      <div>Printer: </div>
                      <span className="ml-2 font-semibold text-white">{printer.printerId?.name || 'Unknown'}</span> {/* Отображаем имя принтера */}
                    </div>

                    <div className="flex flex-row justify-between items-center mb-2">
                      <div>Status: </div>
                      <span className={`text-md p-2 rounded-lg font-semibold ml-2 ${printer.printerId?.status.toString() === 'Refurbished' ? 'bg-green-500' : 'bg-red-500'}`}>{printer.printerId?.status || 'N/A'}</span> {/* Отображаем barcode */}
                    </div>
                    <div className="flex flex-row justify-between mb-2">
                      <div>Time spent: </div>
                      <span className="ml-2 font-semibold">{formatTimeSpent(printer.timeSpent)}</span> {/* Отображаем время работы */}
                    </div>
                    <div className="flex flex-row justify-between mb-2">
                      <div>Work performed: </div>
                      <span className="ml-2 font-semibold text-white">{formatTime(printer.date, "date")}</span> {/* Отображаем дату */}
                    </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
  
            <div className="flex flex-col h-auto w-full lg:w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
              <div>
                <h2 className="text-xl font-bold text-white">User data:</h2>
                <ul className="">
                  <li className="text-white mt-4">{users.name}</li>
                  <li className="text-white mt-2">{users.lastName}</li>
                </ul>
              </div>
              <ChangeUserName _id={_id} />
            </div>
          </div>
        </>
      );
    }
  
    return null;
  };
  
  export default page;

