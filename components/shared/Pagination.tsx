"use client"
import React from 'react'
import {Button} from '@/components/ui/button'
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({pageNumber, isNext}:Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (direction:string) => {

    const nextPageNumber = direction === 'prev' ? pageNumber - 1 : pageNumber + 1;

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

      <p className='text-white bg-primary-500 py-2 px-3 rounded'>{pageNumber}</p>

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