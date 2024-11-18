import React from 'react'
import Image from 'next/image'

interface Props {
    text: string;
    link?: string;
    linkText?: string;
}

const Title = ({text, link, linkText}:Props) => {

  if(link && linkText){
    return (
      <div className="py-8 px-8 mb-8 bg-dark-600 text-white rounded-xl flex items-center justify-start border border-dark-350 shadow-lg w-full">
        <a href={link} className="bg-primary-500 py-2 px-4 text-white rounded-xl flex gap-2 group">
          <Image src="/assets/icons/icons/arrow-down.svg" width={20} height={20} alt="back arrow" className='invert rotate-90'></Image>
          {linkText}
          </a>
        <h1 className="text-2xl font-semibold ml-3">{text}</h1>
      </div>
    )
  }

  return (
    <div className="py-8 px-8 mb-8 bg-dark-600 text-white rounded-xl flex items-center justify-between border border-dark-350 shadow-lg">
      <h1 className="text-2xl font-semibold">{text}</h1>
    </div>
  )
}

export default Title