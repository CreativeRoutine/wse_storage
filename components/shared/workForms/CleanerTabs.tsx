"use client";

import React, { useState } from "react";
import CleanerForm from "@/components/shared/workForms/CleanerForm";


interface Props {
  users: any[]; // Предполагается, что это массив объектов
}

const CleanerTabs = ({ users }: Props) => {
  // State для хранения форм
  const [forms, setForms] = useState([{ id: 1 }]);
  

  // Функция добавления новой формы
  const addForm = () => {
    setForms((prevForms) => [...prevForms, { id: prevForms.length + 1 }]);
  };

  // Функция удаления формы
  const removeForm = (id: number) => {
    setForms((prevForms) => prevForms.filter((form) => form.id !== id));
  };

  return (
    <div className="w-full">
      {/* Кнопка добавления формы */}
      <div className="w-full flex justify-end mb-4">
        

        <button
          onClick={addForm}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg pr-auto"
        >
          Add form
        </button>

      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {/* Рендеринг всех форм */}
        {forms.map((form) => (
          <div key={form.id} className="mb-4 p-2 rounded shadow-md  min-w-1/3 flex flex-col items-start">
            <CleanerForm users={users} />
            <button
              onClick={() => removeForm(form.id)}
              className="px-3 py-1 bg-red-500 text-white rounded w-1/3 -mt-[60px] ml-6"
            >
              Delete form
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleanerTabs;