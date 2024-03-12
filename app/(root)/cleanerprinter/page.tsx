import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CleanerForm from "@/components/shared/forms/CleanerForm";

const cleanerPrinter = () => {
  return (
    <>
      <div className="py-4 px-8 mb-12 bg-slate-100 rounded-2xl flex items-center justify-between border-slate-200 shadow-md">
        <h1 className="text-2xl font-semibold">Cleaner Printer Page</h1>
      </div>

      <div className="bg-slate-100 rounded-2xl py-4 px-5">
        {/* Heading with button */}
        <div className="mb-6 font-semibold text-lg text-slate-600 bg-slate-200 px-5 py-3 rounded-xl flex justify-between">
          <div>Need more form?</div>
          <div>
            <Link href="/parts" className="text-sky-500">
              Add form
            </Link>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          {/* Column #1 */}
          <div className="bg-slate-200 px-5 py-5 rounded-xl w-1/2">
            <div className="mb-3">
              <div className="mb-6 py-3 text-lg font-bold border-b-2 border-slate-800">
                Hanna's form
              </div>
              
              <CleanerForm />
            </div>
          </div>

          {/* Column #2 */}
          <div className="bg-slate-200 px-5 py-5 rounded-xl w-1/2">
            <div className="mb-3">
              <div className="mb-6 py-3 text-lg font-bold border-b-2 border-slate-800">
                Daniela's form
              </div>
              <h3 className="mb-2 font-semibold">Serial number:</h3>
              <div className="flex flex-row gap-2">
                <Input
                  className="w-2/3 ouline-none"
                  placeholder="use scanner"
                />
                <Button asChild>
                  <Link
                    href="/users"
                    className="primary-gradient text-white font-bold text-md w-1/3"
                  >
                    Find
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default cleanerPrinter;
