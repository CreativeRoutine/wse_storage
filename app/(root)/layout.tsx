import React from "react";
import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const mongoUserData = await getUserById({ userId });
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData));

  return (
    <>
      <main className="bg-dark-100 min-h-full pb-16 pl-[16px] sm:pl-28 xl:pl-96 ">
        <LeftSidebar />

        <div className="flex flex-col px-4 lg:px-16">
          <section className="sticky z-20 top-0 left-0 right-0 bg-dark-100 flex flex-col flex-1 print:hidden">
            <Navbar role={mongoUser.department} />
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
