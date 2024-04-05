import React from 'react'
import Link from "next/link"

interface Props {
  title: string;
  users: {
    name: string;
  }[];

}

const UsersList = ({title, users}:Props) => {


  return (
    <>
      <div className="bg-secondary-200 px-8 py-6 w-1/3 rounded-xl border border-dark-350 shadow-lg">
        <div className='h3-bold text-lg font-bold mt-2 mb-6 text-white px-3'>{title}:</div>
        <div>
          <ul className=''>
            {
              users.map(user => {

                return (<li className="group flex justify-between items-center mb-1 py-2 px-3 text-slate-300  hover:rounded-lg hover:bg-dark-400" >
                  {user.name}
                  <Link className="hidden group-hover:block group-hover:text-sm group-hover:text-primary-500" href={`/user/:id`} >View</Link>
                  </li>)
              }
              )
            }
          </ul>    
        </div>

      </div>
    </>
  )
}

export default UsersList