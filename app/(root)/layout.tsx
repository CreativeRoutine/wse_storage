"use client";

import React from "react";
import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { Toaster } from "@/components/ui/toaster"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="bg-dark-100 min-h-full pb-16 pl-[16px] sm:pl-[120px]  lg:pl-[300px] xl:pl-[395px]">
        <LeftSidebar />

        <div className="flex flex-col px-4 lg:px-16">
          <section className="sticky z-20 top-0 left-0 right-0 bg-dark-100 flex flex-col flex-1" >
            <Navbar />
          </section>

          <section className="pt-16 z-10">
            <div className="mx-auto w-full ">{children}</div>
          </section>
        </div>
        <Toaster />
      </main>
    </>
  );
};

export default Layout;
