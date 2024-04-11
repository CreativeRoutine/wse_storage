import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (createdOn: Date, look: string) => {



  // Создание объекта Date
  const date = new Date(createdOn);
  
  // Форматирование даты
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() возвращает 0-11
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  if(look === 'full'){
    // Full date
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
    return formattedDate
  }
  if(look === 'date'){
    // Date only without time
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
  }
  if(look === 'time'){
    // Time only without date
    const formattedDate = `${hours}:${minutes}`;
    return formattedDate
  }
  
  }