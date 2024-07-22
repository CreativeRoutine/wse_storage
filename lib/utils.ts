import { type ClassValue, clsx } from "clsx"
import qs from "query-string"
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
    const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}`;
    return formattedDate
  }
  if(look === 'date'){
    // Date only without time
    const formattedDate = `${month}-${day}-${year}`;
    return formattedDate
  }
  if(look === 'time'){
    // Time only without date
    const formattedDate = `${hours}:${minutes}`;
    return formattedDate
  }
  
  }

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value}: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl,
  },
  { skipNull: true})
}

export const formUrlQueryClean = ({ params, key, value }:UrlQueryParams) => {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  if (value === null || value === undefined) {
    searchParams.delete(key);
  } else {
    searchParams.set(key, value);
  }

  return `${url.pathname}?${searchParams.toString()}`;
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}


export const removeKeysFromQuery = ({ params, keysToRemove}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  })

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl,
  },
  { skipNull: true})
}