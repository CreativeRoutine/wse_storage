"use client";

import React from "react";
import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/LeftSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="bg-dark-100 min-h-full pl-[395px] pb-16">
        <LeftSidebar />

        <div className="flex flex-col px-16">
          <section className="sticky top-0 left-0 right-0 bg-dark-100 flex flex-col flex-1" >
            <Navbar />
          </section>

          <section className="pt-16">
            <div className="mx-auto w-full ">{children}</div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Layout;
