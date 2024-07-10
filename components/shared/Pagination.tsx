"use client"
import React from 'react'
import {Button} from '@/components/ui/button'
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  pageNumber: number;
  isNext: boolean;
  total: number;
}

const Pagination = ({pageNumber, isNext, total}:Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  let rounded = Math.ceil(total);

  const handleNavigation = (direction:string) => {

    const nextPageNumber = direction === 'prev' ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString()
    });

    router.push(newUrl);

  }

  const handleNavigationDouble = (direction:string) => {

    const nextPageNumber = direction === 'prev' ? pageNumber - 2 : pageNumber + 2;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString()
    });

    router.push(newUrl);

  }

  return (
    <div className="mt-8 py-8 px-8 mb-8 bg-dark-600 text-white rounded-xl flex items-center justify-center border border-dark-350 shadow-lg gap-3">
      
      <Button 
        disabled={pageNumber === 1 }
        onClick={() => handleNavigation('prev')}
        className='border border-dark-350 bg-dark-600 text-white hover:bg-white hover:text-dark-500'
        >
          <p className='font-bold'>
            Prev
          </p>
      </Button>
      
      {
        pageNumber - 2 <= 1 ?  (<div className='text-slate-500 '>...</div>)
        : (
          <Button 
            
            onClick={() => handleNavigationDouble('prev')} >
              <div className='text-white py-2 px-3 rounded border border-dark-350 hover:bg-white hover:text-dark-500'>{pageNumber - 2}</div>
            </Button>
        )
      }
      <div className='text-white  py-2 px-1 flex items-center'><div className='py-2 px-3 bg-primary-500 rounded mr-2'>{pageNumber} of {rounded}</div></div>

      {
        pageNumber + 2 >= total ?  <div className='text-slate-500 '>...</div>
        : (
          <Button 
            onClick={() => handleNavigationDouble('next')} >
              <div className='text-white py-2 px-3 rounded border border-dark-350 hover:bg-white hover:text-dark-500'>{pageNumber + 2}</div>
            </Button>
        )
      }

      <Button 
        disabled={!isNext}
        onClick={() => handleNavigation('next')}
        className='border border-dark-350 bg-dark-600 text-white hover:bg-white hover:text-dark-500'
        >Next
      </Button>
    </div>
  )
}

export default Pagination;