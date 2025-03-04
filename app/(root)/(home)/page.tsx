import React from "react";
import Title from "@/components/shared/Title";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import VisitorNotification from "@/components/shared/VisitorNotification";
import { getData } from "@/lib/actions/printer.action";
import { SearchParamsProps } from "@/types";

const Home = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const mongoUserData = await getUserById({ userId });
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData));

  if (mongoUser.department === "visitor") {
    return <VisitorNotification />;
  }

  const printers = await getData();

  const {
    totalPrinters,
    totalPallets,
    refurbishedToday,
    refurbishedThisWeek,
    cleanedToday,
    cleanedThisWeek,
  } = printers;

  return (
    <>
      <Title text="Dashboard" />

      <div className="w-full text-4xl text-white font-bold">LAST UPD</div>

      <div className="flex gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4 ">
        {/* Storage */}
        <div className="card w-1/3 bg-dark-300 rounded-xl border border-dark-350 px-6 py-4">
          <div className="w-full text-white font-semibold text-lg mt-2">
            Storage
          </div>
          <div className="text-4xl text-white font-semibold mt-8 mb-4 flex justify-between">
            <div>
              {totalPrinters}{" "}
              <span className="text-base font-normal">printers</span>
            </div>
            <div>
              {totalPallets}{" "}
              <span className="text-base font-normal">pallets</span>
            </div>
          </div>
        </div>

        {/* Refurbished */}
        <div className="card w-1/3 bg-dark-400 rounded-xl border border-dark-350 px-6 py-4">
          <div className="w-full text-white font-semibold text-lg mt-2">
            Printers refurbished
          </div>
          <div className="text-4xl text-white font-semibold mt-8 mb-4 flex justify-between">
            <div>
              <div className="text-sm mb-2">Today:</div>
              <div>
                {refurbishedToday}{" "}
                <span className="text-base font-normal">printers</span>
              </div>
            </div>
            <div>
              <div className="text-sm mb-2">This week:</div>
              <div>
                {refurbishedThisWeek}{" "}
                <span className="text-base font-normal">printers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cleaned */}
        <div className="card w-1/3 bg-dark-300 rounded-xl border border-dark-350 px-6 py-4">
          <div className="w-full text-white font-semibold text-lg mt-2">
            Printers cleaned
          </div>
          <div className="text-4xl text-white font-semibold mt-8 mb-4 flex justify-between">
            <div>
              <div className="text-sm mb-2">Today:</div>
              <div>
                {cleanedToday}{" "}
                <span className="text-base font-normal">printers</span>
              </div>
            </div>
            <div>
              <div className="text-sm mb-2">This week:</div>
              <div>
                {cleanedThisWeek}{" "}
                <span className="text-base font-normal">printers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
