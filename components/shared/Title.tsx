import React from 'react'

interface Props {
    text: string;
}

const Title = ({text}:Props) => {
  return (
    <div className="py-8 px-8 mb-12 bg-dark-600 text-white rounded-xl flex items-center justify-between border border-dark-350 shadow-lg">
        <h1 className="text-2xl font-semibold">{text}</h1>
      </div>
  )
}

export default Title