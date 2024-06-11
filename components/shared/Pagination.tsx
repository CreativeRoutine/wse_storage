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

  const handleNavigation = (direction:string) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const nextPageNumber = direction === 'prev' ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString()
    });

    router.push(newUrl);


  }

  return (
    <div className="mt-8 py-8 px-8 mb-8 bg-dark-600 text-white rounded-xl flex items-center justify-between border border-dark-350 shadow-lg">
      <Button 
        disabled={pageNumber === 1}
        onClick={() => handleNavigation('prev')}
        className='border border-dark-350 bg-dark-600 text-white hover:bg-white hover:text-dark-500'
        >Prev
      </Button>

      <p className='text-white'>{pageNumber}</p>

      <Button 
        disabled={isNext}
        onClick={() => handleNavigation('next')}
        className='border border-dark-350 bg-dark-600 text-white hover:bg-white hover:text-dark-500'
        >Next
      </Button>
    </div>
    
  )
}

export default Pagination;