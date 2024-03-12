import React from "react";
import { Button } from "@/components/ui/button";
import { users } from "@/constants";
import Link from "next/link";

const Users = () => {
  return (
    <>
      <div className="py-4 px-6 bg-slate-100 rounded-md flex items-center justify-between mb-4 text-xl">
        <h1>Users</h1>
        <Button className="primary-gradient rounded-lg text-white">
          Add User
        </Button>
      </div>

      {/* TECHs */}
      <div className=" flex flex-col  justify-between mb-6">
        <div className="py-4 px-6 bg-slate-800 rounded-t-md">
          <h2 className="text-lg font-bold text-white">Techs:</h2>
        </div>

        <div className="bg-slate-100 py-4 px-6 rounded-b-md border-2 border-slate-200 shadow-lg">
          <div className="flex flex-row items-center font-semibold text-md mb-3 pb-3 border-b-2 border-slate-600">
            <span className="w-[40px] "># ID</span>
            <span className="flex flex-1 justify-start pl-3">Name</span>
            <span className="flex flex-1 justify-center ">Working models</span>
            <span className="flex flex-1 justify-center ">Printers done</span>
            <span className="flex flex-1 justify-center ">Returns</span>
            <span className="flex flex-1 justify-end  pr-2">Average time</span>
          </div>

          <div className="">
            {users.map((user) => {
              if (user.role === "tech") {
                return (
                  <div
                    key={user.id}
                    className="flex flex-row justify-between py-3 border-b border-slate-300 last:border-0"
                  >
                    <div className="flex w-[40px] justify-self-start">
                      {user.id}
                    </div>

                    <div className="flex justify-start pl-3 flex-1 hover:text-sky-500 ">
                      <Link href="/user">{user.name}</Link>
                    </div>

                    <div className="flex justify-center flex-1">
                      {user.listOfPrinters.length}
                    </div>

                    <div className="flex justify-center flex-1">
                      {user.printersMade}
                    </div>

                    <div className="flex justify-center flex-1">
                      {user.returns ? user.returnsQtty : "No"}
                    </div>

                    <div className="flex justify-end pr-2 flex-1">
                      {user.averageTime} mins.
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>

      {/* CLEANERS */}
      <div className=" flex flex-col  justify-between mb-4">
        <div className="py-4 px-6 bg-sky-800 rounded-t-md">
          <h2 className="text-lg font-bold text-white">Cleaners:</h2>
        </div>

        <div className="bg-slate-100 py-4 px-6 rounded-b-md border-2 border-slate-200 shadow-lg">
          <div className="flex flex-row items-center font-semibold text-md mb-3 pb-3 border-b-2 border-slate-600">
            <span className="w-[40px] "># ID</span>
            <span className="flex flex-1 justify-start pl-3">Name</span>
            <span className="flex flex-1 justify-center ">Printers done</span>
            <span className="flex flex-1 justify-center ">Returns</span>
            <span className="flex flex-1 justify-end  pr-2">Average time</span>
          </div>

          <div className="">
            {users.map((user) => {
              if (user.role === "cleaner") {
                return (
                  <div
                    key={user.id}
                    className="flex flex-row justify-between py-3 border-b border-slate-300 last:border-0"
                  >
                    <div className="flex w-[40px] justify-self-start">
                      {user.id}
                    </div>

                    <div className="flex justify-start pl-3 flex-1">
                      {user.name}
                    </div>

                    <div className="flex justify-center flex-1">
                      {user.printersMade}
                    </div>

                    <div className="flex justify-center flex-1">
                      {user.returns ? user.returnsQtty : "No"}
                    </div>

                    <div className="flex justify-end pr-2 flex-1">
                      {user.averageTime} mins.
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>

      {/* SUPERs */}
      <div className=" flex flex-col  justify-between mb-4">
        <div className="py-4 px-6 bg-lime-800 rounded-t-md">
          <h2 className="text-lg font-bold text-white">Supervisors:</h2>
        </div>

        <div className="bg-slate-100 py-4 px-6 rounded-b-md border-2 border-slate-200 shadow-lg">
          <div className="flex flex-row items-center font-semibold text-md mb-3 pb-3 border-b-2 border-slate-600">
            <span className="w-[40px] "># ID</span>
            <span className="flex flex-1 justify-start pl-3">Name</span>
            <span className="flex flex-1 justify-center ">Printers done</span>
            <span className="flex flex-1 justify-center ">Returns</span>
            <span className="flex flex-1 justify-end  pr-2">Average time</span>
          </div>

          <div className="">
            {users.map((user) => {
              if (user.role === "supervisor") {
                return (
                  <div
                    key={user.id}
                    className="flex flex-row justify-between py-3 border-b border-slate-300 last:border-0"
                  >
                    <div className="flex w-[40px] justify-self-start">
                      {user.id}
                    </div>

                    <div className="flex justify-start pl-3 flex-1">
                      {user.name}
                    </div>

                    <div className="flex justify-center flex-1">
                      {user.printersMade}
                    </div>

                    <div className="flex justify-center flex-1">
                      {user.returns ? user.returnsQtty : "No"}
                    </div>

                    <div className="flex justify-end pr-2 flex-1">
                      {user.averageTime} mins.
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
