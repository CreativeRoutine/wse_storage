"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TechForm from "@/components/shared/forms/TechForm";

// interface Techs {
//   id: number;
//   name: string;
// }

const techsList = [
  { id: 1, name: "Alex" },
  { id: 2, name: "Bakha" },
  { id: 3, name: "Michael" },
  { id: 4, name: "Vitalli" },
  { id: 5, name: "Vlad" },
  { id: 6, name: "Kee" },
];

const Techs = () => {
  const [activeTab, setActiveTab] = useState(techsList[0].name);
  const changeActiveUser = (name: string) => {
    setActiveTab(name);
  };
  return (
    <>
      <div className="container mx-auto flex flex-col py-2">
        <div className="text-bold text-3xl py-3">
          Current User - {activeTab}
        </div>

        <Tabs
          defaultValue={activeTab}
          className="flex w-full flex-col border-2 border-grey-200 rounded-lg overflow-hidden p-3"
        >
          <TabsList className="grid grid-flow-col justify-stretch gap-3">
            {techsList.map((tech) => (
              <TabsTrigger
                className="bg-black text-white active:text-white active:!border-1 active:border-black rounded-xl hover:bg-white hover:text-black hover:!border-1 hover:border-black p-2 text-center cursor-pointer transition-all duration-300 ease-in-out"
                key={tech.id}
                value={tech.name}
                onClick={() => changeActiveUser(tech.name)}
              >
                {tech.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {techsList.map((tech) => (
            <TabsContent
              key={tech.id}
              value={tech.name}
              className="bg-grey-900 border-1 rounded-lg border-grey p-4 mt-4"
            >
              <div className="flex flex-row justify-between">
                <h3 className="h3-bold">Add info to form mr. {tech.name}.</h3>
                <p className="text-lg ">
                  Printers done today -{" "}
                  <span className="text-bold text-lg">4</span>
                </p>
              </div>

              <section className="container mt-6 mx-auto">
                <TechForm />
              </section>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default Techs;
