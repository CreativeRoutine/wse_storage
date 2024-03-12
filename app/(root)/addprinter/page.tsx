import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddPrinterForm from "@/components/shared/forms/AddPrinterForm";

const addPrinter = () => {
  return (
    <>
      <div className="py-4 px-8 mb-12 bg-slate-100 rounded-2xl flex items-center justify-between border-slate-200 shadow-md">
        <h1 className="text-2xl font-semibold">Add Printer Page</h1>
      </div>

      <div className="bg-slate-100 rounded-2xl py-4 px-5">


        <div className="flex flex-row gap-2">
          {/* Column #1 */}
          <div className="bg-slate-200 px-5 py-5 rounded-xl w-1/2">
            <div className="mb-3">
              <div className="mb-6 py-3 text-lg font-bold border-b-2 border-slate-800">
                Warehouse's form
              </div>

              <AddPrinterForm />
            </div>
          </div>


        </div>
      </div>
    </>
  );
};

export default addPrinter;
